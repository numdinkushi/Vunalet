'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Smartphone, Globe } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

export default function PWATestPage() {
    const { isMobile, isClient } = useMobile();
    const [pwaStatus, setPwaStatus] = useState<{
        isInstalled: boolean;
        isStandalone: boolean;
        hasServiceWorker: boolean;
        isHttps: boolean;
        hasManifest: boolean;
        canInstall: boolean;
        installPrompt: any;
    }>({
        isInstalled: false,
        isStandalone: false,
        hasServiceWorker: false,
        isHttps: false,
        hasManifest: false,
        canInstall: false,
        installPrompt: null,
    });

    useEffect(() => {
        // Check PWA requirements
        const checkPWAStatus = async () => {
            const status = {
                isInstalled: false,
                isStandalone: false,
                hasServiceWorker: false,
                isHttps: false,
                hasManifest: false,
                canInstall: false,
                installPrompt: null,
            };

            // Check if running in standalone mode (installed)
            status.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            status.isInstalled = status.isStandalone;

            // Check if HTTPS
            status.isHttps = window.location.protocol === 'https:';

            // Check if service worker is supported and registered
            status.hasServiceWorker = 'serviceWorker' in navigator;

            // Check if manifest is accessible
            try {
                const manifestResponse = await fetch('/manifest.json');
                status.hasManifest = manifestResponse.ok;
            } catch (error) {
                status.hasManifest = false;
            }

            // Check if can install
            status.canInstall = 'BeforeInstallPromptEvent' in window;

            setPwaStatus(status);
        };

        checkPWAStatus();

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setPwaStatus(prev => ({ ...prev, installPrompt: e, canInstall: true }));
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

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
                Pass
            </Badge>
        ) : (
            <Badge variant="destructive">
                Fail
            </Badge>
        );
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">PWA Installation Test</h1>
                    <p className="text-gray-600">Check if your PWA meets all installation requirements</p>

                    {!isMobile && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Smartphone className="w-5 h-5 text-yellow-600" />
                                <span className="font-medium text-yellow-800">Mobile Device Recommended</span>
                            </div>
                            <p className="text-sm text-yellow-700">
                                PWA installation works best on mobile devices. For the best experience,
                                test this on a mobile device or use browser dev tools to simulate mobile.
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* PWA Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                PWA Requirements
                            </CardTitle>
                            <CardDescription>
                                Essential requirements for PWA installation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(pwaStatus.isHttps)}
                                    <span>HTTPS Connection</span>
                                </div>
                                {getStatusBadge(pwaStatus.isHttps)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(pwaStatus.hasManifest)}
                                    <span>Web App Manifest</span>
                                </div>
                                {getStatusBadge(pwaStatus.hasManifest)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(pwaStatus.hasServiceWorker)}
                                    <span>Service Worker</span>
                                </div>
                                {getStatusBadge(pwaStatus.hasServiceWorker)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(pwaStatus.canInstall)}
                                    <span>Install Prompt Available</span>
                                </div>
                                {getStatusBadge(pwaStatus.canInstall)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Installation Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Installation Status
                            </CardTitle>
                            <CardDescription>
                                Current PWA installation state
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(pwaStatus.isInstalled)}
                                    <span>PWA Installed</span>
                                </div>
                                {getStatusBadge(pwaStatus.isInstalled)}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(pwaStatus.isStandalone)}
                                    <span>Standalone Mode</span>
                                </div>
                                {getStatusBadge(pwaStatus.isStandalone)}
                            </div>

                            {pwaStatus.installPrompt && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium text-blue-800">Install Prompt Ready</span>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        The browser is ready to show the install prompt. Try visiting the main page to see the install button.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Troubleshooting Tips */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Troubleshooting Tips</CardTitle>
                        <CardDescription>
                            Common issues and solutions for PWA installation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!pwaStatus.isHttps && (
                            <div className="p-4 bg-red-50 rounded-lg">
                                <h4 className="font-medium text-red-800 mb-2">⚠️ HTTPS Required</h4>
                                <p className="text-sm text-red-700">
                                    PWAs require HTTPS to install. Make sure you're accessing the site via HTTPS.
                                </p>
                            </div>
                        )}

                        {!pwaStatus.hasManifest && (
                            <div className="p-4 bg-red-50 rounded-lg">
                                <h4 className="font-medium text-red-800 mb-2">⚠️ Manifest Not Found</h4>
                                <p className="text-sm text-red-700">
                                    The web app manifest is not accessible. Check if /manifest.json exists and is properly configured.
                                </p>
                            </div>
                        )}

                        {!pwaStatus.canInstall && (
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <h4 className="font-medium text-yellow-800 mb-2">ℹ️ Install Prompt Not Available</h4>
                                <p className="text-sm text-yellow-700">
                                    The install prompt may not be available if the PWA is already installed or doesn't meet all criteria.
                                </p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">📱 Mobile Installation</h4>
                            <p className="text-sm text-blue-700">
                                On mobile devices, look for the "Add to Home Screen" option in your browser's menu or the install prompt that appears.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 