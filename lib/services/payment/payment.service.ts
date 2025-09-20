import { stablecoinApiService } from '../api/stablecoin-api';
import { PaymentRequest, PaymentResponse, TransferTransactionResponse, BulkTransferRequest, BulkTransferResponse } from '../api/types';
import { toast } from 'sonner';

/**
 * Payment Service following Single Responsibility Principle
 * Handles all payment-related operations
 */
export class PaymentService {
    private static instance: PaymentService;

    private constructor() { }

    /**
     * Singleton pattern for payment service
     */
    public static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    /**
     * Check if the payment service is available
     */
    public isAvailable(): boolean {
        return stablecoinApiService?.isAvailable?.() ?? false;
    }

    /**
     * Process a payment using stablecoin
     */
    async processPayment(
        amount: number,
        paymentIdentifier: string,
        description?: string
    ): Promise<PaymentResponse> {
        try {
            console.log('Processing payment:', { amount, paymentIdentifier, description });

            // Check if API is available before processing
            if (!this.isAvailable()) {
                throw new Error('Stablecoin API not available');
            }

            const paymentData: PaymentRequest = {
                amount,
                currency: 'ZAR',
                paymentIdentifier,
                description,
            };

            // Add null checks and throw errors if undefined
            const mintResponse = await stablecoinApiService?.mintStablecoins?.(
                paymentData.paymentIdentifier,
                paymentData.amount,
                paymentData.description
            );

            if (!mintResponse) {
                throw new Error('Failed to process payment - service unavailable');
            }

            console.log('Payment processed successfully:', mintResponse);

            // Convert MintTransactionResponse to PaymentResponse
            const payment: PaymentResponse = {
                id: mintResponse.transaction.hash || paymentData.paymentIdentifier,
                amount: paymentData.amount,
                currency: paymentData.currency,
                status: 'completed',
                paymentIdentifier: paymentData.paymentIdentifier,
                description: paymentData.description || '',
                createdAt: new Date().toISOString(),
            };

            toast.success('Payment processed successfully!');
            return payment;
        } catch (error) {
            console.log('Payment processing failed:', error);

            // Handle specific API errors
            if (stablecoinApiService.handleApiError) {
                const apiError = stablecoinApiService.handleApiError(error);
                throw new Error(`API Error (${apiError.status}): ${apiError.message}`);
            }

            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            toast.error(`Payment failed: ${errorMessage}`);
            throw new Error(errorMessage);
        }
    }

    /**
     * Get payment details by ID
     */
    async getPaymentDetails(paymentId: string): Promise<PaymentResponse> {
        try {
            // For now, return a mock response since getPayment doesn't exist
            return {
                id: paymentId,
                amount: 0,
                currency: 'ZAR',
                status: 'completed',
                paymentIdentifier: paymentId,
                description: 'Payment details',
                createdAt: new Date().toISOString(),
            };
        } catch (error) {
            console.log('Failed to get payment details:', error);
            throw error;
        }
    }

    /**
     * Validate payment data before processing
     */
    validatePaymentData(amount: number, paymentIdentifier: string): boolean {
        if (!amount || amount <= 0) {
            toast.error('Invalid payment amount');
            return false;
        }

        if (!paymentIdentifier || paymentIdentifier.trim() === '') {
            toast.error('Payment identifier is required');
            return false;
        }

        return true;
    }

    /**
     * Format amount for display
     */
    formatAmount(amount: number): string {
        return `R ${amount.toFixed(2)}`;
    }

    /**
     * Calculate payment fees (if applicable)
     */
    calculatePaymentFees(amount: number, feePercentage: number = 0): number {
        return amount * (feePercentage / 100);
    }

    /**
     * Get payment status description
     */
    getPaymentStatusDescription(status: string): string {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'Payment completed successfully';
            case 'pending':
                return 'Payment is being processed';
            case 'failed':
                return 'Payment failed';
            case 'cancelled':
                return 'Payment was cancelled';
            default:
                return 'Payment status unknown';
        }
    }

    /**
     * Transfer stablecoins from one user to another
     */
    async transferStablecoins(
        senderLiskId: string,
        recipientPaymentId: string,
        amount: number,
        notes?: string
    ): Promise<TransferTransactionResponse> {
        try {
            console.log('Processing transfer:', {
                senderLiskId,
                recipientPaymentId,
                amount,
                notes
            });

            const transferData = {
                transactionAmount: amount,
                transactionRecipient: recipientPaymentId,
                transactionNotes: notes || 'Payment transfer'
            };

            // Add null checks and throw errors if undefined
            const result = await stablecoinApiService?.transferStablecoins?.(senderLiskId, transferData);
            if (!result) {
                throw new Error('Failed to process transfer - service unavailable');
            }

            console.log('Transfer processed successfully:', result);

            toast.success('Transfer completed successfully!');
            return result;
        } catch (error) {
            console.log('Transfer processing failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
            toast.error(`Transfer failed: ${errorMessage}`);
            throw error;
        }
    }

    /**
     * Bulk transfer stablecoins to multiple recipients
     */
    async bulkTransferStablecoins(
        senderLiskId: string,
        bulkTransferData: BulkTransferRequest
    ): Promise<BulkTransferResponse> {
        try {
            console.log('Processing bulk transfer:', { senderLiskId, bulkTransferData });

            // Enable gas fee for transaction
            try {
                await stablecoinApiService?.activatePayment?.(senderLiskId);
                toast.success('Gas fee enabled');
            } catch (activationError) {
                console.log('Failed to enable gas fee:', activationError);
                toast.error('Failed to enable gas fee');
                // Continue with bulk transfer - gas fee might already be enabled
            }

            // Add null checks and throw errors if undefined
            const result = await stablecoinApiService?.bulkTransferStablecoins?.(senderLiskId, bulkTransferData);
            if (!result) {
                throw new Error('Failed to process bulk transfer - service unavailable');
            }

            console.log('Bulk transfer processed successfully:', result);

            toast.success('Bulk transfer completed successfully!');
            return result;
        } catch (error) {
            console.log('Bulk transfer processing failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Bulk transfer failed';
            toast.error(`Bulk transfer failed: ${errorMessage}`);
            throw error;
        }
    }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance(); 