import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';
import { DELIVERY_CONSTANTS } from '../constants/delivery';

interface OrderData {
    buyerId: string;
    farmerId: string;
    dispatcherId: string; // This will be auto-assigned
    products: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        unit: string;
    }>;
    totalAmount: number;
    farmerAmount: number;
    dispatcherAmount: number;
    deliveryAddress: string;
    deliveryCoordinates?: { lat: number; lng: number; };
    pickupLocation?: string;
    pickupCoordinates?: { lat: number; lng: number; };
    deliveryDistance: number;
    deliveryCost: number;
    totalCost: number;
    paymentMethod: "lisk_zar" | "cash";
    specialInstructions?: string;
    estimatedPickupTime?: string;
    estimatedDeliveryTime?: string;
}

interface ConfirmDeliveryData {
    buyerId: string;
    buyerLiskId: string;
    farmerId: string;
    farmerPaymentId: string;
    dispatcherId?: string; // Add this
    dispatcherAmount?: number; // Add this
    farmerAmount: number; // Add this
    totalCost: number;
    products: Array<{ name: string; }>;
}

interface UserProfile {
    _id: string;
    clerkUserId: string;
    liskId?: string;
    // ... other fields
}

// Helper function to get current wallet balance
const getCurrentWalletBalance = async (liskId: string): Promise<number> => {
    try {
        console.log('Fetching wallet balance for liskId:', liskId);
        const response = await fetch(`/api/stablecoin/balance/${liskId}`);

        // Check if response is ok before trying to parse JSON
        if (!response.ok) {
            console.error('Balance API returned error status:', response.status, response.statusText);
            // If user doesn't exist in stablecoin system, return 0 instead of throwing
            if (response.status === 404) {
                console.log('User not found in stablecoin system, returning 0 balance');
                return 0;
            }
            return 0;
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Balance API returned non-JSON response:', contentType);
            // Log the actual response text for debugging
            const responseText = await response.text();
            console.error('Response text:', responseText.substring(0, 200)); // First 200 chars
            return 0;
        }

        const balance = await response.json();
        console.log('Balance API response:', balance);
        const tokens = balance?.tokens || [];
        const zarToken = tokens.find((t: { name: string; balance: string | number; }) => t.name === 'L ZAR Coin');
        const result = zarToken ? Number(zarToken.balance) : 0;
        console.log('Wallet balance result:', result);
        return result;
    } catch (error) {
        console.error('Failed to get wallet balance:', error);
        return 0;
    }
};

export function useOrderManagement(userProfile?: UserProfile) {
    const { user } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);

    const createOrder = useMutation(api.orders.createOrder);
    const createDelivery = useMutation(api.orders.createDelivery);
    const autoAssignDispatcher = useMutation(api.users.autoAssignDispatcher);
    const createDeliveryNotification = useMutation(api.notifications.createDeliveryNotification);
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
    const processPaymentTransfer = useMutation(api.orders.processPaymentTransfer);
    const updateBalance = useMutation(api.balances.upsertUserBalance);
    const updateProductQuantity = useMutation(api.products.updateProductQuantity);

    const initiateOrder = async (orderData: Omit<OrderData, 'dispatcherId'>) => {
        if (!user) {
            toast.error('Please sign in to place an order');
            return null;
        }

        // Prevent multiple submissions
        if (isProcessing) {
            toast.error('Order is already being processed. Please wait...');
            return null;
        }

        setIsProcessing(true);
        try {
            // 1. Auto-assign dispatcher
            const assignmentResult = await autoAssignDispatcher({});

            if (!assignmentResult.dispatcherId) {
                toast.error('No dispatchers available for assignment');
                return null;
            }

            const dispatcherId = assignmentResult.dispatcherId;

            // Calculate amounts
            const farmerAmount = orderData.totalAmount; // Product cost goes to farmer
            const dispatcherAmount = orderData.deliveryCost; // Delivery cost goes to dispatcher

            // 2. Create order with assigned dispatcher
            const orderId = await createOrder({
                ...orderData,
                dispatcherId,
                farmerAmount,
                dispatcherAmount,
                paymentStatus: "pending",
                orderStatus: "pending",
            });

            // 3. Create delivery record for the dispatcher
            await createDelivery({
                orderId,
                dispatcherId,
                pickupLocation: orderData.pickupLocation || "Farm Location",
                deliveryLocation: orderData.deliveryAddress,
                pickupCoordinates: orderData.pickupCoordinates,
                deliveryCoordinates: orderData.deliveryCoordinates,
                estimatedPickupTime: orderData.estimatedPickupTime,
                estimatedDeliveryTime: orderData.estimatedDeliveryTime,
                notes: orderData.specialInstructions,
            });

            // 4. Create notification for dispatcher
            await createDeliveryNotification({
                dispatcherId,
                orderId,
                pickupLocation: orderData.pickupLocation || "Farm Location",
                deliveryLocation: orderData.deliveryAddress,
                estimatedPickupTime: orderData.estimatedPickupTime,
                estimatedDeliveryTime: orderData.estimatedDeliveryTime,
            });

            // 5. Update product quantity for each product in the order
            for (const product of orderData.products) {
                await updateProductQuantity({
                    productId: product.productId,
                    quantityReduced: product.quantity,
                });
            }

            // 6. Update buyer's wallet balance (decrease by total cost)
            if (!userProfile?.liskId) {
                console.log('No Lisk ID found for user profile, using local balance system');
                // Fall back to local balance system - just update the local balance
                await updateBalance({
                    clerkUserId: user.id,
                    token: 'L ZAR Coin',
                    walletBalance: 0, // Assume they have enough balance locally
                    ledgerBalance: 0, // Ledger balance is calculated from pending orders
                });
            } else {
                const currentBuyerBalance = await getCurrentWalletBalance(userProfile.liskId);
                const newBuyerWalletBalance = currentBuyerBalance - orderData.totalCost;

                await updateBalance({
                    clerkUserId: user.id,
                    token: 'L ZAR Coin',
                    walletBalance: newBuyerWalletBalance, // Decrease wallet balance
                    ledgerBalance: 0, // Ledger balance is calculated from pending orders
                });
            }

            // Note: No need to update farmer and dispatcher ledger balances
            // They are now calculated automatically from pending orders

            toast.success(`Order initiated successfully! Assigned to dispatcher. Redirecting to dashboard...`);

            // Wait a bit longer to ensure all operations complete before redirecting
            setTimeout(() => {
                // Clear any pending requests and redirect
                try {
                    // Abort any pending fetch requests
                    if (typeof AbortController !== 'undefined') {
                        const controller = new AbortController();
                        controller.abort();
                    }

                    // Use window.location.href for a full page reload to ensure clean state
                    window.location.href = '/dashboard';
                } catch (redirectError) {
                    console.error('Redirect error:', redirectError);
                    // Fallback redirect
                    window.location.href = '/dashboard';
                }
            }, 2000);

            return orderId;
        } catch (error) {
            console.error('Failed to initiate order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to initiate order';
            toast.error(errorMessage);
            return null;
        } finally {
            setIsProcessing(false);
        }
    };

    const markAsDelivered = async (orderId: string) => {
        setIsProcessing(true);
        try {
            await updateOrderStatus({
                orderId,
                orderStatus: "delivered",
                actualDeliveryTime: new Date().toISOString(),
            });

            toast.success('Order marked as delivered!');
        } catch (error) {
            console.error('Failed to mark as delivered:', error);
            toast.error('Failed to mark as delivered. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmDelivery = async (orderId: string, orderData: ConfirmDeliveryData) => {
        setIsProcessing(true);
        try {
            // 1. Call the transfer endpoint
            const transferResponse = await fetch(`/api/stablecoin/transfer/${orderData.buyerLiskId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transactionAmount: orderData.totalCost,
                    transactionRecipient: orderData.farmerPaymentId,
                    transactionNotes: `Order ${orderId} - ${orderData.products[0]?.name || 'Product'}`
                })
            });

            if (!transferResponse.ok) {
                throw new Error('Transfer failed');
            }

            // 2. Process payment transfer in Convex
            await processPaymentTransfer({
                orderId,
                buyerLiskId: orderData.buyerLiskId,
                farmerPaymentId: orderData.farmerPaymentId,
                amount: orderData.totalCost,
                notes: `Order ${orderId} - ${orderData.products[0]?.name || 'Product'}`
            });

            // 3. Update order status to delivered (this will automatically update ledger balances)
            await updateOrderStatus({
                orderId,
                orderStatus: "delivered",
            });

            // 4. Update wallet balances for farmer and dispatcher
            const currentFarmerBalance = await getCurrentWalletBalance(orderData.farmerId);
            const newFarmerBalance = currentFarmerBalance + orderData.farmerAmount;
            await updateBalance({
                clerkUserId: orderData.farmerId,
                token: 'L ZAR Coin',
                walletBalance: newFarmerBalance, // Credit farmer's wallet
                ledgerBalance: 0, // Ledger balance is calculated from pending orders
            });

            if (orderData.dispatcherId) {
                const currentDispatcherBalance = await getCurrentWalletBalance(orderData.dispatcherId);
                const newDispatcherBalance = currentDispatcherBalance + (orderData.dispatcherAmount || 0);
                await updateBalance({
                    clerkUserId: orderData.dispatcherId,
                    token: 'L ZAR Coin',
                    walletBalance: newDispatcherBalance, // Credit dispatcher's wallet
                    ledgerBalance: 0, // Ledger balance is calculated from pending orders
                });
            }

            toast.success('Delivery confirmed! Payment processed successfully.');
        } catch (error) {
            console.error('Failed to confirm delivery:', error);
            toast.error('Failed to confirm delivery. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isProcessing,
        initiateOrder,
        markAsDelivered,
        confirmDelivery,
    };
} 