'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FarmerCard } from '../../../app/cards/farmer-card';
import { VideoBackground } from '../../../../components/ui/VideoBackground';
import { motion } from 'framer-motion';
import { Farmer } from '../types';

export function FarmersPageWithStats() {
    // Use the new query that includes all farmer statistics
    const farmersWithStats = useQuery(api.users.getFarmersWithStats);

    const handleViewProducts = (farmerId: string) => {
        // Navigate to farmer's products page
        window.location.href = `/products?farmer=${farmerId}`;
    };

    if (!farmersWithStats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
                <VideoBackground />
                <div className="relative z-10 container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                        <p className="text-white mt-4">Loading farmers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
            <VideoBackground />
            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-white mb-6">
                        Meet Our Farmers
                    </h1>
                    <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                        Discover local farmers committed to sustainable agriculture and providing fresh,
                        organic produce to our community.
                    </p>
                </motion.div>

                {/* Farmers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {farmersWithStats.map((farmer: Farmer, index: number) => (
                        <motion.div
                            key={farmer.clerkUserId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <FarmerCard
                                farmer={farmer}
                                onViewProducts={handleViewProducts}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {farmersWithStats.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="bg-black/50 rounded-lg p-8 max-w-md mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                No Farmers Available
                            </h3>
                            <p className="text-gray-300">
                                We&apos;re working on connecting with local farmers.
                                Check back soon for fresh produce from our community!
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Stats Summary */}
                {farmersWithStats.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
                    >
                        <div className="bg-black/50 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-white mb-2">
                                {farmersWithStats.length}
                            </div>
                            <div className="text-gray-300">Total Farmers</div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-white mb-2">
                                {farmersWithStats.reduce((sum: number, farmer: Farmer) => sum + farmer.stats.totalProducts, 0)}
                            </div>
                            <div className="text-gray-300">Total Products</div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-white mb-2">
                                {farmersWithStats.reduce((sum: number, farmer: Farmer) => sum + farmer.stats.totalCustomers, 0)}
                            </div>
                            <div className="text-gray-300">Happy Customers</div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-6 text-center">
                            <div className="text-3xl font-bold text-white mb-2">
                                {farmersWithStats.filter((f: Farmer) => f.isOrganicCertified).length}
                            </div>
                            <div className="text-gray-300">Organic Certified</div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
} 