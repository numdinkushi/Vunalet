import type { NextApiRequest, NextApiResponse } from 'next';
import { stablecoinApiService } from '../../../../lib/services/api/stablecoin-api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Debug environment variables (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('Balance API Route Debug:', {
            hasNextPrivateApiKey: !!process.env.NEXT_PRIVATE_API_KEY,
            hasStablecoinApiKey: !!process.env.STABLECOIN_API_KEY,
            apiKeyLength: process.env.NEXT_PRIVATE_API_KEY?.length || process.env.STABLECOIN_API_KEY?.length || 0,
        });
    }

    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid userId parameter' });
        }

        console.log('Fetching balances for userId:', userId);

        try {
            // Try to get balances from stablecoin API
            const result = await stablecoinApiService.getUserBalances(userId);
            console.log('Balance fetch result:', result);
            return res.status(200).json(result);
        } catch (balanceError: unknown) {
            console.log('Failed to get balances from stablecoin API:', balanceError);

            // For any error (including 404, network issues, etc.), return empty balances
            // This ensures the dashboard never fails due to balance issues
            console.log('Returning empty balances due to API error');
            return res.status(200).json({ tokens: [] });
        }
    } catch (error: unknown) {
        console.log('Unexpected error in balance API:', error);

        // Always return a valid response instead of failing
        return res.status(200).json({ tokens: [] });
    }
} 