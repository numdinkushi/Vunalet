export interface NotificationData {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    url?: string;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
}

class NotificationService {
    private registration: ServiceWorkerRegistration | null = null;

    async initialize() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push notifications are not supported');
            return false;
        }

        try {
            this.registration = await navigator.serviceWorker.ready;
            return true;
        } catch (error) {
            console.error('Failed to initialize notification service:', error);
            return false;
        }
    }

    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('Notifications are not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            console.warn('Notification permission denied');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    }

    async subscribeToPushNotifications(vapidPublicKey: string): Promise<PushSubscription | null> {
        if (!this.registration) {
            console.error('Service worker not registered');
            return null;
        }

        try {
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
            });

            console.log('Push subscription created:', subscription);
            return subscription;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return null;
        }
    }

    async unsubscribeFromPushNotifications(): Promise<boolean> {
        if (!this.registration) {
            return false;
        }

        try {
            const subscription = await this.registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                console.log('Push subscription removed');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
            return false;
        }
    }

    async showLocalNotification(data: NotificationData): Promise<void> {
        if (!this.registration) {
            console.error('Service worker not registered');
            return;
        }

        if (Notification.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        try {
            await this.registration.showNotification(data.title, {
                body: data.body,
                icon: data.icon || '/assets/logo/logo.png',
                badge: data.badge || '/assets/logo/logo.png',
                tag: data.tag,
                data: {
                    url: data.url,
                },
                requireInteraction: true,
                vibrate: [100, 50, 100],
            } as NotificationOptions);
        } catch (error) {
            console.error('Failed to show local notification:', error);
        }
    }

    async getSubscription(): Promise<PushSubscription | null> {
        if (!this.registration) {
            return null;
        }

        try {
            return await this.registration.pushManager.getSubscription();
        } catch (error) {
            console.error('Failed to get push subscription:', error);
            return null;
        }
    }

    // Helper function to convert VAPID public key
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Export singleton instance
export const notificationService = new NotificationService(); 