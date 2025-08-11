import type { NextApiRequest, NextApiResponse } from 'next';
import { stablecoinApiService } from '../../../../lib/services/api/stablecoin-api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'Missing or invalid userId parameter' });
        }

        const result = await stablecoinApiService.getUserBalances(userId);
        return res.status(200).json(result);
    } catch (error: unknown) {
        console.log('Failed to get user balances:', error);
        // Reuse the stablecoinApiService error handler
        const apiError = stablecoinApiService.handleApiError(error);
        return res.status(apiError.status || 500).json(apiError);
    }
} 