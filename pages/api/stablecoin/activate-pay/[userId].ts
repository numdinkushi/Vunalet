import type { NextApiRequest, NextApiResponse } from 'next';
import { stablecoinApiService } from '../../../../lib/services/api/stablecoin-api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Debug environment variables (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('Activate Pay API Route Debug:', {
            hasNextPrivateApiKey: !!process.env.NEXT_PRIVATE_API_KEY,
            hasStablecoinApiKey: !!process.env.STABLECOIN_API_KEY,
            apiKeyLength: process.env.NEXT_PRIVATE_API_KEY?.length || process.env.STABLECOIN_API_KEY?.length || 0,
        });
    }

    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                message: 'Missing or invalid userId parameter'
            });
        }

        // Add null checks and fallback error handling
        const result = await stablecoinApiService?.activatePayment?.(userId);

        if (!result) {
            return res.status(503).json({ message: 'Service unavailable' });
        }

        // Use the shared service to activate payment
        return res.status(200).json(result);
    } catch (error: unknown) {
        console.log('Failed to activate payment:', error);

        const apiError = stablecoinApiService?.handleApiError?.(error) || {
            message: 'Internal server error',
            status: 500
        };
        return res.status(apiError.status || 500).json(apiError);
    }
} 