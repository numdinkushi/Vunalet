import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';

interface CancelOrderParams {
    orderId: string;
    buyerId: string; // Clerk ID
    buyerLiskId: string; // Lisk ID for payments
    dispatcherId: string;
    farmerId: string;
    totalCost: number;
    dispatcherAmount: number;
    farmerAmount: number;
    reason: string;
}

export function useOrderCancellation() {
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

    const cancelOrder = async ({
        orderId,
        buyerId,
        buyerLiskId,
        dispatcherId,
        farmerId,
        totalCost,
        dispatcherAmount,
        farmerAmount,
        reason
    }: CancelOrderParams) => {
        try {
            // Validate required parameters
            if (!buyerLiskId) {
                throw new Error('Buyer payment account not found');
            }

            // Step 1: Get payment identifiers for dispatcher and farmer
            // Note: dispatcherId and farmerId are Clerk user IDs, not Lisk IDs
            const [dispatcherProfile, farmerProfile] = await Promise.all([
                dispatcherId ? fetch(`/api/stablecoin/users?userId=${dispatcherId}`).then(r => r.json()).catch(() => null) : null,
                farmerId ? fetch(`/api/stablecoin/users?userId=${farmerId}`).then(r => r.json()).catch(() => null) : null
            ]);

            // Step 2: Process refunds using bulk transfer
            const refundPayments = [];

            // Add dispatcher refund (half of dispatcher amount)
            if (dispatcherId && dispatcherAmount > 0 && dispatcherProfile?.paymentIdentifier) {
                refundPayments.push({
                    recipient: dispatcherProfile.paymentIdentifier,
                    amount: dispatcherAmount / 2
                });
            }

            // Add farmer refund (half of farmer amount)
            if (farmerId && farmerAmount > 0 && farmerProfile?.paymentIdentifier) {
                refundPayments.push({
                    recipient: farmerProfile.paymentIdentifier,
                    amount: farmerAmount / 2
                });
            }

            // If no valid recipients found, just cancel the order without refunds
            if (refundPayments.length === 0) {
                console.log('No valid recipients found for refunds, cancelling order without refunds');

                // Update order status to cancelled without processing refunds
                await updateOrderStatus({
                    orderId,
                    orderStatus: 'cancelled',
                    cancellationReason: reason,
                });

                toast.success('Order cancelled successfully');
                return true;
            }

            // Call bulk transfer API using buyer's liskId with longer timeout
            const response = await fetch(`/api/stablecoin/bulk-transfer/${buyerLiskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payments: refundPayments,
                    transactionNotes: `Order cancellation refund - ${reason}`
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('Bulk transfer failed:', errorData);

                let errorMessage = 'Failed to process refunds';
                if (errorData.message === 'Sender not found.') {
                    errorMessage = 'Buyer payment account not found or invalid';
                } else if (errorData.error === 'TIMEOUT') {
                    errorMessage = 'Transaction is taking longer than expected. Please try again in a few moments.';
                } else if (errorData.message) {
                    errorMessage = `Payment failed: ${errorData.message}`;
                } else {
                    errorMessage = `Failed to process refunds: ${response.status} ${response.statusText}`;
                }

                toast.error(errorMessage);
                return false;
            }

            // Step 3: Only update order status to cancelled after successful payment processing
            await updateOrderStatus({
                orderId,
                orderStatus: 'cancelled',
                cancellationReason: reason,
            });

            toast.success('Order cancelled successfully with refunds processed');
            return true;
        } catch (error) {
            console.log('Failed to cancel order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';
            toast.error(errorMessage);
            return false;
        }
    };

    return { cancelOrder };
} 