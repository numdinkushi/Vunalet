import { HttpClient } from './http-client';
import {
    CreateUserRequest,
    CreateUserResponse,
    PaymentRequest,
    PaymentResponse,
    ApiConfig
} from './types';

/**
 * Stablecoin API Service following Single Responsibility Principle
 * Handles all stablecoin-related API operations
 */
export class StablecoinApiService {
    private httpClient: HttpClient;
    private static instance: StablecoinApiService;

    private constructor() {
        const config: ApiConfig = {
            baseURL: '/api/stablecoin',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        this.httpClient = new HttpClient(config);
    }

    /**
     * Singleton pattern for API service
     */
    public static getInstance(): StablecoinApiService {
        if (!StablecoinApiService.instance) {
            StablecoinApiService.instance = new StablecoinApiService();
        }
        return StablecoinApiService.instance;
    }

    /**
     * Create a new user in the stablecoin system
     */
    async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
        console.log('Creating user via stablecoin API:', userData);

        try {
            const response = await this.httpClient.post<CreateUserResponse>('/users', userData);
            console.log('User created successfully:', response);
            return response;
        } catch (error) {
            console.log('Failed to create user:', error);
            this.handleUserCreationError(error);
            throw error;
        }
    }

    /**
     * Handle specific error cases for user creation
     */
    private handleUserCreationError(error: any): void {
        // Check if it's a 409 error (user already exists)
        if (error && typeof error === 'object' && 'status' in error && error.status === 409) {
            console.log('User already exists, returning existing user data');
            // This could be handled differently based on business requirements
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<CreateUserResponse> {
        try {
            return await this.httpClient.get<CreateUserResponse>(`/users/${userId}`);
        } catch (error) {
            console.log('Failed to get user:', error);
            throw error;
        }
    }

    /**
     * Update user information
     */
    async updateUser(userId: string, userData: Partial<CreateUserRequest>): Promise<CreateUserResponse> {
        try {
            return await this.httpClient.put<CreateUserResponse>(`/users/${userId}`, userData);
        } catch (error) {
            console.log('Failed to update user:', error);
            throw error;
        }
    }

    /**
     * Delete user
     */
    async deleteUser(userId: string): Promise<void> {
        try {
            await this.httpClient.delete(`/users/${userId}`);
        } catch (error) {
            console.log('Failed to delete user:', error);
            throw error;
        }
    }

    /**
     * Create a payment
     */
    async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
        try {
            return await this.httpClient.post<PaymentResponse>('/payments', paymentData);
        } catch (error) {
            console.log('Failed to create payment:', error);
            throw error;
        }
    }

    /**
     * Get payment by ID
     */
    async getPayment(paymentId: string): Promise<PaymentResponse> {
        try {
            return await this.httpClient.get<PaymentResponse>(`/payments/${paymentId}`);
        } catch (error) {
            console.log('Failed to get payment:', error);
            throw error;
        }
    }

    /**
     * Health check for the API
     */
    async healthCheck(): Promise<boolean> {
        try {
            await this.httpClient.get('/health');
            return true;
        } catch (error) {
            console.log('Health check failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const stablecoinApi = StablecoinApiService.getInstance(); 