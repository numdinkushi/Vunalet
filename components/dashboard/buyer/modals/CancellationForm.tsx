'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { XCircle } from 'lucide-react';
import { Order } from '../types';
import { convertZarToCelo } from '../../../../constants/payments';

interface CancellationFormProps {
    order: Order;
    cancellationReason: string;
    onCancellationReasonChange: (reason: string) => void;
    onCancelBack: () => void;
    onCancelConfirm: () => void;
    isCancelling: boolean;
}

export function CancellationForm({
    order,
    cancellationReason,
    onCancellationReasonChange,
    onCancelBack,
    onCancelConfirm,
    isCancelling
}: CancellationFormProps) {
    // Calculate CELO amounts if payment method is CELO
    const formatCancellationAmount = (amount: number) => {
        if (order.paymentMethod === 'celo') {
            const celoAmount = convertZarToCelo(amount / 2); // Half the amount for cancellation
            return `${celoAmount.toFixed(6)} CELO`;
        }
        return `R ${(amount / 2).toFixed(2)}`;
    };

    return (
        <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Cancellation Warning</h3>
                </div>
                <div className="text-sm text-red-700 space-y-2">
                    <p><strong>You will lose the following amounts if you cancel:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Dispatcher refund: {formatCancellationAmount(order.dispatcherAmount || 0)}</li>
                        <li>Farmer refund: {formatCancellationAmount(order.farmerAmount || 0)}</li>
                    </ul>
                    <p className="mt-3 font-medium">Total amount you will lose: {formatCancellationAmount((order.dispatcherAmount || 0) + (order.farmerAmount || 0))}</p>
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="cancellationReason" className="text-sm font-medium text-gray-700">
                    Why are you cancelling this order? *
                </Label>
                <Input
                    id="cancellationReason"
                    value={cancellationReason}
                    onChange={(e) => onCancellationReasonChange(e.target.value)}
                    placeholder="Please provide a reason for cancellation..."
                    className="w-full"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={onCancelBack}
                    disabled={isCancelling}
                >
                    Back
                </Button>
                <Button
                    onClick={onCancelConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={!cancellationReason.trim() || isCancelling}
                >
                    {isCancelling ? (
                        <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Cancelling...
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Proceed with Cancellation
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
} 