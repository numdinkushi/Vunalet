import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'sonner';

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
        console.log('API Request Error:', error);
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
        console.log('API Response Error:', error);

        // Handle different types of axios errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorData = error.response.data;
            console.log('Server error response:', errorData);

            // Extract clean error message
            let errorMessage = 'Server error';
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (errorData?.errors && Array.isArray(errorData.errors)) {
                errorMessage = errorData.errors.join(', ');
            }

            return Promise.reject({
                message: errorMessage,
                status: error.response.status,
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.log('No response received:', error.request);
            return Promise.reject({
                message: 'No response from server',
                status: 503,
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Request setup error:', error.message);
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
            console.log('Failed to create user:', error);

            // Check if it's a 409 error (user already exists)
            if (error && typeof error === 'object' && 'response' in error) {
                const response = (error as { response?: { status?: number; data?: any; }; }).response;
                if (response?.status === 409 && response?.data?.existingUser) {
                    console.log('User already exists, returning existing user data');
                    toast.success('User account already exists in stablecoin system');
                    return response.data.existingUser;
                }
            }

            // If it's already an ApiError, throw it as is
            if (error && typeof error === 'object' && 'message' in error) {
                throw error as ApiError;
            }

            // Otherwise, wrap it in an ApiError
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw {
                message: errorMessage,
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
            console.log('Failed to get user:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Failed to retrieve user from stablecoin system: ${errorMessage}`);
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
            console.log('Failed to update user:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Failed to update user in stablecoin system: ${errorMessage}`);
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
            console.log('Failed to delete user:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Failed to delete user from stablecoin system: ${errorMessage}`);
            throw error as ApiError;
        }
    }

    /**
     * Health check for the API
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.api.get('/health');
            return response.status === 200;
        } catch (error) {
            console.log('Health check failed:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Stablecoin system health check failed: ${errorMessage}`);
            return false;
        }
    }

}

// Export singleton instance
export const stablecoinApi = StablecoinApiService.getInstance(); 