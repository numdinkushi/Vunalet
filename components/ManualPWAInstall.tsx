'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function ManualPWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Mark as client-side
        setIsClient(true);

        // Only run on client side
        if (typeof window === 'undefined') return;

        // Check if PWA is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        // Listen for appinstalled event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }

            setDeferredPrompt(null);
        } catch (error) {
            console.error('Installation failed:', error);
        }
    };

    // Don't render anything until client-side
    if (!isClient) return null;

    // Only show on mobile devices
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return null;

    // Don't show if already installed or no prompt available
    if (isInstalled || !deferredPrompt) {
        return null;
    }

    return (
        <Button
            onClick={handleInstallClick}
            className="fixed top-4 right-4 z-40 bg-green-600 hover:bg-green-700 text-white shadow-lg"
            size="sm"
        >
            <Download className="w-4 h-4 mr-2" />
            Install App
        </Button>
    );
} 