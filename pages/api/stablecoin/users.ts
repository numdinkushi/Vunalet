import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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

        // Create user in stablecoin system
        const response = await stablecoinApi.post<CreateUserResponse>('/users', {
            email,
            firstName,
            lastName,
        });

        console.log('User created successfully in stablecoin system:', response.data);

        // Return the created user data
        return res.status(200).json(response.data);
    } catch (error: unknown) {
        console.error('Failed to create user in stablecoin system:', error);

        // Handle different types of errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = error.response.data?.message || 'Failed to create user';

            // Check if it's a unique constraint error (user already exists)
            if (errorMessage.includes('Unique constraint failed on the constraint: `User_email_key`')) {
                return res.status(409).json({
                    message: 'User already exists',
                    error: errorMessage,
                    status: 409,
                });
            }

            return res.status(error.response.status).json({
                message: errorMessage,
                status: error.response.status,
            });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(503).json({
                message: 'No response from stablecoin API',
                status: 503,
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            return res.status(500).json({
                message: error.message || 'Internal server error',
                status: 500,
            });
        }
    }
} 