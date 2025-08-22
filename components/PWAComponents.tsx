'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import PWA components with no SSR
const PWAInstaller = dynamic(() => import('./PWAInstaller').then(mod => ({ default: mod.PWAInstaller })), {
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
            <PWAInstaller />
        </>
    );
} 