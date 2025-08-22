'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Smartphone } from 'lucide-react';

export function PWADebug() {
    const [debugInfo, setDebugInfo] = useState({
        isClient: false,
        isMobile: false,
        hasBeforeInstallPrompt: false,
        hasDeferredPrompt: false,
        isStandalone: false,
        windowWidth: 0,
        userAgent: '',
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

            const updateDebugInfo = () => {
      setDebugInfo({
        isClient: true,
        isMobile: window.innerWidth <= 768,
        hasBeforeInstallPrompt: 'BeforeInstallPromptEvent' in window,
        hasDeferredPrompt: false, // We'll update this separately
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        windowWidth: window.innerWidth,
        userAgent: navigator.userAgent,
      });
    };

        updateDebugInfo();
        window.addEventListener('resize', updateDebugInfo);

        return () => window.removeEventListener('resize', updateDebugInfo);
    }, []);

    if (!debugInfo.isClient) return null;

    return (
        <div className="fixed top-4 left-4 z-50 max-w-sm">
            <Card className="bg-black/80 text-white border-gray-600">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        PWA Debug
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span>Client:</span>
                        <Badge variant={debugInfo.isClient ? "default" : "destructive"} className="text-xs">
                            {debugInfo.isClient ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Mobile:</span>
                        <Badge variant={debugInfo.isMobile ? "default" : "destructive"} className="text-xs">
                            {debugInfo.isMobile ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Install Prompt:</span>
                        <Badge variant={debugInfo.hasBeforeInstallPrompt ? "default" : "destructive"} className="text-xs">
                            {debugInfo.hasBeforeInstallPrompt ? "Available" : "Not Available"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Standalone:</span>
                        <Badge variant={debugInfo.isStandalone ? "default" : "destructive"} className="text-xs">
                            {debugInfo.isStandalone ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Width:</span>
                        <span className="text-gray-300">{debugInfo.windowWidth}px</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 