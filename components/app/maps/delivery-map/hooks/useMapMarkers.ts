// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { useEffect } from 'react';

interface Coordinates {
    lat: number;
    lng: number;
}

export function useMapMarkers(
    mapInstanceRef: React.MutableRefObject<any>,
    leafletLoaded: boolean,
    farmerCoords: Coordinates | null,
    customerCoords: Coordinates | null
) {
    // Helper function to validate coordinates
    const isValidCoordinates = (coords: any): coords is Coordinates => {
        return coords &&
            typeof coords.lat === 'number' &&
            typeof coords.lng === 'number' &&
            !isNaN(coords.lat) &&
            !isNaN(coords.lng) &&
            coords.lat >= -90 && coords.lat <= 90 &&
            coords.lng >= -180 && coords.lng <= 180;
    };

    // Update coordinates and map markers
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

        try {
            const map = mapInstanceRef.current;

            // Clear existing layers
            map.eachLayer((layer: any) => {
                if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
                    try {
                        map.removeLayer(layer);
                    } catch (error) {
                        console.error('Error removing layer:', error);
                    }
                }
            });

            // Create custom icon
            const createCustomIcon = (color: string) =>
                window.L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #000; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });

            // Add farmer marker
            if (isValidCoordinates(farmerCoords)) {
                try {
                    window.L.marker([farmerCoords.lat, farmerCoords.lng], {
                        icon: createCustomIcon('#10B981'),
                    })
                        .addTo(map)
                        .bindPopup('Farmer Location');
                } catch (error) {
                    console.error('Error adding farmer marker:', error);
                }
            }

            // Add customer marker
            if (isValidCoordinates(customerCoords)) {
                try {
                    window.L.marker([customerCoords.lat, customerCoords.lng], {
                        icon: createCustomIcon('#3B82F6'),
                    })
                        .addTo(map)
                        .bindPopup('Delivery Location');
                } catch (error) {
                    console.error('Error adding customer marker:', error);
                }
            }

            // Add polyline if both coordinates are valid
            if (isValidCoordinates(farmerCoords) && isValidCoordinates(customerCoords)) {
                try {
                    const polyline = window.L.polyline(
                        [
                            [farmerCoords.lat, farmerCoords.lng],
                            [customerCoords.lat, customerCoords.lng],
                        ],
                        {
                            color: '#EAB308',
                            weight: 4,
                            opacity: 0.8,
                        }
                    );

                    polyline.addTo(map);

                    // Fit bounds
                    const bounds = polyline.getBounds();
                    if (bounds) {
                        map.fitBounds(bounds, { padding: [20, 20] });
                    }
                } catch (error) {
                    console.error('Error creating polyline:', error);
                }
            } else {
                // Set center based on available coordinates
                if (isValidCoordinates(farmerCoords)) {
                    map.setView([farmerCoords.lat, farmerCoords.lng], 12);
                } else if (isValidCoordinates(customerCoords)) {
                    map.setView([customerCoords.lat, customerCoords.lng], 12);
                }
            }

        } catch (error) {
            console.error('Error updating map:', error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [farmerCoords, customerCoords]);
} 