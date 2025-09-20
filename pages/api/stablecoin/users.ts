import type { NextApiRequest, NextApiResponse } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { stablecoinApiService } from '../../../lib/services/api/stablecoin-api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        return handleGetUser(req, res);
    } else if (req.method === 'POST') {
        return handleCreateUser(req, res);
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function handleGetUser(req: NextApiRequest, res: NextApiResponse) {
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

async function handleCreateUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, firstName, lastName } = req.body;

        // Validate required fields
        if (!email || !firstName || !lastName) {
            return res.status(400).json({
                message: 'Missing required fields: email, firstName, lastName'
            });
        }

        // Add null checks
        const stablecoinUser = await stablecoinApiService?.createUser?.({
            email,
            firstName,
            lastName,
        });

        if (!stablecoinUser) {
            return res.status(503).json({ message: 'Service unavailable' });
        }

        return res.status(201).json(stablecoinUser);
    } catch (error) {
        console.error('Failed to create user:', error);
        const apiError = stablecoinApiService?.handleApiError?.(error) || {
            message: 'Internal server error',
            status: 500
        };
        return res.status(apiError.status || 500).json(apiError);
    }
} 