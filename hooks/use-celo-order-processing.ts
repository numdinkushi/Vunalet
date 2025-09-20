import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CELO_CONTRACT_ADDRESS, VUNALET_PAYMENTS_ABI } from '../constants/celo';
import { PAYMENT_SECURITY, convertZarToCelo, calculatePlatformFee } from '../constants/payments';
import { Id } from '../convex/_generated/dataModel';

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
        console.log(' CELO Order Processing Started!', { orderData, user: user?.id, address, isConnected });

        if (!user || !address || !isConnected) {
            console.log('❌ CELO Order Failed: Missing user/wallet connection');
            toast.error('Please connect your wallet and sign in');
            return { success: false };
        }

        if (isProcessing) {
            console.log('❌ CELO Order Failed: Already processing');
            toast.error('Order is already being processed. Please wait...');
            return { success: false };
        }

        console.log('✅ CELO Order: Starting processing...');
        setIsProcessing(true);

        try {
            // 1. Get farmer CELO address (dispatcher will be assigned later via claim window)
            console.log('🔍 Fetching CELO addresses for farmer:', { farmerId: orderData.farmerId });

            const farmerProfile = await fetch(`/api/users/celo-address?userId=${orderData.farmerId}`).then(r => {
                console.log('Farmer API response status:', r.status);
                return r.json();
            }).catch((error) => {
                console.error('Farmer API fetch error:', error);
                return null;
            });

            const celoFarmerAddress = farmerProfile?.celoAddress;
            const celoPlatformAddress = process.env.NEXT_PUBLIC_PLATFORM_CELO_ADDRESS;

            // Check for missing CELO addresses
            const missingAddresses: string[] = [];
            if (!celoFarmerAddress || celoFarmerAddress === 'unset') {
                missingAddresses.push('Farmer');
            }

            if (missingAddresses.length > 0) {
                const message = `${missingAddresses.join(' and ')} CELO address${missingAddresses.length > 1 ? 'es are' : ' is'} not configured. Please ask them to set up their CELO address or use Lisk ZAR payment instead.`;
                console.log('❌ Missing CELO addresses:', { missingAddresses, celoFarmerAddress });
                toast.error(message);
                return { success: false };
            }

            // 2. Create order with CELO addresses (NO DISPATCHER ASSIGNMENT YET - will be claimed)
            const orderDataWithCelo = {
                ...orderData,
                dispatcherId: undefined, // Remove auto-assignment - let dispatchers claim
                paymentMethod: 'celo' as const,
                paymentStatus: 'pending' as const,
                orderStatus: 'pending' as const,
                celoFromAddress: address,
                celoFarmerAddress,
                celoDispatcherAddress: undefined, // Will be set when dispatcher claims
                celoPlatformAddress,
            };

            console.log('Order data being sent to createOrder:', orderDataWithCelo);

            const orderId = await createOrder(orderDataWithCelo);

            console.log('Order created with ID:', orderId);
            console.log('CELO addresses that should be saved:', {
                celoFromAddress: address,
                celoFarmerAddress,
                celoPlatformAddress
            });

            toast.success('Order created successfully! Dispatchers can now claim it within 10 minutes.');

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

    // New function for processing CELO payment when buyer wants to pay
    const processCeloPayment = async (orderId: string, totalAmount: number) => {
        console.log('💰 Processing CELO Payment for order:', orderId, 'Amount:', totalAmount);

        if (!user || !address || !isConnected) {
            toast.error('Please connect your wallet and sign in');
            return { success: false };
        }

        if (isProcessing) {
            toast.error('Payment is already being processed. Please wait...');
            return { success: false };
        }

        // Validate contract address
        if (!CELO_CONTRACT_ADDRESS) {
            console.error('❌ Contract address not configured');
            toast.error('Contract address not configured. Please contact support.');
            return { success: false };
        }

        console.log('✅ Contract address validated:', CELO_CONTRACT_ADDRESS);

        setIsProcessing(true);

        try {
            // Get the order to retrieve CELO addresses
            const order = await fetch(`/api/orders/${orderId}`).then(r => r.json()).catch(() => null);

            if (!order) {
                console.error('❌ Order not found:', orderId);
                toast.error('Order not found');
                return { success: false };
            }

            console.log('📋 Order retrieved:', {
                orderId: order._id,
                celoFarmerAddress: order.celoFarmerAddress,
                celoDispatcherAddress: order.celoDispatcherAddress,
                celoPlatformAddress: order.celoPlatformAddress,
                farmerAmount: order.farmerAmount,
                dispatcherAmount: order.dispatcherAmount
            });

            if (!order.celoFarmerAddress || !order.celoDispatcherAddress || !order.celoPlatformAddress) {
                console.error('❌ Missing CELO addresses in order:', {
                    celoFarmerAddress: order.celoFarmerAddress,
                    celoDispatcherAddress: order.celoDispatcherAddress,
                    celoPlatformAddress: order.celoPlatformAddress
                });
                toast.error('CELO addresses not found in order. Please contact support.');
                return { success: false };
            }

            // Convert amounts to CELO
            const baseCeloAmount = convertZarToCelo(totalAmount);
            const platformFeeCelo = calculatePlatformFee(baseCeloAmount);
            const celoAmount = baseCeloAmount + platformFeeCelo;
            const farmerCeloAmount = convertZarToCelo(order.farmerAmount);
            const dispatcherCeloAmount = convertZarToCelo(order.dispatcherAmount);

            console.log('💰 Amount conversions:', {
                totalAmount,
                celoAmount,
                farmerAmount: order.farmerAmount,
                farmerCeloAmount,
                dispatcherAmount: order.dispatcherAmount,
                dispatcherCeloAmount
            });

            // Set state for transaction tracking
            setCurrentOrderId(orderId);
            setCurrentTotalAmount(totalAmount);

            // Validate payment secret
            if (!PAYMENT_SECURITY.SECRET) {
                console.error('❌ Payment secret not configured');
                toast.error('Payment configuration error. Please contact support.');
                return { success: false };
            }

            console.log('🚀 Calling smart contract with:', {
                contractAddress: CELO_CONTRACT_ADDRESS,
                orderId,
                farmerAddress: order.celoFarmerAddress,
                dispatcherAddress: order.celoDispatcherAddress,
                farmerAmount: parseEther(farmerCeloAmount.toString()),
                dispatcherAmount: parseEther(dispatcherCeloAmount.toString()),
                platformAmount: parseEther(platformFeeCelo.toString()),
                totalValue: parseEther(celoAmount.toString()),
                baseAmount: parseEther(baseCeloAmount.toString()),
                platformFee: parseEther(platformFeeCelo.toString()),
                secret: PAYMENT_SECURITY.SECRET
            });
            // Process CELO payment through smart contract
            await writeContract({
                address: CELO_CONTRACT_ADDRESS,
                abi: VUNALET_PAYMENTS_ABI,
                functionName: 'processOrderPayment',
                args: [
                    orderId,
                    order.celoFarmerAddress as `0x${string}`,
                    order.celoDispatcherAddress as `0x${string}`,
                    parseEther(farmerCeloAmount.toString()),
                    parseEther(dispatcherCeloAmount.toString()),
                    parseEther(platformFeeCelo.toString()),
                    PAYMENT_SECURITY.SECRET
                ],
                value: parseEther(celoAmount.toString()),
            });

            console.log('✅ Transaction submitted successfully');
            toast.success('Transaction submitted! Please wait for confirmation...');
            return { success: true };

        } catch (error) {
            console.error('❌ CELO payment processing failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
            toast.error(`Payment failed: ${errorMessage}`);
            return { success: false, error: errorMessage };
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle successful transaction
    const handleTransactionSuccess = async (orderId: string, txHash: string, blockNumber?: number, totalAmount?: number) => {
        try {
            console.log('🎉 Transaction confirmed:', { orderId, txHash, blockNumber, totalAmount });

            // Update order with CELO payment details
            await updateCeloPayment({
                orderId: orderId as Id<"orders">,
                celoTxHash: txHash,
                celoBlockNumber: blockNumber,
                celoFromAddress: address!,
                celoAmountPaid: totalAmount ? convertZarToCelo(totalAmount) : 0,
            });

            console.log('✅ Order updated with payment details');
            toast.success('Order placed and payment processed successfully!');

        } catch (error) {
            console.error('❌ Failed to update CELO payment details:', error);
            toast.error('Payment processed but failed to update order. Please contact support.');
        }
    };

    return {
        processOrderWithCeloPayment,
        processCeloPayment, // New function for payment processing
        handleTransactionSuccess,
        isProcessing: isProcessing || isPending || isConfirming,
        hash,
        isConfirmed,
        error,
    };
} 