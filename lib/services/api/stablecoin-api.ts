import axios, { AxiosInstance } from 'axios';
import { CreateUserRequest, CreateUserResponse, ApiError, MintTransactionResponse, TransferRequest, TransferTransactionResponse } from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://seal-app-qp9cc.ondigitalocean.app/api/v1';
const API_KEY = process.env.NEXT_PRIVATE_API_KEY || process.env.STABLECOIN_API_KEY || '';

/**
 * Shared stablecoin API service
 */
class StablecoinApiService {
    private api: AxiosInstance;

    constructor() {
        if (!API_KEY) {
            console.error('Missing API key for stablecoin service. Please set NEXT_PRIVATE_API_KEY or STABLECOIN_API_KEY environment variable.');
        }

        this.api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
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
                'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
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

    async createUser(requestData: CreateUserRequest): Promise<CreateUserResponse> {
        if (!API_KEY) {
            throw new Error('Missing API key for stablecoin service. Please check your environment variables.');
        }

        const response = await this.api.post<CreateUserResponse>('/users', requestData);

        let responseData = response.data;
        if (response.data && typeof response.data === 'object' && 'user' in response.data) {
            responseData = (response.data as { user: CreateUserResponse; }).user;
        }

        return responseData;
    }

    async activatePayment(userId: string): Promise<{ message: string; userId: string; warning?: string; }> {
        const customApi = this.createCustomApi(30000);

        try {
            await customApi.post(`/activate-pay/${userId}`);

            return {
                message: 'Payment activated successfully',
                userId,
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
                return {
                    message: 'Payment activation initiated (timeout may be expected for first-time activation)',
                    userId,
                    warning: 'Request timed out, but activation may still be processing',
                };
            }
            throw error;
        }
    }

    async getUserBalances(userId: string): Promise<{ tokens: { name: string; balance: string | number; }[]; }> {
        const response = await this.api.get(`/${userId}/balance`);
        return response.data;
    }

    async mintStablecoins(paymentIdentifier: string, amount: number, notes?: string): Promise<MintTransactionResponse> {
        const mintData = {
            transactionAmount: amount,
            transactionRecipient: paymentIdentifier,
            transactionNotes: notes || 'Onboarding Token',
        };

        const response = await this.api.post<MintTransactionResponse>('/mint', mintData);
        return response.data;
    }

    /**
     * Transfer stablecoins from one user to another
     */
    async transferStablecoins(userId: string, transferData: TransferRequest): Promise<TransferTransactionResponse> {
        const response = await this.api.post<TransferTransactionResponse>(`/transfer/${userId}`, transferData);
        return response.data;
    }
}

// Export singleton instance
export const stablecoinApiService = new StablecoinApiService(); 