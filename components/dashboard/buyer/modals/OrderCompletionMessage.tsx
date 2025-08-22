'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderCompletionMessageProps {
    order: Order;
}

export function OrderCompletionMessage({ order }: OrderCompletionMessageProps) {
    if (order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled') {
        return null;
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
                {order.orderStatus === 'delivered' ? (
                    <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Order Completed</span>
                    </>
                ) : (
                    <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">Order Cancelled</span>
                    </>
                )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
                {order.orderStatus === 'delivered'
                    ? 'This order has been successfully delivered and completed.'
                    : 'This order has been cancelled and cannot be modified.'
                }
            </p>
        </div>
    );
} 