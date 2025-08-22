'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, CheckCircle, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function PWAInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [canInstall, setCanInstall] = useState(false);

    // Check if app is already installed
    const checkIfInstalled = useCallback(() => {
        if (typeof window === 'undefined') return false;

        // Check for standalone display mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        // Check for iOS standalone mode
        const isIOSStandalone = 'standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean; }).standalone === true;

        // Check if installed via Chrome's WebAPK
        const isWebAPK = document.referrer.includes('android-app://');

        return isStandalone || isIOSStandalone || isWebAPK;
    }, []);

    // Check browser support and PWA requirements
    const checkPWASupport = useCallback(() => {
        if (typeof window === 'undefined') return false;

        const hasManifest = !!document.querySelector('link[rel="manifest"]');
        const hasServiceWorker = 'serviceWorker' in navigator;
        const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        const supportsBeforeInstall = 'onbeforeinstallprompt' in window;

        console.log('🔍 PWA Support Check:', {
            hasManifest,
            hasServiceWorker,
            isHttps,
            supportsBeforeInstall,
            userAgent: navigator.userAgent,
            url: window.location.href
        });

        return hasManifest && hasServiceWorker && isHttps && supportsBeforeInstall;
    }, []);

    // Register service worker
    const registerServiceWorker = useCallback(async () => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            console.log('Service Worker not supported');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered:', registration);

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;
            console.log('Service Worker ready');

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }, []);

    useEffect(() => {
        // Mark as client-side first
        setIsClient(true);

        // Only proceed if we're on the client side
        if (typeof window === 'undefined') return;

        // Check if already installed
        if (checkIfInstalled()) {
            console.log('PWA already installed');
            setIsInstalled(true);
            return;
        }

        // Check PWA support
        if (!checkPWASupport()) {
            console.log('PWA not supported or requirements not met');
            return;
        }

        setCanInstall(true);

        // Handle beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('🎉 beforeinstallprompt event fired');
            e.preventDefault();

            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);

            // Show prompt after a short delay to ensure good UX
            setTimeout(() => {
                setShowPrompt(true);
            }, 2000);
        };

        // Handle app installation
        const handleAppInstalled = (e: Event) => {
            console.log('🎉 App installed successfully');
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
            toast.success('Vunalet installed successfully!');
        };

        // Add event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Register service worker
        registerServiceWorker();

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [checkIfInstalled, checkPWASupport, registerServiceWorker]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            console.error('No deferred prompt available');
            toast.error('Installation not available. Please try refreshing the page.');
            return;
        }

        try {
            console.log('Showing install prompt...');
            await deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;
            console.log('User choice:', outcome);

            if (outcome === 'accepted') {
                toast.success('Installation started!');
                setShowPrompt(false);
            } else {
                toast.info('Installation cancelled');
            }

            // Clear the prompt
            setDeferredPrompt(null);

        } catch (error) {
            console.error('Installation error:', error);
            toast.error('Installation failed. Please try again.');
        }
    };

    const handleDismiss = () => {
        console.log('Install prompt dismissed');
        setShowPrompt(false);

        // Don't show again for this session
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pwa-install-dismissed', 'true');
        }
    };

    // Don't render anything until client-side
    if (!isClient) return null;

    // Don't render if already installed
    if (isInstalled) return null;

    // Don't render if PWA not supported
    if (!canInstall) return null;

    // Don't render if dismissed in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-install-dismissed')) return null;

    // Only show if we have the prompt and should show it
    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
            <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 animate-in slide-in-from-bottom duration-300">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Smartphone className="w-5 h-5 text-green-600" />
                            <CardTitle className="text-lg">Install Vunalet</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDismiss}
                            className="h-8 w-8 p-0 hover:bg-green-100"
                            aria-label="Dismiss install prompt"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        Get the full app experience with offline access and push notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Works offline</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Instant loading</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Native app feel</span>
                        </div>
                    </div>

                    <div className="flex space-x-2 pt-3">
                        <Button
                            onClick={handleInstallClick}
                            className="flex-1 bg-green-600 hover:bg-green-700 transition-colors"
                            disabled={!deferredPrompt}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Install App
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDismiss}
                            className="flex-1 hover:bg-green-50 transition-colors"
                        >
                            Not Now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 