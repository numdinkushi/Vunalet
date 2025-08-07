import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiConfig, ApiError, HttpMethod } from './types';

/**
 * Base HTTP Client following Single Responsibility Principle
 * Handles all HTTP communication with proper error handling and logging
 */
export class HttpClient {
    private client: AxiosInstance;

    constructor(config: ApiConfig) {
        this.client = axios.create(config);
        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors for logging and error handling
     */
    private setupInterceptors(): void {
        // Request interceptor for logging
        this.client.interceptors.request.use(
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
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`API Response: ${response.status} ${response.config.url}`);
                return response;
            },
            (error: AxiosError) => {
                console.log('API Response Error:', error);
                return Promise.reject(this.handleAxiosError(error));
            }
        );
    }

    /**
     * Handle different types of axios errors and convert to standardized ApiError
     */
    private handleAxiosError(error: AxiosError): ApiError {
        if (error.response) {
            // Server responded with error status
            const errorData = error.response.data;
            let errorMessage = 'Server error';

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData && typeof errorData === 'object') {
                if ('message' in errorData && typeof errorData.message === 'string') {
                    errorMessage = errorData.message;
                } else if ('errors' in errorData && Array.isArray(errorData.errors)) {
                    errorMessage = errorData.errors.join(', ');
                }
            }

            return {
                message: errorMessage,
                status: error.response.status,
            };
        } else if (error.request) {
            // Request made but no response received
            return {
                message: 'No response from server',
                status: 503,
            };
        } else {
            // Request setup error
            return {
                message: error.message || 'Request failed',
                status: 500,
            };
        }
    }

    /**
     * Generic HTTP request method
     */
    async request<T>(
        method: HttpMethod,
        url: string,
        data?: any,
        config?: any
    ): Promise<T> {
        try {
            const response = await this.client.request<T>({
                method,
                url,
                data,
                ...config,
            });
            return response.data;
        } catch (error) {
            throw error as ApiError;
        }
    }

    /**
     * GET request
     */
    async get<T>(url: string, config?: any): Promise<T> {
        return this.request<T>('GET', url, undefined, config);
    }

    /**
     * POST request
     */
    async post<T>(url: string, data?: any, config?: any): Promise<T> {
        return this.request<T>('POST', url, data, config);
    }

    /**
     * PUT request
     */
    async put<T>(url: string, data?: any, config?: any): Promise<T> {
        return this.request<T>('PUT', url, data, config);
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string, config?: any): Promise<T> {
        return this.request<T>('DELETE', url, undefined, config);
    }

    /**
     * PATCH request
     */
    async patch<T>(url: string, data?: any, config?: any): Promise<T> {
        return this.request<T>('PATCH', url, data, config);
    }
} 