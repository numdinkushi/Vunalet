// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Truck, Clock } from 'lucide-react';
import { getCityCoordinates, getAllCities } from '../../../../constants/south-africa-addresses';
import { MapContainer } from './MapContainer';
import { MapLegend } from './MapLegend';
import { RouteInfo } from './RouteInfo';
import { LocationDetails } from './LocationDetails';
import { RouteOptimization } from './RouteOptimization';
import { useMapCoordinates } from './hooks/useMapCoordinates';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapMarkers } from './hooks/useMapMarkers';

interface Coordinates {
    lat: number;
    lng: number;
}

interface DeliveryMapProps {
    farmerLocation: string;
    customerAddress: string;
    customerCoordinates?: { lat: number; lng: number; } | null;
    deliveryDistance?: number;
    deliveryCost?: number;
    className?: string;
}

export function DeliveryMap({
    farmerLocation,
    customerAddress,
    customerCoordinates,
    deliveryDistance = 0,
    deliveryCost = 0,
    className = ''
}: DeliveryMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);

    // Custom hooks
    const { farmerCoords, customerCoords, mapCenter, mapZoom } = useMapCoordinates(
        farmerLocation,
        customerAddress,
        customerCoordinates,
        deliveryDistance
    );

    useMapInitialization(mapRef, mapInstanceRef, leafletLoaded, setLeafletLoaded, mapCenter, mapZoom);
    useMapMarkers(mapInstanceRef, leafletLoaded, farmerCoords, customerCoords);

    return (
        <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 ${className}`}>
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Delivery Route</h3>
                <p className="text-gray-300 text-sm">Real-time delivery tracking and route optimization</p>
            </div>

            {/* Map Container */}
            <div className="relative h-96 rounded-2xl border border-white/20 overflow-hidden">
                <MapContainer
                    ref={mapRef}
                    farmerCoords={farmerCoords}
                    customerCoords={customerCoords}
                />

                <MapLegend
                    farmerCoords={farmerCoords}
                    customerCoords={customerCoords}
                    deliveryDistance={deliveryDistance}
                    deliveryCost={deliveryCost}
                />
            </div>

            <RouteInfo
                farmerCoords={farmerCoords}
                customerCoords={customerCoords}
                deliveryDistance={deliveryDistance}
                deliveryCost={deliveryCost}
            />

            <LocationDetails
                farmerLocation={farmerLocation}
                customerAddress={customerAddress}
            />

            <RouteOptimization />
        </div>
    );
} 