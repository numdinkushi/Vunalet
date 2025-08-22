'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Order } from '../types';

interface OrderActionsProps {
    order: Order;
    onCancelClick: () => void;
    onConfirmOrder: () => void;
    onClose: () => void;
    isCancelling: boolean;
    isConfirming: boolean;
}

export function OrderActions({
    order,
    onCancelClick,
    onConfirmOrder,
    onClose,
    isCancelling,
    isConfirming
}: OrderActionsProps) {
    if (order.orderStatus === 'arrived') {
        return (
            <>
                <Button
                    variant="outline"
                    onClick={onCancelClick}
                    className="text-red-600 hover:text-red-700"
                    disabled={isCancelling}
                >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button
                    onClick={onConfirmOrder}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isConfirming}
                >
                    {isConfirming ? (
                        <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Confirming...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                        </>
                    )}
                </Button>
            </>
        );
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
        return (
            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
        );
    }

    return (
        <>
            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
            <Button>
                <Eye className="w-4 h-4 mr-2" />
                Track Order
            </Button>
        </>
    );
} 