import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { toast } from 'sonner';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://seal-app-qp9cc.ondigitalocean.app/api/v1';
const API_KEY = process.env.NEXT_PRIVATE_API_KEY || '';

interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
}

interface CreateUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    publicKey: string;
    paymentIdentifier: string;
}

interface ApiError {
    message: string;
    status?: number;
    error?: string;
}

// Create axios instance for stablecoin API
const stablecoinApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CreateUserResponse | ApiError>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, firstName, lastName } = req.body as CreateUserRequest;

        // Validate required fields
        if (!email || !firstName || !lastName) {
            return res.status(400).json({
                message: 'Missing required fields: email, firstName, lastName'
            });
        }

        console.log('Creating user in stablecoin system:', { email, firstName, lastName });
        console.log('API Configuration:', {
            baseURL: API_BASE_URL,
            hasApiKey: !!API_KEY,
        });

        // Create user in stablecoin system
        const requestData = {
            email,
            firstName,
            lastName,
        };
        console.log('Sending data to external API:', requestData);

        const response = await stablecoinApi.post<CreateUserResponse>('/users', requestData);

        console.log('User created successfully in stablecoin system:', response.data);

        // Extract user data if it's wrapped in a 'user' object
        let userData = response.data;
        if (response.data && typeof response.data === 'object' && 'user' in response.data) {
            console.log('Extracting user data from wrapped response');
            userData = (response.data as { user: CreateUserResponse; }).user;
        }

        // Return the created user data
        return res.status(200).json(userData);
    } catch (error: unknown) {
        console.log('Failed to create user in stablecoin system:', error);

        // Handle different types of errors
        if (axios.isAxiosError(error) && error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorData = error.response.data;
            let errorMessage = 'Failed to create user';

            // Extract clean error message from response
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (errorData?.errors && Array.isArray(errorData.errors)) {
                errorMessage = errorData.errors.join(', ');
            }

            console.log('External API error status:', error.response.status);
            console.log('External API error data:', errorData);

            // Check if it's a unique constraint error (user already exists) - regardless of status code
            if (errorMessage.includes('Unique constraint failed on the constraint: `User_email_key`') ||
                errorMessage.includes('User already exists')) {

                console.log('Detected user already exists error');
                console.log('This could be a real "user exists" or a false positive from the external API');

                // Return the actual error from the external API
                return res.status(error.response.status).json({
                    message: 'User creation failed',
                    error: errorMessage,
                    status: error.response.status,
                });
            }

            // For all other errors (including 500), return the actual error
            return res.status(error.response.status).json({
                message: errorMessage,
                status: error.response.status,
            });
        } else if (axios.isAxiosError(error) && error.request) {
            // The request was made but no response was received
            return res.status(503).json({
                message: 'No response from stablecoin API',
                status: 503,
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            const errorMessage = error instanceof Error ? error.message : 'Internal server error';
            return res.status(500).json({
                message: errorMessage,
                status: 500,
            });
        }
    }
} 