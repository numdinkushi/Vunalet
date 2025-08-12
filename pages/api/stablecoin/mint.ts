import type { NextApiRequest, NextApiResponse } from 'next';
import { stablecoinApiService } from '../../../lib/services/api/stablecoin-api';
import { MintTransactionResponse } from '../../../lib/services/api/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MintTransactionResponse | { message: string; error?: string; }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Debug environment variables (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('Mint API Route Debug:', {
            hasNextPrivateApiKey: !!process.env.NEXT_PRIVATE_API_KEY,
            hasStablecoinApiKey: !!process.env.STABLECOIN_API_KEY,
            apiKeyLength: process.env.NEXT_PRIVATE_API_KEY?.length || process.env.STABLECOIN_API_KEY?.length || 0,
        });
    }

    try {
        const { paymentIdentifier, amount, notes } = req.body;

        if (!paymentIdentifier || !amount) {
            return res.status(400).json({
                message: 'Missing required fields: paymentIdentifier, amount'
            });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                message: 'Amount must be a positive number'
            });
        }

        const result = await stablecoinApiService.mintStablecoins(paymentIdentifier, amount, notes);
        return res.status(200).json(result);
    } catch (error: unknown) {
        console.log('Failed to mint stablecoins:', error);
        const apiError = stablecoinApiService.handleApiError(error);
        return res.status(apiError.status || 500).json(apiError);
    }
} 