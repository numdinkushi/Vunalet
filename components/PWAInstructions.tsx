'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Share2, Plus, X } from 'lucide-react';

export function PWAInstructions() {
    const [showInstructions, setShowInstructions] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        setIsClient(true);

        if (typeof window === 'undefined') return;

        // Check if PWA is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Show instructions after a longer delay if not installed
        const timer = setTimeout(() => {
            if (!isInstalled) {
                setShowInstructions(true);
            }
        }, 10000); // Show after 10 seconds

        return () => clearTimeout(timer);
    }, [isInstalled]);

    if (!isClient || isInstalled || !showInstructions) return null;

    // Only show on mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:w-80">
            <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            <CardTitle className="text-lg">Install Vunalet</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowInstructions(false)}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        Add Vunalet to your home screen for quick access
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-sm text-gray-700 space-y-2">
                        <div className="flex items-start space-x-2">
                            <Share2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Tap the <strong>Share</strong> button in your browser</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <Plus className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Select <strong>&quot;Add to Home Screen&quot;</strong></span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <Smartphone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Tap <strong>&quot;Add&quot;</strong> to install</span>
                        </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                        <Button
                            onClick={() => setShowInstructions(false)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            Got it!
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="flex-1"
                        >
                            Refresh Page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 