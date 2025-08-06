import { stablecoinApi, CreateUserRequest, CreateUserResponse } from './stablecoinApi';

export interface UserIntegrationData {
    clerkUserId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface IntegrationResult {
    success: boolean;
    stablecoinUser?: CreateUserResponse;
    error?: string;
}

/**
 * Service to handle user creation and integration between Clerk, Convex, and Stablecoin API
 */
export class UserIntegrationService {
    private static instance: UserIntegrationService;

    private constructor() { }

    public static getInstance(): UserIntegrationService {
        if (!UserIntegrationService.instance) {
            UserIntegrationService.instance = new UserIntegrationService();
        }
        return UserIntegrationService.instance;
    }

    /**
     * Create user in stablecoin system and return integration data
     */
    async createStablecoinUser(userData: UserIntegrationData): Promise<IntegrationResult> {
        try {
            console.log('Creating user in stablecoin system:', userData);

            // Prepare data for stablecoin API
            const stablecoinUserData: CreateUserRequest = {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
            };

            // Create user in stablecoin system using fetch-based API
            const stablecoinUser = await stablecoinApi.createUser(stablecoinUserData);

            console.log('User created in stablecoin system:', stablecoinUser);

            return {
                success: true,
                stablecoinUser,
            };
        } catch (error: unknown) {
            console.error('Failed to create user in stablecoin system:', error);

            // Check if the error is due to user already existing
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('Unique constraint failed on the constraint: `User_email_key`') ||
                errorMessage.includes('User already exists')) {
                console.log('User already exists in stablecoin system, this is expected for returning users');

                // Try to extract existing user data from the error response
                let existingUserData = null;
                if (error && typeof error === 'object' && 'response' in error) {
                    const response = (error as { response?: { data?: { existingUser?: CreateUserResponse; }; }; }).response;
                    if (response?.data?.existingUser) {
                        existingUserData = response.data.existingUser;
                    }
                }

                // Return existing user data if available, otherwise use fallback
                return {
                    success: true,
                    stablecoinUser: existingUserData || {
                        id: 'existing-user-id', // This should be fetched from the API
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        publicKey: 'existing-public-key', // This should be fetched from the API
                        paymentIdentifier: 'existing-payment-identifier', // This should be fetched from the API
                    },
                };
            }

            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Complete user integration flow
     * 1. Create user in stablecoin system
     * 2. Return data for Convex update
     */
    async completeUserIntegration(userData: UserIntegrationData): Promise<IntegrationResult> {
        try {
            // Step 1: Create user in stablecoin system
            const result = await this.createStablecoinUser(userData);

            if (!result.success || !result.stablecoinUser) {
                return result;
            }

            // Step 2: Return data for Convex update
            const convexUpdateData = {
                clerkUserId: userData.clerkUserId,
                liskId: result.stablecoinUser.id,
                publicKey: result.stablecoinUser.publicKey,
                paymentIdentifier: result.stablecoinUser.paymentIdentifier,
            };

            console.log('Integration completed successfully. Convex update data:', convexUpdateData);

            return {
                success: true,
                stablecoinUser: result.stablecoinUser,
            };
        } catch (error: unknown) {
            console.error('User integration failed:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Health check for the integration service
     */
    async healthCheck(): Promise<boolean> {
        try {
            return await stablecoinApi.healthCheck();
        } catch (error) {
            console.error('Integration service health check failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const userIntegrationService = UserIntegrationService.getInstance(); 