// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
 

'use client';

import { Navigation, Truck, Clock } from 'lucide-react';

interface RouteInfoProps {
    farmerCoords: any;
    customerCoords: any;
    deliveryDistance: number;
    deliveryCost: number;
}

export function RouteInfo({
    farmerCoords,
    customerCoords,
    deliveryDistance,
    deliveryCost
}: RouteInfoProps) {
    const hasValidCoords = (coords: any) =>
        coords && typeof coords.lat === 'number' && typeof coords.lng === 'number';

    const calculateETA = (distance: number) => {
        const avgSpeed = 40; // km/h
        const timeInHours = distance / avgSpeed;
        const timeInMinutes = Math.round(timeInHours * 60);
        return Math.max(15, timeInMinutes); // Minimum 15 minutes
    };

    const eta = calculateETA(deliveryDistance);

    if (!hasValidCoords(farmerCoords) && !hasValidCoords(customerCoords)) {
        return null;
    }

    return (
        <div className="mt-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <Navigation className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-300">Distance</p>
                    <p className="text-sm font-bold text-white">{deliveryDistance || 0} km</p>
                </div>
                <div>
                    <Truck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-300">Delivery</p>
                    <p className="text-sm font-bold text-white">R{(deliveryCost || 0).toFixed(2)}</p>
                </div>
                <div>
                    <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-300">ETA</p>
                    <p className="text-sm font-bold text-white">~{eta} min</p>
                </div>
            </div>
        </div>
    );
} 