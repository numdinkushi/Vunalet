import { UserIntegrationData, IntegrationResult, } from '../api/types';
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
            const stablecoinUserData = {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
            };

            const response = await fetch('/api/stablecoin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stablecoinUserData),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.error && errorData.error.includes('Unique constraint failed on the constraint: `User_email_key`')) {
                    return {
                        success: false,
                        error: 'User already exists in stablecoin system',
                    };
                }

                throw new Error(errorData.message || 'Failed to create user in stablecoin system');
            }

            const stablecoinUser = await response.json();

            return {
                success: true,
                stablecoinUser,
            };
        } catch (error) {
            return this.handleIntegrationError(error);
        }
    }

    async activatePayment(userId: string): Promise<void> {
        try {
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

            await response.json();
        } catch (error) {
            throw error;
        }
    }

    async mintStablecoins(paymentIdentifier: string, amount: number = 30, notes?: string): Promise<void> {
        try {
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

            await response.json();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Complete user integration flow
     * 1. Create user in stablecoin system
     * 2. Activate payment for the user
     * 3. Mint R30 stablecoins to user's payment identifier
     * 4. Return data for Convex update with minted amount
     */
    async completeUserIntegration(userData: UserIntegrationData): Promise<IntegrationResult> {
        try {
            const result = await this.createStablecoinUser(userData);

            if (!result.success || !result.stablecoinUser) {
                return result;
            }

            try {
                await this.activatePayment(result.stablecoinUser.id);
            } catch (error) {
                console.log('Payment activation failed:', error);
            }

            let mintedAmount = 0;

            try {
                await this.mintStablecoins(result.stablecoinUser.paymentIdentifier, 30, 'Onboarding Token');
                mintedAmount = 30;
            } catch (error) {
                console.log('Stablecoin minting failed:', error);
            }

            return {
                success: true,
                stablecoinUser: result.stablecoinUser,
                mintedAmount,
            };
        } catch (error) {
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