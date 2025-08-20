// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { useState, useEffect } from 'react';
import { getCityCoordinates, getAllCities } from '../../../../../constants/south-africa-addresses';

interface Coordinates {
    lat: number;
    lng: number;
}

export function useMapCoordinates(
    farmerLocation: string,
    customerAddress: string,
    customerCoordinates?: { lat: number; lng: number } | null,
    deliveryDistance?: number
) {
    const [farmerCoords, setFarmerCoords] = useState<Coordinates | null>(null);
    const [customerCoords, setCustomerCoords] = useState<Coordinates | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([-33.9249, 18.4241]); // Cape Town
    const [mapZoom, setMapZoom] = useState<number>(12);

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
        
        const allCities = getAllCities();
        const locationLower = location.toLowerCase();
        for (const city of allCities) {
            if (locationLower.includes(city.name.toLowerCase())) {
                return city.name;
            }
        }
        return null;
    };

    // Get coordinates from constants or database
    const getCoordinates = (location: string, dbCoordinates?: Coordinates | null): Coordinates | null => {
        if (isValidCoordinates(dbCoordinates)) {
            return dbCoordinates;
        }

        const cityName = extractCityFromLocation(location);
        if (cityName) {
            const coords = getCityCoordinates(cityName);
            if (coords) {
                return coords;
            }
        }

        return { lat: -33.9249, lng: 18.4241 };
    };

    // Update coordinates when locations change
    useEffect(() => {
        const newFarmerCoords = getCoordinates(farmerLocation);
        const newCustomerCoords = getCoordinates(customerAddress, customerCoordinates);

        setFarmerCoords(newFarmerCoords);
        setCustomerCoords(newCustomerCoords);

        // Update map center and zoom based on coordinates
        if (isValidCoordinates(newFarmerCoords) && isValidCoordinates(newCustomerCoords)) {
            const centerLat = (newFarmerCoords.lat + newCustomerCoords.lat) / 2;
            const centerLng = (newFarmerCoords.lng + newCustomerCoords.lng) / 2;
            setMapCenter([centerLat, centerLng]);
            setMapZoom(deliveryDistance && deliveryDistance < 5 ? 13 : deliveryDistance && deliveryDistance < 20 ? 11 : deliveryDistance && deliveryDistance < 50 ? 9 : 8);
        } else if (isValidCoordinates(newFarmerCoords)) {
            setMapCenter([newFarmerCoords.lat, newFarmerCoords.lng]);
            setMapZoom(12);
        } else if (isValidCoordinates(newCustomerCoords)) {
            setMapCenter([newCustomerCoords.lat, newCustomerCoords.lng]);
            setMapZoom(12);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [farmerLocation, customerAddress, customerCoordinates, deliveryDistance]);

    return { farmerCoords, customerCoords, mapCenter, mapZoom };
} 