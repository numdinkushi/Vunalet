'use client';

import { useState, useEffect } from 'react';
import { DeliveryMap } from './DeliveryMap';


interface ClientOnlyDeliveryMapProps {
    farmerLocation: string;
    customerAddress: string;
    customerCoordinates?: { lat: number; lng: number; } | null;
    deliveryDistance?: number;
    deliveryCost?: number;
    className?: string;
}

export function ClientOnlyDeliveryMap(props: ClientOnlyDeliveryMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 ${props.className || ''}`}>
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Delivery Route</h3>
                    <p className="text-gray-300 text-sm">Loading map...</p>
                </div>
                <div className="relative h-96 rounded-2xl border border-white/20 overflow-hidden flex items-center justify-center">
                    <div className="text-white">Loading delivery map...</div>
                </div>
            </div>
        );
    }

    return <DeliveryMap {...props} />;
} 