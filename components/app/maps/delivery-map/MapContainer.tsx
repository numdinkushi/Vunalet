// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { forwardRef } from 'react';

interface MapContainerProps {
    farmerCoords: any;
    customerCoords: any;
}

export const MapContainer = forwardRef<HTMLDivElement, MapContainerProps>(
    ({ farmerCoords, customerCoords }, ref) => {
        return (
            <div ref={ref} style={{ height: '100%', width: '100%' }} />
        );
    }
);

MapContainer.displayName = 'MapContainer'; 