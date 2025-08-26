import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';

interface OrderData {
    buyerId: string;
    farmerId: string;
    dispatcherId?: string;
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
    deliveryCoordinates?: {
        lat: number;
        lng: number;
    };
    pickupLocation?: string;
    pickupCoordinates?: {
        lat: number;
        lng: number;
    };
    deliveryDistance: number;
    deliveryCost: number;
    totalCost: number;
    paymentMethod: 'lisk_zar' | 'cash';
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
    specialInstructions?: string;
    estimatedPickupTime?: string;
    estimatedDeliveryTime?: string;
}

interface UserProfile {
    clerkUserId: string;
    role?: 'buyer' | 'farmer' | 'dispatcher';
    liskId?: string;
    // ... other fields
}

// Helper function to validate buyer's wallet balance
const validateBuyerBalance = async (liskId: string, totalCost: number): Promise<{ isValid: boolean; currentBalance: number; error?: string; }> => {
    try {
        // Get current balance from stablecoin API
        const response = await fetch(`/api/stablecoin/balance/${liskId}`);

        if (!response.ok) {
            return {
                isValid: false,
                currentBalance: 0,
                error: 'Unable to verify wallet balance. Please refresh your balance and try again.'
            };
        }

        const data = await response.json();
        const tokens = data?.tokens || [];
        const zarToken = tokens.find((t: { name: string; balance: string | number; }) => t.name === 'L ZAR Coin');
        const currentBalance = zarToken ? Number(zarToken.balance) : 0;

        if (currentBalance < totalCost) {
            return {
                isValid: false,
                currentBalance,
                error: `Insufficient funds. You have R${currentBalance.toFixed(2)} but need R${totalCost.toFixed(2)}. Please add funds to your wallet.`
            };
        }

        return {
            isValid: true,
            currentBalance
        };
    } catch (error) {
        console.error('Failed to validate buyer balance:', error);
        return {
            isValid: false,
            currentBalance: 0,
            error: 'Unable to verify wallet balance. Please try again.'
        };
    }
};

export function useOrderManagement() {
    const { user } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);

    // Get user profile to determine role and liskId
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    const createOrder = useMutation(api.orders.createOrder);
    const autoAssignDispatcher = useMutation(api.users.autoAssignDispatcher);
    const createDeliveryNotification = useMutation(api.notifications.createDeliveryNotification);
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
    const updateProductQuantity = useMutation(api.products.updateProductQuantity);

    const initiateOrder = async (orderData: Omit<OrderData, 'dispatcherId'>) => {
        if (!user) {
            toast.error('Please sign in to place an order');
            return;
        }

        // Check if userProfile is still loading
        if (userProfile === undefined) {
            toast.error('Loading user profile. Please try again in a moment.');
            return;
        }

        // Check if userProfile exists but doesn't have liskId
        if (!userProfile?.liskId) {
            toast.error('Payment account not found. Please complete your profile setup.');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Validate buyer's wallet balance before creating order
            const balanceValidation = await validateBuyerBalance(userProfile.liskId, orderData.totalCost);

            if (!balanceValidation.isValid) {
                toast.error(balanceValidation.error || 'Balance validation failed');
                return;
            }

            // 2. Auto-assign dispatcher
            const dispatcherAssignment = await autoAssignDispatcher({});
            const dispatcherId = dispatcherAssignment.dispatcherId;

            if (!dispatcherId) {
                toast.error('No dispatcher available at the moment. Please try again later.');
                return;
            }

            // 3. Create the order
            const orderId = await createOrder({
                buyerId: orderData.buyerId,
                farmerId: orderData.farmerId,
                dispatcherId,
                products: orderData.products,
                totalAmount: orderData.totalAmount,
                farmerAmount: orderData.farmerAmount,
                dispatcherAmount: orderData.dispatcherAmount,
                deliveryAddress: orderData.deliveryAddress,
                deliveryCoordinates: orderData.deliveryCoordinates,
                pickupLocation: orderData.pickupLocation,
                pickupCoordinates: orderData.pickupCoordinates,
                deliveryDistance: orderData.deliveryDistance,
                deliveryCost: orderData.deliveryCost,
                totalCost: orderData.totalCost,
                paymentMethod: orderData.paymentMethod,
                paymentStatus: orderData.paymentStatus,
                orderStatus: orderData.orderStatus,
                specialInstructions: orderData.specialInstructions,
                estimatedPickupTime: orderData.estimatedPickupTime,
                estimatedDeliveryTime: orderData.estimatedDeliveryTime,
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

            // Note: No manual wallet balance updates here
            // Wallet balance will be updated when order is confirmed via bulk payment
            // Ledger balance is calculated automatically from pending orders

            toast.success('Order placed successfully! Your order is being processed.');

            // Redirect to dashboard after successful order placement
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } catch (error) {
            console.error('Failed to place order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmDelivery = async (orderId: string) => {
        if (!user) {
            toast.error('Please sign in to confirm delivery');
            return;
        }

        setIsProcessing(true);

        try {
            await updateOrderStatus({
                orderId,
                orderStatus: 'delivered',
            });

            await updatePaymentStatus({
                orderId,
                paymentStatus: 'paid',
            });

            toast.success('Delivery confirmed successfully!');
        } catch (error) {
            console.error('Failed to confirm delivery:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to confirm delivery';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        initiateOrder,
        confirmDelivery,
        isProcessing,
    };
} 