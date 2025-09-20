import { NextApiRequest, NextApiResponse } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
        // Get order from Convex
        const order = await convex.query(api.orders.getOrderById, {
            orderId: orderId as string
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.status(200).json(order);

    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({
            error: 'Failed to fetch order',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 