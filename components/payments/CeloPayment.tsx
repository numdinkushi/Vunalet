'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { celo } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Wallet, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import {
    CELO_CONTRACT_ADDRESS,
    VUNALET_PAYMENTS_ABI,
    CELO_NETWORKS,
    convertZarToCelo,
    calculatePlatformFee,
    Currency,
    PAYMENT_SECURITY,
    DIVVI_CONFIG
} from '@/constants';
import { submitReferral } from '@divvi/referral-sdk';
import { WalletConnect } from '@/components/web3/WalletConnect';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface CeloPaymentProps {
    zarAmount: number;
    orderId: string;
    farmerAddress: string;
    dispatcherAddress?: string;
    farmerZarAmount: number;
    dispatcherZarAmount: number;
    onPaymentSuccess: (txHash: string) => void;
    onPaymentError: (error: string) => void;
}

export function CeloPayment({
    zarAmount,
    orderId,
    farmerAddress,
    dispatcherAddress,
    farmerZarAmount,
    dispatcherZarAmount,
    onPaymentSuccess,
    onPaymentError
}: CeloPaymentProps) {
    const { address, isConnected, chain } = useAccount();
    const [isProcessing, setIsProcessing] = useState(false);

    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Convex mutations for order updates
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
    const updateCeloPayment = useMutation(api.orders.updateCeloPayment);

    // Convert amounts to CELO - Frontend is the single source of truth
    const baseCeloAmount = convertZarToCelo(zarAmount);
    const farmerCeloAmount = convertZarToCelo(farmerZarAmount);
    const dispatcherCeloAmount = convertZarToCelo(dispatcherZarAmount);

    // Calculate platform fee and total amount including fee
    const platformFeeCelo = calculatePlatformFee(baseCeloAmount);
    const totalCeloAmount = baseCeloAmount + platformFeeCelo;

    const isCorrectChain = chain?.id === CELO_NETWORKS.MAINNET.chainId || chain?.id === CELO_NETWORKS.ALFAJORES.chainId;

    const handlePayment = async () => {
        console.log('🚀 Starting CELO payment process...');
        console.log('💰 Payment breakdown:', {
            baseAmount: baseCeloAmount,
            farmerAmount: farmerCeloAmount,
            dispatcherAmount: dispatcherCeloAmount,
            platformFee: platformFeeCelo,
            totalAmount: totalCeloAmount
        });

        if (!isConnected || !address) {
            onPaymentError('Please connect your wallet first');
            return;
        }

        if (!isCorrectChain) {
            onPaymentError('Please switch to Celo network');
            return;
        }

        if (!CELO_CONTRACT_ADDRESS) {
            onPaymentError('Contract address not configured');
            return;
        }

        setIsProcessing(true);

        try {
            await writeContract({
                address: CELO_CONTRACT_ADDRESS,
                abi: VUNALET_PAYMENTS_ABI,
                functionName: 'processOrderPayment',
                args: [
                    orderId,
                    farmerAddress as `0x${string}`,
                    (dispatcherAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
                    parseEther(farmerCeloAmount.toString()),
                    parseEther(dispatcherCeloAmount.toString()),
                    parseEther(platformFeeCelo.toString()),
                    PAYMENT_SECURITY.SECRET
                ],
                value: parseEther(totalCeloAmount.toString()), // Send total amount including platform fee
            });

            console.log('✅ Transaction submitted to blockchain');
        } catch (error) {
            console.error('❌ Payment failed:', error);

            // Handle different types of errors gracefully
            let errorMessage = 'Payment failed';

            if (error instanceof Error) {
                if (error.message.includes('User rejected') ||
                    error.message.includes('User denied') ||
                    error.message.includes('denied transaction signature') ||
                    error.message.includes('User rejected the request')) {
                    errorMessage = 'Transaction cancelled';
                    toast.info('Transaction cancelled');
                } else if (error.message.includes('insufficient funds')) {
                    errorMessage = 'Insufficient funds';
                    toast.error('Insufficient funds');
                } else if (error.message.includes('network')) {
                    errorMessage = 'Network error';
                    toast.error('Network error');
                } else {
                    // Truncate long error messages
                    const truncatedMessage = error.message.length > 20
                        ? error.message.substring(0, 20) + '...'
                        : error.message;
                    errorMessage = truncatedMessage;
                    toast.error(`Payment failed: ${truncatedMessage}`);
                }
            }

            onPaymentError(errorMessage);
            setIsProcessing(false);
        }
    };

    // Handle transaction confirmation
    useEffect(() => {
        if (isConfirmed && hash) {
            console.log('🎉 Payment confirmed:', hash);

            // Update order status and payment status
            const updateOrderData = async () => {
                try {
                    // Update order with CELO payment details
                    await updateCeloPayment({
                        orderId: orderId as Id<"orders">,
                        celoTxHash: hash,
                        celoFromAddress: address!,
                        celoAmountPaid: totalCeloAmount,
                    });

                    // Update order status to delivered and payment status to paid
                    await Promise.all([
                        updateOrderStatus({
                            orderId: orderId as Id<"orders">,
                            orderStatus: 'delivered',
                        }),
                        updatePaymentStatus({
                            orderId: orderId as Id<"orders">,
                            paymentStatus: 'paid',
                        })
                    ]);

                    console.log('✅ Order status updated to delivered and payment to paid');
                    console.log('🔍 Order ID:' + orderId + ' - Status should be delivered');
                    toast.success('Payment processed successfully! Order delivered.');

                    // Call the success callback to trigger rating modal
                    onPaymentSuccess(hash);
                    setIsProcessing(false);

                    // Report to Divvi for referral tracking
                    if (DIVVI_CONFIG.consumer !== "0x0000000000000000000000000000000000000000") {
                        submitReferral({
                            txHash: hash,
                            chainId: chain?.id || CELO_NETWORKS.MAINNET.chainId,
                        }).catch((error) => {
                            console.log('Divvi referral submission failed:', error);
                            // Don't show error to user as this is not critical
                        });
                    }
                } catch (error) {
                    console.error('❌ Failed to update order status:', error);
                    toast.error('Payment successful but failed to update order status. Please contact support.');
                    setIsProcessing(false);
                }
            };

            updateOrderData();
        }
    }, [isConfirmed, hash, onPaymentSuccess, chain?.id, orderId, address, totalCeloAmount, updateCeloPayment, updateOrderStatus, updatePaymentStatus]);

    // Handle transaction error
    useEffect(() => {
        if (error) {
            console.error('❌ Transaction error:', error);
            const errorMessage = error.message || 'Transaction failed';
            onPaymentError(errorMessage);
            toast.error(`Transaction failed: ${errorMessage}`);
            setIsProcessing(false);
        }
    }, [error, onPaymentError]);

    if (!isConnected) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Connect Wallet
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        Connect your wallet to pay with CELO
                    </p>
                    <WalletConnect />
                </CardContent>
            </Card>
        );
    }

    if (!isCorrectChain) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Wrong Network
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        Please switch to Celo network to continue
                    </p>
                    <WalletConnect />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    CELO Payment
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Base Amount:</span>
                        <span>{baseCeloAmount.toFixed(6)} CELO</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Farmer:</span>
                        <span>{farmerCeloAmount.toFixed(6)} CELO</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Dispatcher:</span>
                        <span>{dispatcherCeloAmount.toFixed(6)} CELO</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Platform Fee (2.5%):</span>
                        <span>{platformFeeCelo.toFixed(6)} CELO</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{totalCeloAmount.toFixed(6)} CELO</span>
                    </div>
                </div>

                <Button
                    onClick={handlePayment}
                    disabled={isProcessing || isPending || isConfirming}
                    className="w-full"
                    size="lg"
                >
                    {isProcessing || isPending || isConfirming ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Submitting...'}
                        </>
                    ) : (
                        <>
                            <Wallet className="mr-2 h-4 w-4" />
                            Pay {totalCeloAmount.toFixed(6)} CELO
                        </>
                    )}
                </Button>

                {isConfirmed && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Payment confirmed!
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        {error.message}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
