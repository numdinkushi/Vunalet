import type { NextApiRequest, NextApiResponse } from 'next';
import { stablecoinApiService } from '../../lib/services/api/stablecoin-api';

interface TestResponse {
    message: string;
    testUser?: unknown;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TestResponse>
) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        if (req.method === 'GET') {
            // Test API connectivity by trying to create a test user
            return res.status(200).json({
                message: 'Stablecoin API integration test - use POST to test user creation',
            });
        } else if (req.method === 'POST') {
            // Test user creation
            const { email, firstName, lastName } = req.body;

            if (!email || !firstName || !lastName) {
                return res.status(400).json({
                    message: 'Missing required fields: email, firstName, lastName',
                });
            }

            // Add null checks
            const testUser = await stablecoinApiService?.createUser?.({
                email,
                firstName,
                lastName,
            });

            if (!testUser) {
                return res.status(503).json({
                    message: 'Service unavailable',
                    error: 'Stablecoin API service not available'
                });
            }

            return res.status(200).json({
                message: 'Test user created successfully',
                testUser,
            });
        }
    } catch (error: unknown) {
        console.log('Test API error:', error);
        return res.status(500).json({
            message: 'Test failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
} 