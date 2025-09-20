import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { PaymentMethod, convertZarToCelo } from '@/constants';

interface UseCeloPaymentProps {
    orderId: Id<"orders">;
    zarAmount: number;
}

interface CeloPaymentResult {
    success: boolean;
    txHash?: string;
    error?: string;
}

export function useCeloPayment({ orderId, zarAmount }: UseCeloPaymentProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { address } = useAccount();

    // Convex mutations
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
    const updateCeloPayment = useMutation(api.orders.updateCeloPayment);

    const processCeloPayment = async (
        txHash: string,
        blockNumber?: number
    ): Promise<CeloPaymentResult> => {
        if (!address) {
            return { success: false, error: 'Wallet not connected' };
        }

        setIsProcessing(true);

        try {
            // Convert ZAR amount to CELO for storage
            const celoAmount = convertZarToCelo(zarAmount);

            // Update order with Celo payment details
            await updateCeloPayment({
                orderId,
                celoTxHash: txHash,
                celoBlockNumber: blockNumber,
                celoFromAddress: address,
                celoAmountPaid: celoAmount,
            });

            // Update payment status to paid
            await updatePaymentStatus({
                orderId,
                paymentStatus: 'paid',
            });

            toast.success('Celo payment processed successfully!');
            return { success: true, txHash };

        } catch (error) {
            console.error('Failed to process Celo payment:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to process payment';
            toast.error(`Payment processing failed: ${errorMessage}`);
            return { success: false, error: errorMessage };
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentError = async (error: string): Promise<void> => {
        try {
            // Update payment status to failed
            await updatePaymentStatus({
                orderId,
                paymentStatus: 'failed',
            });

            console.error('Celo payment failed:', error);
            toast.error(`Payment failed: ${error}`);
        } catch (updateError) {
            console.error('Failed to update payment status:', updateError);
        }
    };

    return {
        processCeloPayment,
        handlePaymentError,
        isProcessing,
        address,
    };
} 