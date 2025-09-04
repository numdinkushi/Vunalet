import type { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix';
import { webhookService } from '../../../lib/services/webhook/webhook.service';
import { WebhookResponse, ClerkWebhookEvent } from '../../../lib/services/api/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<WebhookResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

        // Get headers
        const svix_id = req.headers['svix-id'] as string;
        const svix_timestamp = req.headers['svix-timestamp'] as string;
        const svix_signature = req.headers['svix-signature'] as string;

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing required webhook headers'
            });
        }

        // Simple body handling - req.body should be the raw string when bodyParser is false
        const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        console.log('[Webhook] Body type:', typeof req.body, 'Length:', body?.length);

        // Verify webhook
        const webhook = new Webhook(webhookSecret);
        const verifiedPayload = webhook.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });

        // Type assertion after verification
        const event = verifiedPayload as ClerkWebhookEvent;

        console.log(`[Webhook] Verified: ${event.type}`);

        // Process the event
        const result = await webhookService.processClerkWebhook(event);

        return res.status(200).json(result);
 
    } catch (error) {
        console.error('[Webhook] Error:', error);

        // For debugging, let's also log the raw request details
        console.log('[Webhook] Debug - Headers:', {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'content-type': req.headers['content-type']
        });
        console.log('[Webhook] Debug - Body type:', typeof req.body);

        return res.status(200).json({
            success: false,
            message: 'Webhook processing failed',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}; 