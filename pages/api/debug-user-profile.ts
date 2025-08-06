import type { NextApiRequest, NextApiResponse } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { clerkUserId } = req.body;

        if (!clerkUserId) {
            return res.status(400).json({ message: 'Missing clerkUserId' });
        }

        // Query the user profile from Convex
        const profile = await convex.query(api.users.getUserProfile, {
            clerkUserId,
        });

        console.log('Debug API - Retrieved profile:', profile);

        return res.status(200).json({
            success: true,
            profile,
            stablecoinData: {
                liskId: profile?.liskId,
                publicKey: profile?.publicKey,
                paymentIdentifier: profile?.paymentIdentifier,
            },
        });
    } catch (error) {
        console.log('Debug API error:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
} 