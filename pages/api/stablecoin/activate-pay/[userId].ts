import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://seal-app-qp9cc.ondigitalocean.app/api/v1';
const API_KEY = process.env.NEXT_PRIVATE_API_KEY || '';

// Create axios instance for stablecoin API
const stablecoinApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // Increased timeout to 30 seconds for payment activation
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                message: 'Missing or invalid userId parameter'
            });
        }

        console.log('Activating payment for user:', userId);

        // Call external stablecoin API to activate payment
        const response = await stablecoinApi.post(`/activate-pay/${userId}`);

        console.log('Payment activated successfully for user:', userId);

        // Return success response
        return res.status(200).json({
            message: 'Payment activated successfully',
            userId,
        });
    } catch (error: unknown) {
        console.log('Failed to activate payment:', error);

        // Handle timeout errors specifically
        if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
            console.log('Payment activation timed out, but this might be expected for first-time activation');
            return res.status(200).json({
                message: 'Payment activation initiated (timeout may be expected for first-time activation)',
                userId: req.query.userId as string,
                warning: 'Request timed out, but activation may still be processing',
            });
        }

        // Handle different types of errors
        if (axios.isAxiosError(error) && error.response) {
            const errorData = error.response.data;
            let errorMessage = 'Failed to activate payment';

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }

            console.log('External API error status:', error.response.status);
            console.log('External API error data:', errorData);

            return res.status(error.response.status).json({
                message: errorMessage,
                status: error.response.status,
            });
        } else if (axios.isAxiosError(error) && error.request) {
            return res.status(503).json({
                message: 'No response from stablecoin API',
                status: 503,
            });
        } else {
            const errorMessage = error instanceof Error ? error.message : 'Internal server error';
            return res.status(500).json({
                message: errorMessage,
                status: 500,
            });
        }
    }
} 