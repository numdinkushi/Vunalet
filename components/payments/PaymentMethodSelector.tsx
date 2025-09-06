'use client';

import { useState } from 'react';
import { LiskZarPayment } from './LiskZarPayment';
import { CeloPayment } from './CeloPayment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Wallet, ArrowLeft } from 'lucide-react';
import {
    PaymentMethod,
    PAYMENT_METHOD_LABELS,
    PAYMENT_METHOD_DESCRIPTIONS,
    convertZarToCelo,
    Currency
} from '@/constants';

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

    const celoAmount = convertZarToCelo(zarAmount);

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
    };

    const handleBackToSelection = () => {
        setSelectedMethod(null);
    };

    const handlePaymentSuccess = (paymentId: string, method: PaymentMethod) => {
        onPaymentSuccess(paymentId, method);
    };

    // Method selection view
    if (!selectedMethod) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Choose Payment Method</h3>
                    <p className="text-muted-foreground">
                        Select how you&apos;d like to pay for your order
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Lisk ZAR Payment Option */}
                    <Card
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-green-200 dark:hover:border-green-800"
                        onClick={() => handleMethodSelect(PaymentMethod.LISK_ZAR)}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                                <div className="flex items-center gap-2">
                                    <Coins className="h-5 w-5 text-green-600" />
                                    {PAYMENT_METHOD_LABELS[PaymentMethod.LISK_ZAR]}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    Instant
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-3">
                                {PAYMENT_METHOD_DESCRIPTIONS[PaymentMethod.LISK_ZAR]}
                            </p>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                                    R {zarAmount.toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Paid from your Lisk ZAR balance
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Fast processing
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Celo Payment Option */}
                    <Card
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800"
                        onClick={() => handleMethodSelect(PaymentMethod.CELO)}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-blue-600" />
                                    {PAYMENT_METHOD_LABELS[PaymentMethod.CELO]}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    Web3
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-3">
                                {PAYMENT_METHOD_DESCRIPTIONS[PaymentMethod.CELO]}
                            </p>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                    {celoAmount.toFixed(6)} {Currency.CELO}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    ≈ R {zarAmount.toFixed(2)} • Blockchain payment
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Decentralized & secure
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        Both payment methods are secure and processed instantly
                    </p>
                </div>
            </div>
        );
    }

    // Payment processing view
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToSelection}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                        Payment - {PAYMENT_METHOD_LABELS[selectedMethod]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {selectedMethod === PaymentMethod.LISK_ZAR
                            ? `Pay R ${zarAmount.toFixed(2)} using your Lisk ZAR balance`
                            : `Pay ${celoAmount.toFixed(6)} CELO using your Web3 wallet`
                        }
                    </p>
                </div>
            </div>

            {selectedMethod === PaymentMethod.LISK_ZAR && (
                <LiskZarPayment
                    amount={zarAmount}
                    orderId={orderId}
                    onPaymentSuccess={(paymentId) => handlePaymentSuccess(paymentId, PaymentMethod.LISK_ZAR)}
                    onPaymentError={onPaymentError}
                />
            )}

            {selectedMethod === PaymentMethod.CELO && farmerAddress && (
                <CeloPayment
                    zarAmount={zarAmount}
                    orderId={orderId}
                    farmerAddress={farmerAddress}
                    dispatcherAddress={dispatcherAddress}
                    farmerZarAmount={farmerZarAmount}
                    dispatcherZarAmount={dispatcherZarAmount}
                    onPaymentSuccess={(txHash) => handlePaymentSuccess(txHash, PaymentMethod.CELO)}
                    onPaymentError={onPaymentError}
                />
            )}

            {selectedMethod === PaymentMethod.CELO && !farmerAddress && (
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <div className="text-center text-destructive">
                            <p className="font-medium">Cannot process Celo payment</p>
                            <p className="text-sm mt-1">
                                Farmer address is required for blockchain payments. Please contact support.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-3"
                                onClick={handleBackToSelection}
                            >
                                Choose Different Method
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 