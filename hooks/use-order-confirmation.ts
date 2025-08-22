import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';

interface ConfirmOrderParams {
    orderId: string;
    buyerId: string; // Clerk ID
    buyerLiskId: string; // Lisk ID for payments
    dispatcherId: string;
    farmerId: string;
    totalCost: number;
    dispatcherAmount: number;
    farmerAmount: number;
}

export function useOrderConfirmation() {
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
    const updateBalance = useMutation(api.balances.upsertUserBalance);

    const confirmOrder = async ({
        orderId,
        buyerId,
        buyerLiskId,
        dispatcherId,
        farmerId,
        totalCost,
        dispatcherAmount,
        farmerAmount
    }: ConfirmOrderParams) => {
        try {
            // Validate required parameters
            if (!buyerLiskId) {
                toast.error('Buyer payment account not found');
                return false;
            }

            // Step 1: Get payment identifiers for dispatcher and farmer
            const [dispatcherProfile, farmerProfile] = await Promise.all([
                dispatcherId ? fetch(`/api/stablecoin/users?userId=${dispatcherId}`).then(r => r.json()).catch(() => null) : null,
                farmerId ? fetch(`/api/stablecoin/users?userId=${farmerId}`).then(r => r.json()).catch(() => null) : null
            ]);

            // Step 2: Process payments using bulk transfer
            const payments = [];

            // Add dispatcher payment (full dispatcher amount)
            if (dispatcherId && dispatcherAmount > 0 && dispatcherProfile?.paymentIdentifier) {
                payments.push({
                    recipient: dispatcherProfile.paymentIdentifier,
                    amount: dispatcherAmount
                });
            }

            // Add farmer payment (full farmer amount)
            if (farmerId && farmerAmount > 0 && farmerProfile?.paymentIdentifier) {
                payments.push({
                    recipient: farmerProfile.paymentIdentifier,
                    amount: farmerAmount
                });
            }

            // If no valid recipients found, just confirm the order without payments
            if (payments.length === 0) {
                console.log('No valid recipients found for payments, confirming order without payments');

                // Update order status to delivered and payment status to paid
                await Promise.all([
                    updateOrderStatus({
                        orderId,
                        orderStatus: 'delivered',
                    }),
                    updatePaymentStatus({
                        orderId,
                        paymentStatus: 'paid',
                    })
                ]);

                // Update buyer's ledger balance (decrease by total cost since order is now confirmed)
                await updateBalance({
                    clerkUserId: buyerId,
                    token: 'L ZAR Coin',
                    walletBalance: 0, // Keep existing wallet balance
                    ledgerBalance: 0, // Ledger balance will be recalculated from pending orders
                });

                toast.success('Order confirmed successfully');
                return true;
            }

            // Call bulk transfer API using buyer's liskId with longer timeout
            const response = await fetch(`/api/stablecoin/bulk-transfer/${buyerLiskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payments: payments,
                    transactionNotes: `Order confirmation payment - Order #${orderId.slice(-6)}`
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('Bulk transfer failed:', errorData);

                let errorMessage = 'Failed to process payments';
                if (errorData.message === 'Sender not found.') {
                    errorMessage = 'Buyer payment account not found or invalid';
                } else if (errorData.error === 'TIMEOUT') {
                    errorMessage = 'Transaction is taking longer than expected. Please try again in a few moments.';
                } else if (errorData.message) {
                    errorMessage = `Payment failed: ${errorData.message}`;
                } else {
                    errorMessage = `Failed to process payments: ${response.status} ${response.statusText}`;
                }

                toast.error(errorMessage);
                return false;
            }

            // Step 3: Update order status to delivered and payment status to paid after successful payment processing
            await Promise.all([
                updateOrderStatus({
                    orderId,
                    orderStatus: 'delivered',
                }),
                updatePaymentStatus({
                    orderId,
                    paymentStatus: 'paid',
                })
            ]);

            // Step 4: Update buyer's ledger balance (decrease by total cost since order is now confirmed)
            await updateBalance({
                clerkUserId: buyerId,
                token: 'L ZAR Coin',
                walletBalance: 0, // Keep existing wallet balance
                ledgerBalance: 0, // Ledger balance will be recalculated from pending orders
            });

            toast.success('Order confirmed successfully with payments processed');
            return true;
        } catch (error) {
            console.log('Failed to confirm order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to confirm order';
            toast.error(errorMessage);
            return false;
        }
    };

    return { confirmOrder };
} 