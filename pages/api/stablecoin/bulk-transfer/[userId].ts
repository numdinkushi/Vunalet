import type { NextApiRequest, NextApiResponse } from 'next';
import { stablecoinApiService } from '../../../../lib/services/api/stablecoin-api';
import { BulkTransferResponse } from '../../../../lib/services/api/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BulkTransferResponse | { message: string; error?: string; }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Debug environment variables (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('Bulk Transfer API Route Debug:', {
            hasNextPrivateApiKey: !!process.env.NEXT_PRIVATE_API_KEY,
            hasStablecoinApiKey: !!process.env.STABLECOIN_API_KEY,
            apiKeyLength: process.env.NEXT_PRIVATE_API_KEY?.length || process.env.STABLECOIN_API_KEY?.length || 0,
        });
    }

    try {
        const { userId } = req.query;
        const { payments, transactionNotes } = req.body;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                message: 'Missing or invalid userId parameter'
            });
        }

        if (!payments || !Array.isArray(payments) || payments.length === 0) {
            return res.status(400).json({
                message: 'Missing or invalid payments array'
            });
        }

        // Validate each payment
        for (const payment of payments) {
            if (!payment.recipient || !payment.amount || payment.amount <= 0) {
                return res.status(400).json({
                    message: 'Each payment must have a valid recipient (paymentIdentifier) and positive amount'
                });
            }
        }

        console.log('Processing bulk transfer:', {
            liskId: userId,
            payments,
            transactionNotes
        });

        // Enable gas fee for transaction
        try {
            await stablecoinApiService.activatePayment(userId);
        } catch (activationError) {
            console.log('Failed to enable gas fee, but continuing with bulk transfer:', activationError);
            // Continue with bulk transfer - gas fee might already be enabled
        }

        // Proceed with bulk transfer
        const result = await stablecoinApiService.bulkTransferStablecoins(userId, {
            payments,
            transactionNotes: transactionNotes || ''
        });

        return res.status(200).json(result);
    } catch (error: unknown) {
        console.log('Failed to process bulk transfer:', error);
        const apiError = stablecoinApiService.handleApiError(error);
        return res.status(apiError.status || 500).json(apiError);
    }
} 