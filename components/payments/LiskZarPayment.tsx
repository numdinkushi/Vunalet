'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { paymentService } from '../../lib/services/payment/payment.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
    CreditCard,
    CheckCircle,
    AlertCircle,
    Loader2,
    DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface LiskZarPaymentProps {
    amount: number;
    orderId: string;
    onPaymentSuccess: (paymentId: string) => void;
    onPaymentError: (error: string) => void;
}

export function LiskZarPayment({
    amount,
    orderId,
    onPaymentSuccess,
    onPaymentError
}: LiskZarPaymentProps) {
    const { user } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

    // Get user profile to access payment identifier
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Update order payment status
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);

    const handlePayment = async () => {
        if (!userProfile?.paymentIdentifier) {
            toast.error('Payment identifier not found. Please complete your profile setup.');
            return;
        }

        setIsProcessing(true);
        setPaymentStatus('pending');

        try {
            // Check if stablecoin API is available
            if (!paymentService.isAvailable()) {
                throw new Error('Lisk ZAR payment service is currently unavailable. Please try CELO payment instead.');
            }

            // Process payment through stablecoin API
            const payment = await paymentService.processPayment(
                amount,
                userProfile.paymentIdentifier,
                `Order ${orderId} - Vunalet`
            );

            // Update order payment status
            await updatePaymentStatus({
                orderId,
                paymentStatus: 'paid',
            });

            setPaymentStatus('success');
            onPaymentSuccess(payment.id);
            toast.success('Payment processed successfully!');
        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentStatus('failed');

            // Provide more specific error messages
            let errorMessage = 'Payment failed. Please try again.';

            if (error instanceof Error) {
                if (error.message.includes('API not available')) {
                    errorMessage = 'Lisk ZAR payment service is currently unavailable. Please try CELO payment instead.';
                } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    errorMessage = 'Payment service authentication failed. Please contact support.';
                } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
                    errorMessage = 'Payment service access denied. Please contact support.';
                } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
                    errorMessage = 'Payment service is experiencing issues. Please try again later.';
                } else if (error.message.includes('timeout') || error.message.includes('Network Error')) {
                    errorMessage = 'Payment service is not responding. Please check your connection and try again.';
                } else {
                    errorMessage = `Payment failed: ${error.message}`;
                }
            }

            onPaymentError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusIcon = () => {
        switch (paymentStatus) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'failed':
                return <AlertCircle className="w-6 h-6 text-red-600" />;
            default:
                return <CreditCard className="w-6 h-6 text-blue-600" />;
        }
    };

    const getStatusColor = () => {
        switch (paymentStatus) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    if (!userProfile?.paymentIdentifier) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Lisk ZAR Payment
                    </CardTitle>
                    <CardDescription>
                        Complete your profile setup to enable Lisk ZAR payments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                            Your payment identifier is not set up. Please complete your profile to enable payments.
                        </p>
                        <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                            Complete Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {getStatusIcon()}
                    Lisk ZAR Payment
                </CardTitle>
                <CardDescription>
                    Pay securely with Lisk ZAR stablecoin
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Order Total</p>
                        <p className="text-2xl font-bold text-gray-900">R {amount.toFixed(2)}</p>
                    </div>
                    <Badge className={getStatusColor()}>
                        {paymentStatus === 'success' ? 'Paid' :
                            paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Lisk ZAR Stablecoin</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Payment Identifier</Label>
                    <Input
                        value={userProfile.paymentIdentifier}
                        readOnly
                        className="bg-gray-50"
                    />
                </div>

                <Button
                    onClick={handlePayment}
                    disabled={isProcessing || paymentStatus === 'success'}
                    className="w-full"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing Payment...
                        </>
                    ) : paymentStatus === 'success' ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Payment Successful
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay R {amount.toFixed(2)}
                        </>
                    )}
                </Button>

                {paymentStatus === 'failed' && (
                    <Button
                        onClick={handlePayment}
                        variant="outline"
                        className="w-full"
                    >
                        Try Again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
} 