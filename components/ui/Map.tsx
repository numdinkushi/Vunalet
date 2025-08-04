'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
    farmerLocation: string;
    customerAddress: string;
    className?: string;
}

export function Map({ farmerLocation, customerAddress, className = '' }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // In a real implementation, you would integrate with Google Maps API here
        // For now, we'll show a placeholder with location information
        if (mapRef.current) {
            // Simulate map loading
            console.log('Map would show route from', farmerLocation, 'to', customerAddress);
        }
    }, [farmerLocation, customerAddress]);

    return (
        <div className={`bg-black/30 rounded-lg p-4 border border-gray-600 ${className}`}>
            <div className="text-center text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Map showing delivery route from</p>
                <p className="font-semibold text-white">{farmerLocation}</p>
                <p>to</p>
                <p className="font-semibold text-white">{customerAddress}</p>
                <p className="text-sm mt-2">(Google Maps integration would be here)</p>
            </div>
        </div>
    );
} 