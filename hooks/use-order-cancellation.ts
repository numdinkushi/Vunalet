import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';
import { useCeloOrderProcessing } from './use-celo-order-processing';

interface CancelOrderParams {
    orderId: string;
    buyerId: string;
    buyerLiskId: string;
    dispatcherId: string;
    farmerId: string;
    totalCost: number;
    dispatcherAmount: number;
    farmerAmount: number;
    reason: string;
    paymentMethod?: 'lisk_zar' | 'celo' | 'cash';
}

// Helper function to update wallet balance from stablecoin API
const updateWalletBalanceFromAPI = async (clerkUserId: string, liskId: string) => {
    try {
        const response = await fetch(`/api/stablecoin/balance/${liskId}`);
        if (response.ok) {
            const data = await response.json();
            const tokens = data?.tokens || [];
            const zarToken = tokens.find((t: { name: string; balance: string | number; }) => t.name === 'L ZAR Coin');
            const walletBalance = zarToken ? Number(zarToken.balance) : 0;

            // Update the balance in Convex using the Convex client directly
            const { ConvexHttpClient } = await import('convex/browser');
            const { api } = await import('../convex/_generated/api');

            const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
            await client.mutation(api.balances.upsertUserBalance, {
                clerkUserId,
                token: 'L ZAR Coin',
                walletBalance,
                ledgerBalance: 0, // Ledger balance is calculated from pending orders
            });
        }
    } catch (error) {
        console.error('Failed to update wallet balance from API:', error);
    }
};

export function useOrderCancellation() {
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
    const { processCeloPayment } = useCeloOrderProcessing(); // Add CELO processing

    const cancelOrder = async ({
        orderId,
        buyerId,
        buyerLiskId,
        dispatcherId,
        farmerId,
        totalCost,
        dispatcherAmount,
        farmerAmount,
        reason,
        paymentMethod = 'lisk_zar'
    }: CancelOrderParams): Promise<{ success: boolean; waitingForConfirmation?: boolean; }> => {
        try {
            // Handle CELO payments
            if (paymentMethod === 'celo') {
                console.log('💰 Processing CELO cancellation for order:', orderId);

                // For CELO cancellations, we need to process a refund through the blockchain
                // The refund amount is half of the original payment (no platform fees)
                const refundAmount = (dispatcherAmount + farmerAmount) / 2;

                // Process CELO refund through smart contract
                const refundResult = await processCeloPayment(orderId, refundAmount);

                if (refundResult.success) {
                    // Update order status to cancelled
                    await updateOrderStatus({
                        orderId,
                        orderStatus: 'cancelled',
                        cancellationReason: reason,
                    });

                    toast.success('CELO cancellation submitted! Waiting for blockchain confirmation...');
                    return { success: true, waitingForConfirmation: true };
                } else {
                    toast.error('CELO cancellation failed. Please try again.');
                    return { success: false };
                }
            }

            // Handle Lisk ZAR cancellations (existing logic)
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

                // Update order status to cancelled
                await updateOrderStatus({
                    orderId,
                    orderStatus: 'cancelled',
                    cancellationReason: reason,
                });

                toast.success('Order cancelled successfully');
                return { success: true };
            }

            // Call bulk transfer API using buyer's liskId with longer timeout
            const response = await fetch(`/api/stablecoin/bulk-transfer/${buyerLiskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payments: refundPayments,
                    transactionNotes: `Order cancellation refund - Order #${orderId.slice(-6)}`
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
                return { success: false };
            }

            // Step 3: Only update order status to cancelled after successful payment processing
            await updateOrderStatus({
                orderId,
                orderStatus: 'cancelled',
                cancellationReason: reason,
            });

            // Step 4: Update wallet balances from stablecoin API for all parties
            // This ensures wallet balances reflect the actual stablecoin balances after refund
            await Promise.all([
                // Update buyer's wallet balance (increased due to refund)
                updateWalletBalanceFromAPI(buyerId, buyerLiskId),
                // Update farmer's wallet balance (decreased due to refund)
                farmerProfile?.liskId ? updateWalletBalanceFromAPI(farmerId, farmerProfile.liskId) : Promise.resolve(),
                // Update dispatcher's wallet balance (decreased due to refund)
                dispatcherProfile?.liskId ? updateWalletBalanceFromAPI(dispatcherId!, dispatcherProfile.liskId) : Promise.resolve(),
            ]);

            toast.success('Order cancelled successfully with refunds processed');
            return { success: true };
        } catch (error) {
            console.log('Failed to cancel order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';
            toast.error(errorMessage);
            return { success: false };
        }
    };

    return { cancelOrder };
} 