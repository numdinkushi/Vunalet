'use client';

import { useState, useEffect } from 'react';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { SOUTH_AFRICAN_PROVINCES, getCitiesByProvince, getCityCoordinates } from '../../constants/south-africa-addresses';

export interface SouthAfricanAddressData {
    province: string;
    city: string;
    streetAddress: string;
    postalCode: string;
    coordinates: { lat: number; lng: number; } | null;
    fullAddress: string;
}

interface SouthAfricanAddressProps {
    value: SouthAfricanAddressData;
    onChange: (value: SouthAfricanAddressData) => void;
    label?: string;
    className?: string;
}

export function SouthAfricanAddress({ value, onChange, label, className }: SouthAfricanAddressProps) {
    const handleAddressChange = (field: keyof SouthAfricanAddressData, newValue: string | { lat: number; lng: number; } | null) => {
        const updatedValue = { ...value, [field]: newValue };
        onChange(updatedValue);
    };

    // Update coordinates when city or province changes
    useEffect(() => {
        if (value.city && value.province) {
            const coordinates = getCityCoordinates(value.city, value.province);
            if (coordinates) {
                handleAddressChange('coordinates', coordinates);
            }
        }
    }, [value.city, value.province]);

    // Update full address when any field changes
    useEffect(() => {
        const fullAddress = [value.streetAddress, value.city, value.province, value.postalCode]
            .filter(Boolean)
            .join(', ');
        handleAddressChange('fullAddress', fullAddress);
    }, [value.streetAddress, value.city, value.province, value.postalCode]);

    // Update full address when coordinates change
    useEffect(() => {
        if (value.coordinates) {
            const fullAddress = [value.streetAddress, value.city, value.province, value.postalCode]
                .filter(Boolean)
                .join(', ');
            handleAddressChange('fullAddress', fullAddress);
        }
    }, [value.coordinates]);

    return (
        <div className={`space-y-4 ${className}`}>
            <Label className="text-sm font-medium text-gray-700">
                {label} {value.required && '*'}
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province Selection */}
                <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                        Province *
                    </Label>
                    <Select
                        value={value.province}
                        onValueChange={(province) => handleAddressChange('province', province)}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                            {SOUTH_AFRICAN_PROVINCES.map((province) => (
                                <SelectItem key={province.code} value={province.name}>
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* City Selection */}
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City *
                    </Label>
                    <Select
                        value={value.city}
                        onValueChange={(city) => handleAddressChange('city', city)}
                        disabled={!value.province}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder={value.province ? "Select city" : "Select province first"} />
                        </SelectTrigger>
                        <SelectContent>
                            {availableCities.map((city) => (
                                <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Street Address */}
            <div className="space-y-2">
                <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
                    Street Address *
                </Label>
                <Input
                    id="streetAddress"
                    value={value.streetAddress}
                    onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                    placeholder="e.g., 123 Main Street, Apartment 4B"
                    className="h-11"
                    required={value.required}
                />
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                    Postal Code
                </Label>
                <Input
                    id="postalCode"
                    value={value.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    placeholder="e.g., 2000"
                    className="h-11"
                />
            </div>

            {/* Display Coordinates (read-only) */}
            {value.coordinates && (
                <div className="p-3 bg-gray-50 rounded-md">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Location Coordinates
                    </Label>
                    <div className="text-sm text-gray-600">
                        Latitude: {value.coordinates.lat.toFixed(6)},
                        Longitude: {value.coordinates.lng.toFixed(6)}
                    </div>
                </div>
            )}

            {/* Display Full Address (read-only) */}
            {value.fullAddress && (
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Complete Address
                    </Label>
                    <div className="text-sm text-gray-800">
                        {value.fullAddress}
                    </div>
                </div>
            )}
        </div>
    );
} 