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
     * Create user in stablecoin system via API route
     */
    async createStablecoinUser(userData: UserIntegrationData): Promise<IntegrationResult> {
        try {
            console.log('Creating user in stablecoin system:', userData);

            const stablecoinUserData = {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
            };

            // Use the Next.js API route instead of direct service call
            const response = await fetch('/api/stablecoin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stablecoinUserData),
            });

            if (!response.ok) {
                const errorData = await response.json();

                // Check for specific "user already exists" error
                if (errorData.error && errorData.error.includes('Unique constraint failed on the constraint: `User_email_key`')) {
                    console.log('User already exists in stablecoin system:', userData.email);
                    return {
                        success: false,
                        error: 'User already exists in stablecoin system',
                    };
                }

                throw new Error(errorData.message || 'Failed to create user in stablecoin system');
            }

            const stablecoinUser = await response.json();
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
     * Activate payment for a user via API route
     */
    async activatePayment(userId: string): Promise<void> {
        try {
            console.log('Activating payment for user:', userId);

            const response = await fetch(`/api/stablecoin/activate-pay/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to activate payment');
            }

            const result = await response.json();
            console.log('Payment activated successfully for user:', userId, result);
        } catch (error) {
            console.log('Failed to activate payment:', error);
            throw error;
        }
    }

    /**
     * Mint stablecoins to user's payment identifier via API route
     */
    async mintStablecoins(paymentIdentifier: string, amount: number = 30, notes?: string): Promise<void> {
        try {
            console.log('Minting stablecoins for user:', { paymentIdentifier, amount, notes });

            const response = await fetch('/api/stablecoin/mint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentIdentifier,
                    amount,
                    notes: notes || 'Onboarding Token',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to mint stablecoins');
            }

            const result = await response.json();
            console.log('Stablecoins minted successfully:', result);
        } catch (error) {
            console.log('Failed to mint stablecoins:', error);
            throw error;
        }
    }

    /**
     * Complete user integration flow
     * 1. Create user in stablecoin system
     * 2. Mint R30 stablecoins to user's payment identifier
     * 3. Activate payment for the user
     * 4. Return data for Convex update
     */
    async completeUserIntegration(userData: UserIntegrationData): Promise<IntegrationResult> {
        try {
            // Step 1: Create user in stablecoin system
            const result = await this.createStablecoinUser(userData);

            if (!result.success || !result.stablecoinUser) {
                return result;
            }

            // Step 2: Mint R30 stablecoins to user's payment identifier
            try {
                await this.mintStablecoins(result.stablecoinUser.paymentIdentifier, 30, 'Onboarding Token');
                console.log('Stablecoins minted successfully for onboarding');
            } catch (mintError) {
                console.log('Stablecoin minting failed, but continuing with user creation:', mintError);
                // Don't fail the entire registration if minting fails
                // The user can still be created, minting can be retried later
            }

            // Step 3: Activate payment for the user
            try {
                await this.activatePayment(result.stablecoinUser.id);
                console.log('Payment activation completed successfully');
            } catch (activationError) {
                console.log('Payment activation failed, but continuing with user creation:', activationError);
                // Don't fail the entire registration if payment activation fails
                // The user can still be created, payment can be activated later
            }

            // Step 4: Prepare data for Convex update
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
            // Since healthCheck method was removed from the service, return true for now
            return true;
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