'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Wallet, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import {
    PaymentMethod,
    PAYMENT_METHOD_LABELS,
    PAYMENT_METHOD_DESCRIPTIONS,
    convertZarToCelo,
    calculatePlatformFee,
    Currency
} from '@/constants';
import { useWalletBalance } from '@/hooks/use-wallet-balance';
import { useWalletProfile } from '@/hooks/use-wallet-profile';
import { WalletConnect } from '@/components/web3/WalletConnect';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

interface PaymentMethodSelectorProps {
    zarAmount: number;
    orderId: string;
    farmerAddress?: string;
    dispatcherAddress?: string;
    farmerZarAmount: number;
    dispatcherZarAmount: number;
    onPaymentSuccess: (paymentId: string, method: PaymentMethod) => void;
    onPaymentError: (error: string) => void;
}

export function PaymentMethodSelector({
    zarAmount,
    orderId,
    farmerAddress,
    dispatcherAddress,
    farmerZarAmount,
    dispatcherZarAmount,
    onPaymentSuccess,
    onPaymentError
}: PaymentMethodSelectorProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Get wallet balance and profile data
    const {
        celoBalance,
        celoBalanceFormatted,
        celoBalanceLoading,
        liskZarBalance,
        liskZarBalanceLoading,
        isWalletConnected,
        walletAddress
    } = useWalletBalance();

    // const { farmerProfile, dispatcherProfile } = useWalletProfile();

    // Mutation to update payment method
    const updatePaymentMethod = useMutation(api.orders.updatePaymentMethod);

    // Convert ZAR to CELO for display
    const baseCeloAmount = convertZarToCelo(zarAmount);
    const platformFeeCelo = calculatePlatformFee(baseCeloAmount);
    const celoAmount = baseCeloAmount + platformFeeCelo;
    const farmerCeloAmount = convertZarToCelo(farmerZarAmount);
    const dispatcherCeloAmount = convertZarToCelo(dispatcherZarAmount);

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
    };

    const handleConfirmSelection = async () => {
        if (!selectedMethod) {
            toast.error('Please select a payment method');
            return;
        }

        // For CELO payments, check if wallet is connected
        if (selectedMethod === PaymentMethod.CELO && !isWalletConnected) {
            toast.error('Please connect your wallet to use CELO payments');
            return;
        }

        setIsProcessing(true);
        try {
            // Update the order with the selected payment method
            await updatePaymentMethod({
                orderId: orderId as Id<"orders">,
                paymentMethod: selectedMethod,
            });

            toast.success(`Payment method set to ${PAYMENT_METHOD_LABELS[selectedMethod]}! Order is being processed.`);

            // Call success callback (this will redirect to dashboard)
            onPaymentSuccess('method-selected', selectedMethod);
        } catch (error) {
            console.error('Failed to update payment method:', error);
            toast.error('Failed to update payment method. Please try again.');
            onPaymentError('Failed to update payment method');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBack = () => {
        onPaymentError('cancelled');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Select Payment Method</h2>
                <p className="text-gray-300">Choose how you&apos;d like to pay for your order</p>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 gap-4">
                {/* Lisk ZAR Payment Card */}
                <Card className="bg-black/40 backdrop-blur-sm border border-gray-600 hover:border-green-500 transition-colors cursor-pointer">
                    <CardHeader
                        className="pb-3 cursor-pointer"
                        onClick={() => handleMethodSelect(PaymentMethod.LISK_ZAR)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Coins className="h-6 w-6 text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-lg">
                                        {PAYMENT_METHOD_LABELS[PaymentMethod.LISK_ZAR]}
                                    </CardTitle>
                                    <p className="text-gray-400 text-sm">
                                        {PAYMENT_METHOD_DESCRIPTIONS[PaymentMethod.LISK_ZAR]}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="lisk_zar"
                                    checked={selectedMethod === PaymentMethod.LISK_ZAR}
                                    onChange={() => handleMethodSelect(PaymentMethod.LISK_ZAR)}
                                    className="text-green-500"
                                />
                                <Badge variant="outline" className="text-green-400 border-green-400">
                                    {Currency.ZAR} {zarAmount.toFixed(2)}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>Farmer Payment:</span>
                                <span className="text-green-400">{Currency.ZAR} {farmerZarAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Dispatcher Payment:</span>
                                <span className="text-green-400">{Currency.ZAR} {dispatcherZarAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t border-gray-600 pt-2">
                                <span>Total:</span>
                                <span className="text-green-400">{Currency.ZAR} {zarAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CELO Payment Card */}
                <Card className="bg-black/40 backdrop-blur-sm border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardHeader
                        className="pb-3 cursor-pointer"
                        onClick={() => handleMethodSelect(PaymentMethod.CELO)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Wallet className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-lg">
                                        {PAYMENT_METHOD_LABELS[PaymentMethod.CELO]}
                                    </CardTitle>
                                    <p className="text-gray-400 text-sm">
                                        {PAYMENT_METHOD_DESCRIPTIONS[PaymentMethod.CELO]}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="celo"
                                    checked={selectedMethod === PaymentMethod.CELO}
                                    onChange={() => handleMethodSelect(PaymentMethod.CELO)}
                                    className="text-blue-500"
                                />
                                <Badge variant="outline" className="text-blue-400 border-blue-400">
                                    {Currency.CELO} {celoAmount.toFixed(6)}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {!isWalletConnected ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <div className="flex items-center space-x-2 text-amber-400">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="text-sm">Wallet not connected</span>
                                    </div>
                                    <WalletConnect size="sm" variant="outline" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between">
                                    <span>Farmer Payment:</span>
                                    <span className="text-blue-400">{Currency.CELO} {farmerCeloAmount.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dispatcher Payment:</span>
                                    <span className="text-blue-400">{Currency.CELO} {dispatcherCeloAmount.toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t border-gray-600 pt-2">
                                    <span>Total:</span>
                                    <span className="text-blue-400">{Currency.CELO} {celoAmount.toFixed(6)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-green-400 text-xs">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Wallet Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 bg-transparent border-gray-600 text-white hover:bg-white/10 hover:border-white/20"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handleConfirmSelection}
                    disabled={!selectedMethod || isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Selection
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
