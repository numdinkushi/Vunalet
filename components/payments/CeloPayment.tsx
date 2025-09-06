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

    // Convert amounts to CELO
    const celoAmount = convertZarToCelo(zarAmount);
    const farmerCeloAmount = convertZarToCelo(farmerZarAmount);
    const dispatcherCeloAmount = convertZarToCelo(dispatcherZarAmount);
    const platformFeeCelo = calculatePlatformFee(celoAmount);

    const isCorrectChain = chain?.id === CELO_NETWORKS.MAINNET.chainId || chain?.id === CELO_NETWORKS.ALFAJORES.chainId;

    const handlePayment = async () => {
        if (!isConnected) {
            toast.error('Please connect your wallet');
            return;
        }

        if (!isCorrectChain) {
            toast.error('Please switch to Celo network');
            return;
        }

        if (!CELO_CONTRACT_ADDRESS) {
            toast.error('Contract address not configured');
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
                    PAYMENT_SECURITY.SECRET
                ],
                value: parseEther(celoAmount.toString()),
            });
        } catch (error) {
            console.error('Payment failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            onPaymentError(errorMessage);
            toast.error(`Payment failed: ${errorMessage}`);
            setIsProcessing(false);
        }
    };

    // Handle transaction confirmation
    useEffect(() => {
        if (isConfirmed && hash) {
            onPaymentSuccess(hash);
            setIsProcessing(false);
            toast.success('Payment processed successfully!');

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
        }
    }, [isConfirmed, hash, onPaymentSuccess, chain?.id]);

    // Handle transaction error
    useEffect(() => {
        if (error) {
            const errorMessage = error.message || 'Transaction failed';
            onPaymentError(errorMessage);
            toast.error(`Transaction failed: ${errorMessage}`);
            setIsProcessing(false);
        }
    }, [error, onPaymentError]);

    const getStatusIcon = () => {
        if (isConfirmed) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
        if (error) {
            return <XCircle className="h-5 w-5 text-red-500" />;
        }
        if (isPending || isConfirming) {
            return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
        }
        return <Wallet className="h-5 w-5 text-blue-600" />;
    };

    const getStatusText = () => {
        if (isConfirmed) return 'Payment Successful';
        if (error) return 'Payment Failed';
        if (isConfirming) return 'Confirming Transaction...';
        if (isPending) return 'Waiting for Confirmation...';
        return 'Ready to Pay';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {getStatusIcon()}
                    Pay with Celo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Payment Summary */}
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Total Amount:</span>
                            <div className="text-right">
                                <div className="font-semibold text-blue-900 dark:text-blue-100">
                                    {celoAmount.toFixed(6)} {Currency.CELO}
                                </div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                    ≈ R {zarAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1 pt-2 border-t border-blue-200 dark:border-blue-800">
                            <div className="flex justify-between">
                                <span>Farmer:</span>
                                <span>{farmerCeloAmount.toFixed(6)} {Currency.CELO}</span>
                            </div>
                            {dispatcherCeloAmount > 0 && (
                                <div className="flex justify-between">
                                    <span>Dispatcher:</span>
                                    <span>{dispatcherCeloAmount.toFixed(6)} {Currency.CELO}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Platform fee:</span>
                                <span>{platformFeeCelo.toFixed(6)} {Currency.CELO}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Display */}
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="text-sm font-medium text-center">
                        {getStatusText()}
                    </div>
                    {hash && (
                        <div className="text-xs text-center text-muted-foreground mt-1">
                            Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
                        </div>
                    )}
                </div>

                {/* Wallet Connection or Payment Button */}
                {!isConnected ? (
                    <div className="text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Connect your wallet to pay with Celo
                        </p>
                        <WalletConnect size="lg" variant="default" />
                    </div>
                ) : !isCorrectChain ? (
                    <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-2 text-amber-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">Wrong Network</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Please switch to Celo network to continue
                        </p>
                    </div>
                ) : (
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing || isPending || isConfirming || isConfirmed}
                        className="w-full"
                        size="lg"
                    >
                        {isProcessing || isPending || isConfirming ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Preparing...'}
                            </>
                        ) : isConfirmed ? (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Payment Complete
                            </>
                        ) : (
                            <>
                                <Wallet className="mr-2 h-4 w-4" />
                                Pay {celoAmount.toFixed(6)} {Currency.CELO}
                            </>
                        )}
                    </Button>
                )}

                {/* Network Info */}
                {isConnected && (
                    <div className="text-xs text-center text-muted-foreground">
                        Connected to {chain?.name || 'Unknown Network'}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 