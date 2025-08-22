import type { NextApiRequest, NextApiResponse } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
            return res.status(400).json({
                message: 'Missing or invalid userId parameter'
            });
        }

        // Get user profile from Convex
        const userProfile = await convex.query(api.users.getUserProfile, {
            clerkUserId: userId
        });

        if (!userProfile) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            clerkUserId: userProfile.clerkUserId,
            paymentIdentifier: userProfile.paymentIdentifier,
            liskId: userProfile.liskId,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            role: userProfile.role
        });
    } catch (error) {
        console.error('Failed to get user profile:', error);
        return res.status(500).json({
            message: 'Failed to get user profile'
        });
    }
} 