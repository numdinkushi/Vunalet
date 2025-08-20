import type { NextApiRequest, NextApiResponse } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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

        const balance = await client.query(api.balances.getUserBalance, {
            clerkUserId: userId,
            token: 'L ZAR Coin',
        });

        return res.status(200).json(balance);
    } catch (error) {
        console.error('Failed to get balance:', error);
        return res.status(500).json({ message: 'Failed to get balance' });
    }
} 