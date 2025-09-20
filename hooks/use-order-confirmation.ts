import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';
import { useCeloOrderProcessing } from './use-celo-order-processing';

interface ConfirmOrderParams {
    orderId: string;
    buyerId: string;
    buyerLiskId?: string; // Make optional for CELO payments
    dispatcherId?: string;
    farmerId: string;
    totalCost: number;
    dispatcherAmount: number;
    farmerAmount: number;
    paymentMethod?: 'lisk_zar' | 'celo' | 'cash'; // Add payment method
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

export function useOrderConfirmation() {
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
    const { processCeloPayment } = useCeloOrderProcessing(); // Use the payment function, not order creation

    const confirmOrder = async ({
        orderId,
        buyerId,
        buyerLiskId,
        dispatcherId,
        farmerId,
        totalCost,
        dispatcherAmount,
        farmerAmount,
        paymentMethod = 'lisk_zar'
    }: ConfirmOrderParams) => {
        try {
            // Handle CELO payments
            if (paymentMethod === 'celo') {
                console.log('💰 Processing CELO payment for order:', orderId);

                // Process CELO payment through smart contract
                const paymentResult = await processCeloPayment(orderId, totalCost);

                if (paymentResult.success) {
                    // Payment was submitted to blockchain, wait for confirmation
                    toast.success('CELO payment submitted! Waiting for blockchain confirmation...');
                    return { success: true, waitingForConfirmation: true };
                } else {
                    toast.error('CELO payment failed. Please try again.');
                    return { success: false };
                }
            }

            // Handle Lisk ZAR payments (existing logic)
            if (!buyerLiskId) {
                toast.error('Buyer payment account not found');
                return { success: false };
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

                toast.success('Order confirmed successfully');
                return { success: true };
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
                return { success: false };
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

            // Step 4: Update wallet balances from stablecoin API for all parties
            // This ensures wallet balances reflect the actual stablecoin balances after payment
            await Promise.all([
                // Update buyer's wallet balance (decreased due to payment)
                updateWalletBalanceFromAPI(buyerId, buyerLiskId),
                // Update farmer's wallet balance (increased due to payment)
                farmerProfile?.liskId ? updateWalletBalanceFromAPI(farmerId, farmerProfile.liskId) : Promise.resolve(),
                // Update dispatcher's wallet balance (increased due to payment)
                dispatcherProfile?.liskId ? updateWalletBalanceFromAPI(dispatcherId!, dispatcherProfile.liskId) : Promise.resolve(),
            ]);

            toast.success('Order confirmed successfully with payments processed');
            return { success: true };
        } catch (error) {
            console.error('Order confirmation failed:', error);
            return { success: false };
        }
    };

    return { confirmOrder };
} 