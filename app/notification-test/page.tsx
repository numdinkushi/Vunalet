'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { notificationService } from '@/lib/pwa/notification-service';
import { toast } from 'sonner';

export default function NotificationTestPage() {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        if (typeof window === 'undefined') return;

        // Check if notifications are supported
        setIsSupported('Notification' in window && 'serviceWorker' in navigator);

        // Check current permission status
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
        }

        // Initialize notification service
        const initService = async () => {
            try {
                const initialized = await notificationService.initialize();
                setIsInitialized(initialized);
            } catch (error) {
                console.error('Failed to initialize notification service:', error);
            }
        };

        initService();
    }, []);

    const requestPermission = async () => {
        try {
            const granted = await notificationService.requestPermission();
            setPermissionStatus(granted ? 'granted' : 'denied');

            if (granted) {
                toast.success('Notification permission granted!');
                // Re-initialize service after permission is granted
                await notificationService.initialize();
                setIsInitialized(true);
            } else {
                toast.error('Notification permission denied');
            }
        } catch (error) {
            console.error('Failed to request permission:', error);
            toast.error('Failed to request notification permission');
        }
    };

    const testLocalNotification = async () => {
        try {
            await notificationService.showLocalNotification({
                title: 'Vunalet Test Notification',
                body: 'This is a test notification from your PWA! 🎉',
                icon: '/assets/logo/logo-192x192.png',
                tag: 'test-notification',
                url: '/',
            });
            toast.success('Test notification sent!');
        } catch (error) {
            console.error('Failed to show notification:', error);
            toast.error('Failed to show test notification');
        }
    };

    const getStatusIcon = (condition: boolean) => {
        return condition ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
            <XCircle className="w-5 h-5 text-red-500" />
        );
    };

    const getStatusBadge = (condition: boolean) => {
        return condition ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
                Supported
            </Badge>
        ) : (
            <Badge variant="destructive">
                Not Supported
            </Badge>
        );
    };

    const getPermissionBadge = (status: NotificationPermission) => {
        switch (status) {
            case 'granted':
                return <Badge variant="default" className="bg-green-100 text-green-800">Granted</Badge>;
            case 'denied':
                return <Badge variant="destructive">Denied</Badge>;
            default:
                return <Badge variant="secondary">Not Requested</Badge>;
        }
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Test</h1>
                    <p className="text-gray-600">Test web notifications on your PWA</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Notification Support */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notification Support
                            </CardTitle>
                            <CardDescription>
                                Check if notifications are supported on your device
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(isSupported)}
                                    <span>Notifications Supported</span>
                                </div>
                                {getStatusBadge(isSupported)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(isInitialized)}
                                    <span>Service Worker Ready</span>
                                </div>
                                {getStatusBadge(isInitialized)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(permissionStatus === 'granted')}
                                    <span>Permission Status</span>
                                </div>
                                {getPermissionBadge(permissionStatus)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Test Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Notifications</CardTitle>
                            <CardDescription>
                                Request permission and test local notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {permissionStatus === 'default' && (
                                <Button
                                    onClick={requestPermission}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    <Bell className="w-4 h-4 mr-2" />
                                    Request Permission
                                </Button>
                            )}

                            {permissionStatus === 'granted' && (
                                <Button
                                    onClick={testLocalNotification}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    <Bell className="w-4 h-4 mr-2" />
                                    Send Test Notification
                                </Button>
                            )}

                            {permissionStatus === 'denied' && (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        <span className="font-medium text-red-800">Permission Denied</span>
                                    </div>
                                    <p className="text-sm text-red-700">
                                        You need to enable notifications in your browser settings to test them.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Instructions */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>How Web Notifications Work</CardTitle>
                        <CardDescription>
                            Understanding web notifications in your PWA
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="font-medium mb-2">✅ What Works:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Local notifications (app-generated)</li>
                                    <li>• Push notifications (server-sent)</li>
                                    <li>• Desktop and mobile browsers</li>
                                    <li>• PWA installed apps</li>
                                    <li>• Background notifications</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">📱 Browser Support:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Chrome/Edge: Full support</li>
                                    <li>• Firefox: Full support</li>
                                    <li>• Safari: Limited support</li>
                                    <li>• Mobile browsers: Varies</li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">💡 Pro Tip:</h4>
                            <p className="text-sm text-blue-700">
                                Notifications work best when your PWA is installed and running.
                                Try installing the app first, then test notifications!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 