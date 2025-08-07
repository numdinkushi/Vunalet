import { stablecoinApi } from '../api/stablecoin-api';
import { UserIntegrationData, IntegrationResult, CreateUserResponse } from '../api/types';
import { toast } from 'sonner';

/**
 * User Integration Service following Single Responsibility Principle
 * Orchestrates user creation across multiple systems (Clerk, Convex, Stablecoin)
 */
export class UserIntegrationService {
    private static instance: UserIntegrationService;

    private constructor() { }

    /**
     * Singleton pattern for integration service
     */
    public static getInstance(): UserIntegrationService {
        if (!UserIntegrationService.instance) {
            UserIntegrationService.instance = new UserIntegrationService();
        }
        return UserIntegrationService.instance;
    }

    /**
     * Create user in stablecoin system
     */
    async createStablecoinUser(userData: UserIntegrationData): Promise<IntegrationResult> {
        try {
            console.log('Creating user in stablecoin system:', userData);

            const stablecoinUserData = {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
            };

            const stablecoinUser = await stablecoinApi.createUser(stablecoinUserData);
            console.log('User created in stablecoin system:', stablecoinUser);

            return {
                success: true,
                stablecoinUser,
            };
        } catch (error) {
            console.log('Failed to create user in stablecoin system:', error);
            return this.handleIntegrationError(error);
        }
    }

    /**
     * Activate payment for a user
     */
    async activatePayment(userId: string): Promise<void> {
        try {
            console.log('Activating payment for user:', userId);
            await stablecoinApi.activatePayment(userId);
            console.log('Payment activated successfully for user:', userId);
        } catch (error) {
            console.log('Failed to activate payment:', error);

            // Handle specific timeout errors
            if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
                console.log('Payment activation timed out, but this is expected for first-time activation');
                // Don't throw error for timeout, as it might be a slow external API
                return;
            }

            throw error;
        }
    }

    /**
     * Complete user integration flow
     * 1. Create user in stablecoin system
     * 2. Activate payment for the user
     * 3. Return data for Convex update
     */
    async completeUserIntegration(userData: UserIntegrationData): Promise<IntegrationResult> {
        try {
            // Step 1: Create user in stablecoin system
            const result = await this.createStablecoinUser(userData);

            if (!result.success || !result.stablecoinUser) {
                return result;
            }

            // Step 2: Activate payment for the user
            try {
                await this.activatePayment(result.stablecoinUser.id);
                console.log('Payment activation completed successfully');
            } catch (activationError) {
                console.log('Payment activation failed, but continuing with user creation:', activationError);
                // Don't fail the entire registration if payment activation fails
                // The user can still be created, payment can be activated later
            }

            // Step 3: Prepare data for Convex update
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
        } catch (error) {
            console.log('User integration failed:', error);
            return this.handleIntegrationError(error);
        }
    }

    /**
     * Handle integration errors and provide user-friendly messages
     */
    private handleIntegrationError(error: unknown): IntegrationResult {
        let errorMessage = 'Failed to create user in stablecoin system';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (error && typeof error === 'object') {
            if ('message' in error && typeof error.message === 'string') {
                errorMessage = error.message;
            } else if ('error' in error && typeof error.error === 'string') {
                errorMessage = error.error;
            } else {
                errorMessage = String(error);
            }
        }

        toast.error(`Failed to complete user integration: ${errorMessage}`);

        return {
            success: false,
            error: errorMessage,
        };
    }

    /**
     * Health check for the integration service
     */
    async healthCheck(): Promise<boolean> {
        try {
            return await stablecoinApi.healthCheck();
        } catch (error) {
            console.log('Integration service health check failed:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`User integration service health check failed: ${errorMessage}`);
            return false;
        }
    }

    /**
     * Validate user data before integration
     */
    validateUserData(userData: UserIntegrationData): boolean {
        const requiredFields = ['clerkUserId', 'email', 'firstName', 'lastName'];
        return requiredFields.every(field =>
            userData[field as keyof UserIntegrationData] &&
            userData[field as keyof UserIntegrationData].trim() !== ''
        );
    }
}

// Export singleton instance
export const userIntegrationService = UserIntegrationService.getInstance(); 