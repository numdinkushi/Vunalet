'use client';

import { MapPin, Shield, Star, Users, Leaf, Package, Clock } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { getCategoryNames } from '../../../lib/category-helpers';

interface FarmerStats {
    totalProducts: number;
    totalCustomers: number;
    averageRating: number;
    totalRatings: number;
}

interface FarmerCardProps {
    farmer: {
        clerkUserId: string;
        firstName: string;
        lastName: string;
        location?: string;
        bio?: string;
        farmSize?: string;
        experience?: string;
        specialties?: string[];
        isOrganicCertified?: boolean;
        profilePicture?: string;
        stats: FarmerStats;
    };
    onViewProducts?: (farmerId: string) => void;
}

export function FarmerCard({ farmer, onViewProducts }: FarmerCardProps) {
    const fullName = `${farmer.firstName} ${farmer.lastName}`;
    const rating = farmer.stats.averageRating;
    const customerCount = farmer.stats.totalCustomers;
    const productCount = farmer.stats.totalProducts;

    return (
        <Card className="bg-black text-white border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-6">
                {/* Profile Header */}
                <div className="flex items-start mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                            {farmer.profilePicture ? (
                                <Image
                                    src={farmer.profilePicture}
                                    alt={fullName}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Users size={24} />
                                </div>
                            )}
                        </div>
                        {farmer.isOrganicCertified && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                <Leaf size={12} className="text-white" />
                            </div>
                        )}
                    </div>

                    <div className="ml-4 flex-1">
                        <div className="flex items-center mb-2">
                            <h3 className="text-2xl font-bold text-white">{fullName}</h3>
                            {farmer.isOrganicCertified && (
                                <Shield className="ml-2 text-green-500" size={16} />
                            )}
                        </div>

                        {farmer.location && (
                            <div className="flex items-center text-gray-200 mb-2">
                                <MapPin size={16} />
                                <span className="ml-1">{farmer.location}</span>
                            </div>
                        )}

                        <div className="flex items-center">
                            <Star className="text-yellow-400 fill-current" size={16} />
                            <span className="ml-1 font-semibold text-white">{rating}</span>
                            <span className="ml-2 text-sm text-gray-300">
                                ({customerCount} customers)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {farmer.bio && (
                    <p className="text-gray-200 mb-6 leading-relaxed">{farmer.bio}</p>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Farm Size</div>
                        <div className="text-lg font-semibold text-white">
                            {farmer.farmSize || 'Not specified'}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Products</div>
                        <div className="text-lg font-semibold text-white">{productCount}</div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Experience</div>
                        <div className="text-lg font-semibold text-white">
                            {farmer.experience || 'Not specified'}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">Customers</div>
                        <div className="text-lg font-semibold text-white">{customerCount}</div>
                    </div>
                </div>

                {/* Specialties */}
                {farmer.specialties && farmer.specialties.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                            {getCategoryNames(farmer.specialties).map((categoryName, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-green-600 text-white hover:bg-green-700"
                                >
                                    {categoryName}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {farmer.isOrganicCertified && (
                            <>
                                <Leaf className="text-green-500 mr-2" size={16} />
                                <span className="text-green-500 text-sm font-medium">
                                    Organic Certified
                                </span>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={() => onViewProducts?.(farmer.clerkUserId)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Package className="mr-2" size={16} />
                        View Products
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 