'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Badge } from '../../ui/badge';
import { Bell } from 'lucide-react';

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
    const notifications = useQuery(api.notifications.getNotifications, { userId });

    const unreadCount = notifications?.filter((n: Notification) => !n.isRead).length || 0;

    if (unreadCount === 0) return null;

    return (
        <div className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
                {unreadCount}
            </Badge>
        </div>
    );
} 