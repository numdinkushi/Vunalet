import type { NextApiRequest, NextApiResponse } from 'next';
import { stablecoinApiService } from '../../../../lib/services/api/stablecoin-api';
import { TransferTransactionResponse } from '../../../../lib/services/api/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TransferTransactionResponse | { message: string; error?: string; }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Debug environment variables (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('Transfer API Route Debug:', {
            hasNextPrivateApiKey: !!process.env.NEXT_PRIVATE_API_KEY,
            hasStablecoinApiKey: !!process.env.STABLECOIN_API_KEY,
            apiKeyLength: process.env.NEXT_PRIVATE_API_KEY?.length || process.env.STABLECOIN_API_KEY?.length || 0,
        });
    }

    try {
        const { userId } = req.query;
        const { transactionAmount, transactionRecipient, transactionNotes } = req.body;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                message: 'Missing or invalid userId parameter'
            });
        }

        if (!transactionAmount || !transactionRecipient) {
            return res.status(400).json({
                message: 'Missing required fields: transactionAmount, transactionRecipient'
            });
        }

        if (typeof transactionAmount !== 'number' || transactionAmount <= 0) {
            return res.status(400).json({
                message: 'transactionAmount must be a positive number'
            });
        }

        if (typeof transactionRecipient !== 'string') {
            return res.status(400).json({
                message: 'transactionRecipient must be a string'
            });
        }

        console.log('Processing transfer:', {
            userId,
            transactionAmount,
            transactionRecipient,
            transactionNotes
        });

        const result = await stablecoinApiService.transferStablecoins(userId, {
            transactionAmount,
            transactionRecipient,
            transactionNotes
        });

        return res.status(200).json(result);
    } catch (error: unknown) {
        console.log('Failed to transfer stablecoins:', error);
        const apiError = stablecoinApiService.handleApiError(error);
        return res.status(apiError.status || 500).json(apiError);
    }
} 