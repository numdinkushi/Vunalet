// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { MapPin } from 'lucide-react';

interface LocationDetailsProps {
    farmerLocation: string;
    customerAddress: string;
}

export function LocationDetails({ farmerLocation, customerAddress }: LocationDetailsProps) {
    return (
        <div className="mt-6 space-y-4">
            <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
                <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Pickup Location
                </h4>
                <p className="text-white text-sm">{farmerLocation}</p>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
                <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Delivery Location
                </h4>
                <p className="text-white text-sm">{customerAddress || 'Enter your address above'}</p>
            </div>
        </div>
    );
} 