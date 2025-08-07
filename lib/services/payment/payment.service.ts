import { stablecoinApi } from '../api/stablecoin-api';
import { PaymentRequest, PaymentResponse } from '../api/types';
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
     * Process a payment using stablecoin
     */
    async processPayment(
        amount: number,
        paymentIdentifier: string,
        description?: string
    ): Promise<PaymentResponse> {
        try {
            console.log('Processing payment:', { amount, paymentIdentifier, description });

            const paymentData: PaymentRequest = {
                amount,
                currency: 'ZAR',
                paymentIdentifier,
                description,
            };

            const payment = await stablecoinApi.createPayment(paymentData);
            console.log('Payment processed successfully:', payment);

            toast.success('Payment processed successfully!');
            return payment;
        } catch (error) {
            console.log('Payment processing failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment failed';
            toast.error(`Payment failed: ${errorMessage}`);
            throw error;
        }
    }

    /**
     * Get payment details by ID
     */
    async getPaymentDetails(paymentId: string): Promise<PaymentResponse> {
        try {
            return await stablecoinApi.getPayment(paymentId);
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
}

// Export singleton instance
export const paymentService = PaymentService.getInstance(); 