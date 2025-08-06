import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types for API responses
export interface CreateUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    publicKey: string;
    paymentIdentifier: string;
}

export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
}

export interface ApiError {
    message: string;
    status?: number;
}



// Create axios instance for our Next.js API routes
const api = axios.create({
    baseURL: '/api/stablecoin',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error);

        // Handle different types of axios errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorData = error.response.data;
            console.error('Server error response:', errorData);
            return Promise.reject({
                message: errorData?.message || errorData || 'Server error',
                status: error.response.status,
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            return Promise.reject({
                message: 'No response from server',
                status: 503,
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
            return Promise.reject({
                message: error.message || 'Request failed',
                status: 500,
            });
        }
    }
);

// API service class
export class StablecoinApiService {
    private static instance: StablecoinApiService;
    private api: AxiosInstance;

    private constructor() {
        this.api = api;
    }

    public static getInstance(): StablecoinApiService {
        if (!StablecoinApiService.instance) {
            StablecoinApiService.instance = new StablecoinApiService();
        }
        return StablecoinApiService.instance;
    }

    /**
     * Create a new user in the stablecoin system via our Next.js API
     */
    async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
        try {
            console.log('Creating user via stablecoin API:', userData);
            const response = await this.api.post<CreateUserResponse>('/users', userData);
            console.log('User created successfully:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to create user:', error);

            // If it's already an ApiError, throw it as is
            if (error && typeof error === 'object' && 'message' in error) {
                throw error as ApiError;
            }

            // Otherwise, wrap it in an ApiError
            throw {
                message: error instanceof Error ? error.message : String(error),
                status: 500,
            } as ApiError;
        }
    }

    /**
     * Get user by ID (if needed in the future)
     */
    async getUserById(userId: string): Promise<CreateUserResponse> {
        try {
            const response = await this.api.get<CreateUserResponse>(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get user:', error);
            throw error as ApiError;
        }
    }

    /**
     * Update user information (if needed in the future)
     */
    async updateUser(userId: string, userData: Partial<CreateUserRequest>): Promise<CreateUserResponse> {
        try {
            const response = await this.api.put<CreateUserResponse>(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Failed to update user:', error);
            throw error as ApiError;
        }
    }

    /**
     * Delete user (if needed in the future)
     */
    async deleteUser(userId: string): Promise<void> {
        try {
            await this.api.delete(`/users/${userId}`);
        } catch (error) {
            console.error('Failed to delete user:', error);
            throw error as ApiError;
        }
    }


}

// Export singleton instance
export const stablecoinApi = StablecoinApiService.getInstance();

// Export types for use in other files
export type { CreateUserResponse, CreateUserRequest, ApiError }; 