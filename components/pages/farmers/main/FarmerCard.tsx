'use client';

import { motion } from 'framer-motion';
import { MapPin, Shield, Star, Users, Leaf } from 'lucide-react';
import Image from 'next/image';
import { VideoBackground } from '../../../ui/VideoBackground';
import { getCategoryNames } from '../../../../lib/category-helpers';
import { Farmer } from '../types';

interface FarmerCardProps {
    farmer: Farmer;
    onViewProducts?: (farmerId: string) => void;
    index: number;
}

export function FarmerCard({ farmer, onViewProducts, index }: FarmerCardProps) {
    const fullName = `${farmer.firstName} ${farmer.lastName}`;

    return (
        <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
        >
            {/* Video Background for Individual Farmer Card */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl">
                <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
            </div>

            <div className="relative bg-transparent backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 z-10">
                <div className="flex items-center mb-8">
                    <div className="relative w-20 h-20 mr-6">
                        <Image
                            src={farmer.profilePicture || '/assets/background_images/image4.jpg'}
                            alt={fullName}
                            fill
                            className="rounded-2xl object-cover"
                        />
                        {farmer.isOrganicCertified && (
                            <div className="absolute -top-2 -right-2 bg-green-500 p-1 rounded-full">
                                <Shield className="text-white" size={16} />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center mb-2">
                            <h3 className="text-2xl font-bold text-white">{fullName}</h3>
                        </div>
                        <div className="flex items-center text-gray-200 mb-2">
                            <MapPin size={16} />
                            <span className="ml-1">{farmer.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center">
                            <Star className="text-yellow-400 fill-current" size={16} />
                            <span className="ml-1 font-semibold text-white">{farmer.stats.averageRating}</span>
                            <span className="ml-2 text-sm text-gray-300">({farmer.stats.totalCustomers} customers)</span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-200 mb-6 leading-relaxed">{farmer.bio || 'No bio available'}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-sm text-gray-300 mb-1">Farm Size</div>
                        <div className="font-semibold text-white">{farmer.farmSize || 'Not specified'}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-sm text-gray-300 mb-1">Products</div>
                        <div className="font-semibold text-white">{farmer.stats.totalProducts}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-sm text-gray-300 mb-1">Experience</div>
                        <div className="font-semibold text-white">{farmer.experience || 'Not specified'}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-sm text-gray-300 mb-1">Customers</div>
                        <div className="font-semibold text-white">{farmer.stats.totalCustomers}</div>
                    </div>
                </div>

                {farmer.specialties && farmer.specialties.length > 0 && (
                    <div className="mb-6">
                        <div className="text-sm text-gray-300 mb-3">Specialties</div>
                        <div className="flex flex-wrap gap-2">
                            {getCategoryNames(farmer.specialties).map((categoryName, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-green-500/30 text-green-200 rounded-full text-sm font-medium backdrop-blur-sm"
                                >
                                    {categoryName}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {farmer.isOrganicCertified && (
                            <div className="flex items-center text-green-300">
                                <Leaf className="mr-1" size={16} />
                                <span className="text-sm font-medium">Organic Certified</span>
                            </div>
                        )}
                    </div>
                    <motion.button
                        onClick={() => onViewProducts?.(farmer.clerkUserId)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Users className="mr-2" size={16} />
                        View Products
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
} 