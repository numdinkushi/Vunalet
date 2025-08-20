'use client';

 
 
 

// Declare BeforeInstallPromptEvent type
declare global {
    interface BeforeInstallPromptEvent extends Event {
        prompt(): Promise<void>;
        userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; }>;
    }
}

import { useEffect, useState } from 'react';

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    const subscribeToNotifications = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });

            // Send subscription to server
            await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription),
            });

            setIsSubscribed(true);
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
        }
    };

    const unsubscribeFromNotifications = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();

                // Notify server
                await fetch('/api/unsubscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subscription),
                });
            }

            setIsSubscribed(false);
        } catch (error) {
            console.error('Error unsubscribing from notifications:', error);
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
            >
                {isSubscribed ? '🔕 Disable Notifications' : '🔔 Enable Notifications'}
            </button>
        </div>
    );
}

export function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const installApp = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }

            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    if (!showPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🌱</span>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        Install Vunalet
                    </p>
                    <p className="text-xs text-gray-500">
                        Get quick access to fresh produce
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowPrompt(false)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                    >
                        Not now
                    </button>
                    <button
                        onClick={installApp}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    );
} 