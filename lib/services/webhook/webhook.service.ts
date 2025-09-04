import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { ClerkWebhookEvent, BasicUserProfileData, WebhookResponse } from '../api/types';

export class WebhookService {
    private convex: ConvexHttpClient;

    constructor() {
        if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
            throw new Error('NEXT_PUBLIC_CONVEX_URL environment variable is required');
        }
        this.convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    }

    /**
     * Process Clerk webhook events with idempotency and error handling
     */
    async processClerkWebhook(event: ClerkWebhookEvent): Promise<WebhookResponse> {
        try {
            console.log(`[Webhook] Processing ${event.event_type} for user ${event.data?.id || 'unknown'}`);

            switch (event.event_type) {
                case 'user.created':
                    return await this.handleUserCreated(event);
                case 'user.updated':
                    return await this.handleUserUpdated(event);
                case 'user.deleted':
                    return await this.handleUserDeleted(event);
                case 'session.created':
                    return await this.handleSessionCreated(event);
                case 'session.ended':
                case 'session.removed':
                case 'session.revoked':
                    return await this.handleSessionEnded(event);
                default:
                    console.log(`[Webhook] Ignoring unhandled event type: ${event.event_type}`);
                    return {
                        success: true,
                        message: `Ignored event type: ${event.event_type}`
                    };
            }
        } catch (error) {
            console.error('[Webhook] Error processing webhook:', error);
            return {
                success: false,
                message: 'Failed to process webhook',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Handle user.created event - create basic user profile with idempotency
     */
    private async handleUserCreated(event: ClerkWebhookEvent): Promise<WebhookResponse> {
        const userData = this.extractUserData(event);

        if (!userData) {
            return {
                success: false,
                message: 'Failed to extract user data from webhook event'
            };
        }

        try {
            // Check if profile already exists (idempotency check)
            const existingProfile = await this.convex.query(api.users.getUserProfile, {
                clerkUserId: userData.clerkUserId
            });

            if (existingProfile) {
                console.log(`[Webhook] Profile already exists for ${userData.clerkUserId}, skipping creation`);
                return {
                    success: true,
                    message: 'User profile already exists'
                };
            }

            // Create basic user profile (no role assigned yet)
            await this.convex.mutation(api.users.createBasicUserProfile, userData);

            console.log(`[Webhook] Successfully created basic profile for user ${userData.clerkUserId}`);
            return {
                success: true,
                message: 'Basic user profile created successfully'
            };
        } catch (error) {
            console.error('[Webhook] Failed to create basic user profile:', error);
            return {
                success: false,
                message: 'Failed to create user profile',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Handle user.updated event - sync user data changes
     */
    private async handleUserUpdated(event: ClerkWebhookEvent): Promise<WebhookResponse> {
        const userData = this.extractUserData(event);

        if (!userData) {
            return {
                success: false,
                message: 'Failed to extract user data from webhook event'
            };
        }

        try {
            await this.convex.mutation(api.users.createBasicUserProfile, userData);

            console.log(`[Webhook] Successfully synced profile for user ${userData.clerkUserId}`);
            return {
                success: true,
                message: 'User profile synchronized successfully'
            };
        } catch (error) {
            console.error('[Webhook] Failed to sync user profile:', error);
            return {
                success: false,
                message: 'Failed to sync user profile',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Handle user.deleted event - log deletion
     */
    private async handleUserDeleted(event: ClerkWebhookEvent): Promise<WebhookResponse> {
        try {
            console.log(`[Webhook] User deleted: ${event.data.id}`);
            return {
                success: true,
                message: 'User deletion event processed'
            };
        } catch (error) {
            console.error('[Webhook] Failed to handle user deletion:', error);
            return {
                success: false,
                message: 'Failed to process user deletion',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Handle session.created event - log user login
     */
    private async handleSessionCreated(event: ClerkWebhookEvent): Promise<WebhookResponse> {
        try {
            console.log(`[Webhook] User logged in: ${event.data.id}`);
            return {
                success: true,
                message: 'Session creation logged'
            };
        } catch (error) {
            console.error('[Webhook] Failed to handle session creation:', error);
            return {
                success: false,
                message: 'Failed to process session creation',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Handle session end events - log user logout
     */
    private async handleSessionEnded(event: ClerkWebhookEvent): Promise<WebhookResponse> {
        try {
            console.log(`[Webhook] User logged out: ${event.data.id} (${event.event_type})`);
            return {
                success: true,
                message: 'Session end logged'
            };
        } catch (error) {
            console.error('[Webhook] Failed to handle session end:', error);
            return {
                success: false,
                message: 'Failed to process session end',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Extract user data from Clerk webhook event
     */
    private extractUserData(event: ClerkWebhookEvent): BasicUserProfileData | null {
        try {
            const { data } = event;

            const primaryEmail = data.email_addresses.find(
                email => email.id === data.primary_email_address_id
            )?.email_address || data.email_addresses[0]?.email_address;

            if (!primaryEmail) {
                console.error('[Webhook] No email address found in webhook event');
                return null;
            }

            return {
                clerkUserId: data.id,
                email: primaryEmail,
                firstName: data.first_name || 'User',
                lastName: data.last_name || ''
            };
        } catch (error) {
            console.error('[Webhook] Error extracting user data:', error);
            return null;
        }
    }

    /**
     * Validate webhook event structure
     */
    validateWebhookEvent(payload: unknown): payload is ClerkWebhookEvent {
        if (!payload || typeof payload !== 'object') {
            return false;
        }

        const event = payload as Partial<ClerkWebhookEvent>;

        return !!(
            event.data?.id &&
            event.event_type &&
            event.data.email_addresses &&
            Array.isArray(event.data.email_addresses) &&
            event.data.email_addresses.length > 0
        );
    }
}

// Export singleton instance
export const webhookService = new WebhookService(); 