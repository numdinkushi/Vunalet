'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import PWA components with no SSR
const PWAInstaller = dynamic(() => import('./PWAInstaller').then(mod => ({ default: mod.PWAInstaller })), {
    ssr: false,
    loading: () => null,
});

const NotificationPermission = dynamic(() => import('./NotificationPermission').then(mod => ({ default: mod.NotificationPermission })), {
    ssr: false,
    loading: () => null,
});

const ManualPWAInstall = dynamic(() => import('./ManualPWAInstall').then(mod => ({ default: mod.ManualPWAInstall })), {
    ssr: false,
    loading: () => null,
});

const PWADebug = dynamic(() => import('./PWADebug').then(mod => ({ default: mod.PWADebug })), {
    ssr: false,
    loading: () => null,
});

export function PWAComponents() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <>
            <ManualPWAInstall />
            <PWAInstaller />
            <NotificationPermission />
            <PWADebug />
        </>
    );
} 