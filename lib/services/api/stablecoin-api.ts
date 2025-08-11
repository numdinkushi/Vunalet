import axios, { AxiosInstance } from 'axios';
import { CreateUserRequest, CreateUserResponse, ApiError } from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://seal-app-qp9cc.ondigitalocean.app/api/v1';
const API_KEY = process.env.NEXT_PRIVATE_API_KEY || '';

/**
 * Shared stablecoin API service
 */
class StablecoinApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
        });
    }

    /**
     * Create axios instance with custom timeout
     */
    private createCustomApi(timeout: number): AxiosInstance {
        return axios.create({
            baseURL: API_BASE_URL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
        });
    }

    /**
     * Handle API errors and return appropriate response
     */
    handleApiError(error: unknown): ApiError {
        if (axios.isAxiosError(error) && error.response) {
            const errorData = error.response.data;
            let errorMessage = 'API request failed';

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
    async createUser(requestData: CreateUserRequest): Promise<CreateUserResponse> {
        console.log('Creating user in stablecoin system:', requestData);
        console.log('API Configuration:', {
            baseURL: API_BASE_URL,
            hasApiKey: !!API_KEY,
        });

        const response = await this.api.post<CreateUserResponse>('/users', requestData);
        console.log('User created successfully in stablecoin system:', response.data);

        // Extract user data if it's wrapped in a 'user' object
        let responseData = response.data;
        if (response.data && typeof response.data === 'object' && 'user' in response.data) {
            console.log('Extracting user data from wrapped response');
            responseData = (response.data as { user: CreateUserResponse; }).user;
        }

        return responseData;
    }

    /**
     * Activate payment for user with extended timeout
     */
    async activatePayment(userId: string): Promise<{ message: string; userId: string; warning?: string; }> {
        console.log('Activating payment for user:', userId);

        // Use extended timeout for payment activation
        const customApi = this.createCustomApi(30000);

        try {
            await customApi.post(`/activate-pay/${userId}`);
            console.log('Payment activated successfully for user:', userId);

            return {
                message: 'Payment activated successfully',
                userId,
            };
        } catch (error) {
            // Handle timeout errors specifically
            if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
                console.log('Payment activation timed out, but this might be expected for first-time activation');
                return {
                    message: 'Payment activation initiated (timeout may be expected for first-time activation)',
                    userId,
                    warning: 'Request timed out, but activation may still be processing',
                };
            }
            throw error; // Re-throw other errors to be handled by the caller
        }
    }

    /**
     * Get user token balances from external stablecoin API
     */
    async getUserBalances(userId: string): Promise<{ tokens: { name: string; balance: string | number; }[]; }> {
        const response = await this.api.get(`/${userId}/balance`);
        return response.data;
    }
}

// Export singleton instance
export const stablecoinApiService = new StablecoinApiService(); 