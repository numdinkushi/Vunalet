// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
 

'use client';

import { Navigation } from 'lucide-react';

interface MapLegendProps {
    farmerCoords: any;
    customerCoords: any;
    deliveryDistance: number;
    deliveryCost: number;
}

export function MapLegend({
    farmerCoords,
    customerCoords,
    deliveryDistance,
    deliveryCost
}: MapLegendProps) {
    const hasValidCoords = (coords: any) =>
        coords && typeof coords.lat === 'number' && typeof coords.lng === 'number';

    if (!hasValidCoords(farmerCoords) && !hasValidCoords(customerCoords)) {
        return null;
    }

    return (
        <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg text-sm max-w-xs z-[1000] shadow-lg">
            {hasValidCoords(farmerCoords) && (
                <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-xs">Farmer Location</span>
                </div>
            )}
            {hasValidCoords(customerCoords) && (
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-xs">Delivery Location</span>
                </div>
            )}
            {deliveryDistance > 0 && (
                <div className="mt-2 pt-2 border-t border-white/30">
                    <div className="flex items-center space-x-2">
                        <Navigation className="w-3 h-3" />
                        <span className="text-xs font-semibold">
                            {deliveryDistance}km - R{deliveryCost.toFixed(2)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
} 