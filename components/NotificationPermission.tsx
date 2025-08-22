'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { notificationService } from '@/lib/pwa/notification-service';

export function NotificationPermission() {
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Mark as client-side
        setIsClient(true);

        // Only run on client side
        if (typeof window === 'undefined') return;

        // Check current permission status
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);

            // Show prompt if permission is default (not granted/denied)
            if (Notification.permission === 'default') {
                // Delay showing the prompt to not overwhelm users
                const timer = setTimeout(() => {
                    setShowPermissionPrompt(true);
                }, 3000); // Show after 3 seconds

                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleEnableNotifications = async () => {
        try {
            const granted = await notificationService.requestPermission();

            if (granted) {
                setPermissionStatus('granted');
                setShowPermissionPrompt(false);
                toast.success('Notifications enabled! You\'ll receive updates about your orders.');

                // Initialize notification service
                await notificationService.initialize();
            } else {
                setPermissionStatus('denied');
                setShowPermissionPrompt(false);
                toast.error('Notification permission denied. You can enable it later in your browser settings.');
            }
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            toast.error('Failed to enable notifications. Please try again.');
        }
    };

    const handleDismiss = () => {
        setShowPermissionPrompt(false);
    };

    // Don't render anything until client-side
    if (!isClient) return null;

    // Don't show if permission is already granted/denied or prompt is dismissed
    if (permissionStatus !== 'default' || !showPermissionPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
            <Card className="shadow-lg border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Bell className="w-5 h-5 text-yellow-600" />
                            <CardTitle className="text-lg">Enable Notifications</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDismiss}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        Get real-time updates about your orders and deliveries
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Order status updates</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Delivery notifications</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Special offers and deals</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                        <Button
                            onClick={handleEnableNotifications}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            Enable
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDismiss}
                            className="flex-1"
                        >
                            Later
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 