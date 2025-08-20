// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Truck, Clock } from 'lucide-react';
import { getCityCoordinates, getAllCities } from '../../../constants/south-africa-addresses';

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

// Helper function to extract city name from location string
const extractCityFromLocation = (location: string): string | null => {
    if (!location) return null;

    // Get all cities from constants
    const allCities = getAllCities();

    const locationLower = location.toLowerCase();
    for (const city of allCities) {
        if (locationLower.includes(city.name.toLowerCase())) {
            return city.name;
        }
    }
    return null;
};

export function DeliveryMap({
    farmerLocation,
    customerAddress,
    customerCoordinates,
    deliveryDistance = 0,
    deliveryCost = 0,
    className = ''
}: DeliveryMapProps) {
    const [farmerCoords, setFarmerCoords] = useState<Coordinates | null>(null);
    const [customerCoords, setCustomerCoords] = useState<Coordinates | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([-33.9249, 18.4241]); // Cape Town
    const [mapZoom, setMapZoom] = useState<number>(12);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);

    // Calculate ETA based on distance
    const calculateETA = (distance: number) => {
        const avgSpeed = 40; // km/h
        const timeInHours = distance / avgSpeed;
        const timeInMinutes = Math.round(timeInHours * 60);
        return Math.max(15, timeInMinutes); // Minimum 15 minutes
    };

    const eta = calculateETA(deliveryDistance);

    // Get coordinates from constants or database
    const getCoordinates = (location: string, dbCoordinates?: Coordinates | null): Coordinates | null => {
        // First, use database coordinates if available and valid
        if (isValidCoordinates(dbCoordinates)) {
            return dbCoordinates;
        }

        // Then try to extract city from location and get coordinates from constants
        const cityName = extractCityFromLocation(location);
        if (cityName) {
            const coords = getCityCoordinates(cityName);
            if (coords) {
                return coords;
            }
        }

        // Fallback to Cape Town if nothing found
        return { lat: -33.9249, lng: 18.4241 };
    };

    // Load Leaflet
    useEffect(() => {
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        if (!window.L) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => setLeafletLoaded(true);
            document.head.appendChild(script);
        } else {
            setLeafletLoaded(true);
        }
    }, []);

    // Initialize map only once
    useEffect(() => {
        if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

        try {
            const map = window.L.map(mapRef.current).setView(mapCenter, mapZoom);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);
            mapInstanceRef.current = map;
        } catch (error) {
            console.error('Error initializing map:', error);
        }

        return () => {
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch (error) {
                    console.error('Error removing map:', error);
                }
                mapInstanceRef.current = null;
            }
        };
    }, [leafletLoaded, mapCenter, mapZoom]);

    // Update coordinates and map markers
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

        try {
            // Get coordinates
            const newFarmerCoords = getCoordinates(farmerLocation);
            const newCustomerCoords = getCoordinates(customerAddress, customerCoordinates);

            setFarmerCoords(newFarmerCoords);
            setCustomerCoords(newCustomerCoords);

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
            if (isValidCoordinates(newFarmerCoords)) {
                try {
                    window.L.marker([newFarmerCoords.lat, newFarmerCoords.lng], {
                        icon: createCustomIcon('#10B981'),
                    })
                        .addTo(map)
                        .bindPopup('Farmer Location');
                } catch (error) {
                    console.error('Error adding farmer marker:', error);
                }
            }

            // Add customer marker
            if (isValidCoordinates(newCustomerCoords)) {
                try {
                    window.L.marker([newCustomerCoords.lat, newCustomerCoords.lng], {
                        icon: createCustomIcon('#3B82F6'),
                    })
                        .addTo(map)
                        .bindPopup('Delivery Location');
                } catch (error) {
                    console.error('Error adding customer marker:', error);
                }
            }

            // Add polyline if both coordinates are valid
            if (isValidCoordinates(newFarmerCoords) && isValidCoordinates(newCustomerCoords)) {
                try {
                    const polyline = window.L.polyline(
                        [
                            [newFarmerCoords.lat, newFarmerCoords.lng],
                            [newCustomerCoords.lat, newCustomerCoords.lng],
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
                if (isValidCoordinates(newFarmerCoords)) {
                    map.setView([newFarmerCoords.lat, newFarmerCoords.lng], 12);
                } else if (isValidCoordinates(newCustomerCoords)) {
                    map.setView([newCustomerCoords.lat, newCustomerCoords.lng], 12);
                }
            }

        } catch (error) {
            console.error('Error updating map:', error);
        }
    }, [farmerLocation, customerAddress, customerCoordinates, deliveryDistance]);

    return (
        <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 ${className}`}>
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Delivery Route</h3>
                <p className="text-gray-300 text-sm">Real-time delivery tracking and route optimization</p>
            </div>

            {/* Map Container */}
            <div className="relative h-96 rounded-2xl border border-white/20 overflow-hidden">
                <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

                {/* Map Legend */}
                {(isValidCoordinates(farmerCoords) || isValidCoordinates(customerCoords)) && (
                    <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg text-sm max-w-xs z-[1000] shadow-lg">
                        {isValidCoordinates(farmerCoords) && (
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-xs">Farmer Location</span>
                            </div>
                        )}
                        {isValidCoordinates(customerCoords) && (
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span className="text-xs">Delivery Location</span>
                            </div>
                        )}
                        {deliveryDistance > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/30">
                                <div className="flex items-center space-x-2">
                                    <Navigation className="w-3 h-3" />
                                    <span className="text-xs font-semibold">{deliveryDistance}km - R{deliveryCost.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Route Info */}
            {(isValidCoordinates(farmerCoords) || isValidCoordinates(customerCoords)) && (
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
            )}

            {/* Location Details */}
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

            {/* Route Optimization Info */}
            <div className="mt-6 bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                <h4 className="text-green-300 font-semibold mb-2">Route Optimization</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-300">Traffic Status</p>
                        <p className="text-green-400 font-semibold">Light Traffic</p>
                    </div>
                    <div>
                        <p className="text-gray-300">Weather</p>
                        <p className="text-blue-400 font-semibold">Clear</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 