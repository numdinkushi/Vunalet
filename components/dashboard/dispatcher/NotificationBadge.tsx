'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Badge } from '../../ui/badge';

interface NotificationBadgeProps {
    userId: string;
}

interface Notification {
    _id: string;
    userId: string;
    type: 'order_update' | 'payment' | 'delivery' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    metadata?: unknown;
    createdAt: number;
}

export function NotificationBadge({ userId }: NotificationBadgeProps) {
    const notifications = useQuery(
        api.notifications.getNotifications,
        userId ? { userId } : "skip"
    );

    const unreadCount = notifications?.filter((n: Notification) => !n.isRead).length || 0;

    if (unreadCount === 0) return null;

    return (
        <Badge variant="destructive" className="ml-2">
            {unreadCount}
        </Badge>
    );
} 