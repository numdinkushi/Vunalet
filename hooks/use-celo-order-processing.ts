import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CELO_CONTRACT_ADDRESS, VUNALET_PAYMENTS_ABI } from '../constants/celo';
import { PAYMENT_SECURITY, convertZarToCelo } from '../constants/payments';

interface CeloOrderData {
    buyerId: string;
    farmerId: string;
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
    specialInstructions?: string;
    estimatedPickupTime?: string;
    estimatedDeliveryTime?: string;
}

export function useCeloOrderProcessing() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const [currentTotalAmount, setCurrentTotalAmount] = useState<number>(0);
    const { user } = useUser();
    const { address, isConnected, chain } = useAccount();

    // Convex mutations
    const createOrder = useMutation(api.orders.createOrder);
    const updateCeloPayment = useMutation(api.orders.updateCeloPayment);
    const autoAssignDispatcher = useMutation(api.users.autoAssignDispatcher);
    const updateProductQuantity = useMutation(api.products.updateProductQuantity);

    // Get user profiles for CELO addresses
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Wagmi hooks for contract interaction
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
        hash,
    });

    // Handle transaction confirmation
    useEffect(() => {
        if (isConfirmed && hash && currentOrderId) {
            handleTransactionSuccess(
                currentOrderId,
                hash,
                receipt?.blockNumber ? Number(receipt.blockNumber) : undefined,
                currentTotalAmount
            );
            // Reset state
            setCurrentOrderId(null);
            setCurrentTotalAmount(0);
        }
    }, [isConfirmed, hash, currentOrderId, receipt, currentTotalAmount]);

    const processOrderWithCeloPayment = async (orderData: CeloOrderData) => {
        if (!user || !address || !isConnected) {
            toast.error('Please connect your wallet and sign in');
            return { success: false };
        }

        if (isProcessing) {
            toast.error('Order is already being processed. Please wait...');
            return { success: false };
        }

        setIsProcessing(true);

        try {
            // 1. Auto-assign dispatcher
            const dispatcherAssignment = await autoAssignDispatcher({
                deliveryAddress: orderData.deliveryAddress,
                deliveryCoordinates: orderData.deliveryCoordinates,
            });

            const dispatcherId = dispatcherAssignment.dispatcherId;

            if (!dispatcherId) {
                toast.error('No dispatcher available for your location');
                return { success: false };
            }

            // 2. Get farmer and dispatcher CELO addresses
            const [farmerProfile, dispatcherProfile] = await Promise.all([
                fetch(`/api/users/celo-address?userId=${orderData.farmerId}`).then(r => r.json()).catch(() => null),
                fetch(`/api/users/celo-address?userId=${dispatcherId}`).then(r => r.json()).catch(() => null)
            ]);

            const celoFarmerAddress = farmerProfile?.celoAddress;
            const celoDispatcherAddress = dispatcherProfile?.celoAddress;
            const celoPlatformAddress = process.env.NEXT_PUBLIC_PLATFORM_CELO_ADDRESS;

            // Detailed validation with specific error messages
            if (!celoPlatformAddress) {
                toast.error('Platform CELO address not configured. Please contact support.');
                return { success: false };
            }

            const missingAddresses = [];
            if (!celoFarmerAddress) {
                missingAddresses.push('Farmer');
            }
            if (!celoDispatcherAddress) {
                missingAddresses.push('Dispatcher');
            }

            if (missingAddresses.length > 0) {
                const message = `${missingAddresses.join(' and ')} CELO address${missingAddresses.length > 1 ? 'es are' : ' is'} not configured. Please ask them to set up their CELO address or use Lisk ZAR payment instead.`;
                toast.error(message);
                return { success: false };
            }

            // 3. Create order first
            const orderId = await createOrder({
                ...orderData,
                dispatcherId,
                paymentMethod: 'celo',
                paymentStatus: 'pending',
                orderStatus: 'pending',
                celoFarmerAddress,
                celoDispatcherAddress,
                celoPlatformAddress,
            });

            // 4. Convert amounts to CELO
            const celoAmount = convertZarToCelo(orderData.totalCost);
            const farmerCeloAmount = convertZarToCelo(orderData.farmerAmount);
            const dispatcherCeloAmount = convertZarToCelo(orderData.dispatcherAmount);

            // 5. Set state for transaction tracking
            setCurrentOrderId(orderId);
            setCurrentTotalAmount(orderData.totalCost);

            // 6. Process CELO payment through smart contract
            await writeContract({
                address: CELO_CONTRACT_ADDRESS,
                abi: VUNALET_PAYMENTS_ABI,
                functionName: 'processOrderPayment',
                args: [
                    orderId,
                    celoFarmerAddress as `0x${string}`,
                    celoDispatcherAddress as `0x${string}`,
                    parseEther(farmerCeloAmount.toString()),
                    parseEther(dispatcherCeloAmount.toString()),
                    PAYMENT_SECURITY.SECRET
                ],
                value: parseEther(celoAmount.toString()),
            });

            toast.success('Transaction submitted! Please wait for confirmation...');
            return { success: true, orderId };

        } catch (error) {
            console.error('CELO order processing failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Order processing failed';
            toast.error(`Order failed: ${errorMessage}`);
            return { success: false, error: errorMessage };
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle successful transaction
    const handleTransactionSuccess = async (orderId: string, txHash: string, blockNumber?: number, totalAmount?: number) => {
        try {
            // Update order with CELO payment details
            await updateCeloPayment({
                orderId,
                celoTxHash: txHash,
                celoBlockNumber: blockNumber,
                celoFromAddress: address!,
                celoAmountPaid: totalAmount ? convertZarToCelo(totalAmount) : 0,
            });

            toast.success('Order placed and payment processed successfully!');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard';
                }
            }, 2000);

        } catch (error) {
            console.error('Failed to update CELO payment details:', error);
            toast.error('Payment processed but failed to update order. Please contact support.');
        }
    };

    return {
        processOrderWithCeloPayment,
        handleTransactionSuccess,
        isProcessing: isProcessing || isPending || isConfirming,
        hash,
        isConfirmed,
        error,
    };
} 