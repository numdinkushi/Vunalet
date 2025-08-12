import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateUserRequest, CreateUserResponse, ApiError } from '../../../lib/services/api/types';
import { stablecoinApiService } from '../../../lib/services/api/stablecoin-api';

/**
 * Validate request data
 */
function validateRequest(body: unknown): { isValid: boolean; error?: string; } {
    if (!body || typeof body !== 'object') {
        return {
            isValid: false,
            error: 'Invalid request body'
        };
    }

    const { email, firstName, lastName } = body as Record<string, unknown>;

    if (!email || !firstName || !lastName) {
        return {
            isValid: false,
            error: 'Missing required fields: email, firstName, lastName'
        };
    }

    if (typeof email !== 'string' || typeof firstName !== 'string' || typeof lastName !== 'string') {
        return {
            isValid: false,
            error: 'All fields must be strings'
        };
    }

    if (email.trim() === '' || firstName.trim() === '' || lastName.trim() === '') {
        return {
            isValid: false,
            error: 'All fields must not be empty'
        };
    }

    return { isValid: true };
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CreateUserResponse | ApiError>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Debug environment variables (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('API Route Debug:', {
            hasNextPrivateApiKey: !!process.env.NEXT_PRIVATE_API_KEY,
            hasStablecoinApiKey: !!process.env.STABLECOIN_API_KEY,
            apiKeyLength: process.env.NEXT_PRIVATE_API_KEY?.length || process.env.STABLECOIN_API_KEY?.length || 0,
        });
    }

    try {
        // Validate request data
        const validation = validateRequest(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                message: validation.error!
            });
        }

        const { email, firstName, lastName } = req.body as CreateUserRequest;

        // Create user in external API using the shared service
        const userData = await stablecoinApiService.createUser({ email, firstName, lastName });

        // Return the created user data
        return res.status(200).json(userData);
    } catch (error: unknown) {
        console.log('Failed to create user in stablecoin system:', error);

        const apiError = stablecoinApiService.handleApiError(error);
        return res.status(apiError.status || 500).json(apiError);
    }
} 