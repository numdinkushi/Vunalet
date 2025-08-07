import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { CreateUserRequest, CreateUserResponse, ApiError } from '../../../lib/services/api/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://seal-app-qp9cc.ondigitalocean.app/api/v1';
const API_KEY = process.env.NEXT_PRIVATE_API_KEY || '';

// Create axios instance for stablecoin API
const stablecoinApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

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

/**
 * Handle API errors and return appropriate response
 */
function handleApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        let errorMessage = 'Failed to create user';

        if (typeof errorData === 'string') {
            errorMessage = errorData;
        } else if (errorData?.message) {
            errorMessage = errorData.message;
        } else if (errorData?.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
        }

        // Check for user already exists error
        if (errorMessage.includes('Unique constraint failed on the constraint: `User_email_key`') ||
            errorMessage.includes('User already exists')) {
            return {
                message: 'User creation failed',
                error: errorMessage,
                status: error.response.status,
            };
        }

        return {
            message: errorMessage,
            status: error.response.status,
        };
    } else if (axios.isAxiosError(error) && error.request) {
        return {
            message: 'No response from stablecoin API',
            status: 503,
        };
    } else {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return {
            message: errorMessage,
            status: 500,
        };
    }
}

/**
 * Create user in external stablecoin API
 */
async function createUserInExternalApi(requestData: CreateUserRequest): Promise<CreateUserResponse> {
    console.log('Creating user in stablecoin system:', requestData);
    console.log('API Configuration:', {
        baseURL: API_BASE_URL,
        hasApiKey: !!API_KEY,
    });

    const response = await stablecoinApi.post<CreateUserResponse>('/users', requestData);
    console.log('User created successfully in stablecoin system:', response.data);

    // Extract user data if it's wrapped in a 'user' object
    let responseData = response.data;
    if (response.data && typeof response.data === 'object' && 'user' in response.data) {
        console.log('Extracting user data from wrapped response');
        responseData = (response.data as { user: CreateUserResponse; }).user;
    }

    return responseData;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CreateUserResponse | ApiError>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
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

        // Create user in external API
        const userData = await createUserInExternalApi({ email, firstName, lastName });

        // Return the created user data
        return res.status(200).json(userData);
    } catch (error: unknown) {
        console.log('Failed to create user in stablecoin system:', error);

        const apiError = handleApiError(error);
        return res.status(apiError.status || 500).json(apiError);
    }
} 