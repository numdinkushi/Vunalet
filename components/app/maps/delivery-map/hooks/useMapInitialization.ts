// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */


import { useEffect } from 'react';

export function useMapInitialization(
    mapRef: React.RefObject<HTMLDivElement>,
    mapInstanceRef: React.MutableRefObject<any>,
    leafletLoaded: boolean,
    setLeafletLoaded: (loaded: boolean) => void,
    mapCenter: [number, number],
    mapZoom: number
) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leafletLoaded, mapCenter, mapZoom]);
} 