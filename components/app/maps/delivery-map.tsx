'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Truck, Clock } from 'lucide-react';

// Declare Leaflet types
declare global {
    interface Window {
        L: {
            map: (element: HTMLElement) => LeafletMap;
            tileLayer: (url: string, options: Record<string, unknown>) => LeafletTileLayer;
            marker: (coords: [number, number], options?: Record<string, unknown>) => LeafletMarker;
            polyline: (coords: [number, number][], options?: Record<string, unknown>) => LeafletPolyline;
            divIcon: (options: Record<string, unknown>) => LeafletDivIcon;
            Map: new (element: HTMLElement) => LeafletMap;
            Marker: new (coords: [number, number], options?: Record<string, unknown>) => LeafletMarker;
            Polyline: new (coords: [number, number][], options?: Record<string, unknown>) => LeafletPolyline;
        };
    }
}

interface LeafletMap {
    setView: (center: [number, number], zoom: number) => LeafletMap;
    eachLayer: (callback: (layer: LeafletLayer) => void) => void;
    removeLayer: (layer: LeafletLayer) => void;
    fitBounds: (bounds: unknown, options?: Record<string, unknown>) => void;
    remove: () => void;
}

interface LeafletTileLayer {
    addTo: (map: LeafletMap) => LeafletTileLayer;
}

interface LeafletMarker {
    addTo: (map: LeafletMap) => LeafletMarker;
    bindPopup: (content: string) => LeafletMarker;
}

interface LeafletPolyline {
    addTo: (map: LeafletMap) => LeafletPolyline;
    getBounds: () => unknown;
}

type LeafletDivIcon = Record<string, unknown>;

type LeafletLayer = unknown;

interface Coordinates {
    lat: number;
    lng: number;
}

interface DeliveryMapProps {
    farmerLocation: string;
    customerAddress: string;
    deliveryDistance?: number;
    deliveryCost?: number;
    className?: string;
}

interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style: React.CSSProperties;
    children: React.ReactNode;
}

interface MapMarkersProps {
    farmerCoords: Coordinates | null;
    customerCoords: Coordinates | null;
}

// Simulated React Leaflet Components
const MapContainer: React.FC<MapContainerProps> = ({ center, zoom, style, children }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);

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
            script.onload = () => {
                setLeafletLoaded(true);
                initMap();
            };
            document.head.appendChild(script);
        } else {
            setLeafletLoaded(true);
            initMap();
        }

        function initMap() {
            if (mapRef.current && window.L && !mapInstanceRef.current) {
                const map = window.L.map(mapRef.current).setView(center, zoom);
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                }).addTo(map);
                mapInstanceRef.current = map;
            }
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mapInstanceRef.current && leafletLoaded) {
            mapInstanceRef.current.setView(center, zoom);
        }
    }, [center, zoom, leafletLoaded]);

    useEffect(() => {
        if (mapInstanceRef.current && leafletLoaded && window.L && children && (children as React.ReactElement<MapMarkersProps>).props) {
            const map = mapInstanceRef.current;
            const { farmerCoords, customerCoords } = (children as React.ReactElement<MapMarkersProps>).props;

            // Clear existing markers and polylines
            map.eachLayer((layer: LeafletLayer) => {
                if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
                    map.removeLayer(layer);
                }
            });

            const createCustomIcon = (color: string) =>
                window.L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #000; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });

            // Add farmer location marker
            if (farmerCoords) {
                window.L.marker([farmerCoords.lat, farmerCoords.lng], {
                    icon: createCustomIcon('#10B981'),
                })
                    .addTo(map)
                    .bindPopup('Farmer Location');
            }

            // Add customer location marker
            if (customerCoords) {
                window.L.marker([customerCoords.lat, customerCoords.lng], {
                    icon: createCustomIcon('#3B82F6'),
                })
                    .addTo(map)
                    .bindPopup('Delivery Location');
            }

            // Add route polyline
            if (farmerCoords && customerCoords) {
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

                    if (polyline && polyline?.addTo) {
                        polyline?.addTo(map);
                        if (polyline?.getBounds) {
                            map?.fitBounds(polyline.getBounds(), { padding: [20, 20] });
                        }
                    }
                } catch (error) {
                    console.error('Error creating polyline:', error);
                }
            }
        }
    }, [children, leafletLoaded]);

    return (
        <div style={{ position: 'relative', ...style }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            {!leafletLoaded && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#10B981',
                    fontSize: '16px',
                    zIndex: 1000
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #10B981',
                            borderTop: '4px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 10px'
                        }}></div>
                        Loading Map...
                    </div>
                </div>
            )}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const MapMarkers: React.FC<MapMarkersProps> = ({ farmerCoords, customerCoords }) => {
    return null;
};

export function DeliveryMap({
    farmerLocation,
    customerAddress,
    deliveryDistance = 0,
    deliveryCost = 0,
    className = ''
}: DeliveryMapProps) {
    const [farmerCoords, setFarmerCoords] = useState<Coordinates | null>(null);
    const [customerCoords, setCustomerCoords] = useState<Coordinates | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([-33.9249, 18.4241]); // Cape Town coordinates (better default for SA)
    const [mapZoom, setMapZoom] = useState<number>(12);

    // Calculate ETA based on distance
    const calculateETA = (distance: number) => {
        const avgSpeed = 40; // km/h
        const timeInHours = distance / avgSpeed;
        const timeInMinutes = Math.round(timeInHours * 60);
        return Math.max(15, timeInMinutes); // Minimum 15 minutes
    };

    const eta = calculateETA(deliveryDistance);

    // Geocoding function
    const geocodeLocation = async (address: string): Promise<Coordinates | null> => {
        // Fallback coordinates for common South African locations
        const fallbackCoords: { [key: string]: Coordinates; } = {
            'stellenbosch': { lat: -33.9321, lng: 18.8602 },
            'paarl': { lat: -33.7312, lng: 18.9754 },
            'robertson': { lat: -33.8034, lng: 19.8854 },
            'ceres': { lat: -33.3689, lng: 19.3100 },
            'wellington': { lat: -33.6400, lng: 19.0100 },
            'somerset west': { lat: -34.0833, lng: 18.8500 },
            'citrusdal': { lat: -32.5833, lng: 19.0167 },
            'elgin': { lat: -34.1500, lng: 19.0333 },
            'western cape': { lat: -33.9249, lng: 18.4241 }, // Cape Town
            'free state': { lat: -28.2278, lng: 28.4097 }, // Bloemfontein
            'kwaZulu-Natal': { lat: -29.8587, lng: 31.0218 }, // Durban
            'eastern cape': { lat: -33.7139, lng: 25.5207 }, // Port Elizabeth
            'mpumalanga': { lat: -25.4753, lng: 30.9694 }, // Nelspruit
            'northern cape': { lat: -28.7282, lng: 24.7499 }, // Kimberley
            'limpopo': { lat: -23.9045, lng: 29.4688 }, // Polokwane
        };

        // First, try to match with fallback coordinates
        const addressLower = address.toLowerCase();
        for (const [location, coords] of Object.entries(fallbackCoords)) {
            if (addressLower.includes(location)) {
                console.log(`Using fallback coordinates for ${location}`);
                return coords;
            }
        }

        // If no fallback match, try external API
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=za`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'VunaletApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                console.log('HTTP error! status: ', response.status);
                // throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                };
            }
        } catch (error) {
            console.error('Geocoding API error:', error);
        }

        // If no fallback found and API failed, return Cape Town coordinates
        console.log('No coordinates found, using Cape Town as default');
        return { lat: -33.9249, lng: 18.4241 };
    };

    // Update coordinates when locations change
    useEffect(() => {
        const updateCoordinates = async () => {
            let newFarmerCoords = null;
            let newCustomerCoords = null;

            // Geocode farmer location first
            if (farmerLocation) {
                newFarmerCoords = await geocodeLocation(farmerLocation);
                setFarmerCoords(newFarmerCoords);
            }

            // Geocode customer address
            if (customerAddress) {
                newCustomerCoords = await geocodeLocation(customerAddress);
                setCustomerCoords(newCustomerCoords);
            }

            // Update map center and zoom based on coordinates
            if (newFarmerCoords && newCustomerCoords) {
                // Both locations available - center between them
                const centerLat = (newFarmerCoords.lat + newCustomerCoords.lat) / 2;
                const centerLng = (newFarmerCoords.lng + newCustomerCoords.lng) / 2;
                setMapCenter([centerLat, centerLng]);
                setMapZoom(deliveryDistance < 5 ? 13 : deliveryDistance < 20 ? 11 : deliveryDistance < 50 ? 9 : 8);
            } else if (newFarmerCoords) {
                // Only farmer location available - center on farmer
                setMapCenter([newFarmerCoords.lat, newFarmerCoords.lng]);
                setMapZoom(12);
            } else if (newCustomerCoords) {
                // Only customer location available - center on customer
                setMapCenter([newCustomerCoords.lat, newCustomerCoords.lng]);
                setMapZoom(12);
            }
        };

        updateCoordinates();
    }, [farmerLocation, customerAddress, deliveryDistance]);

    return (
        <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 ${className}`}>
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Delivery Route</h3>
                <p className="text-gray-300 text-sm">Real-time delivery tracking and route optimization</p>
            </div>

            {/* Map Container */}
            <div className="relative h-96 rounded-2xl border border-white/20 overflow-hidden">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                    <MapMarkers farmerCoords={farmerCoords} customerCoords={customerCoords} />
                </MapContainer>

                {/* Map Legend - Only show when coordinates are available */}
                {(farmerCoords || customerCoords) && (
                    <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg text-sm max-w-xs z-[1000] shadow-lg">
                        {farmerCoords && (
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-xs">Farmer Location</span>
                            </div>
                        )}
                        {customerCoords && (
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

            {/* Route Info - Moved outside map container */}
            {(farmerCoords || customerCoords) && (
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