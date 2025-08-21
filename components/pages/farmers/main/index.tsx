'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FarmersGrid } from './FarmersGrid';
import { FarmersStats } from './FarmersStats';
import { CallToAction } from './CallToAction';
import { LoadingSpinner } from './LoadingSpinner';
import { Farmer } from '../types';

export function FarmersPage() {
    // Fetch real farmers data
    const realFarmers = useQuery(api.users.getFarmersWithStats);

    const handleViewProducts = (farmerId: string) => {
        // Navigate to farmer's products page
        window.location.href = `/products/farmer/${farmerId}`;
    };

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Farmers</h1>
                    <p className="text-xl text-gray-600">Meet the dedicated South African farmers bringing you fresh produce</p>
                </motion.div>

                {/* Loading State */}
                {realFarmers === undefined && <LoadingSpinner />}

                {/* Farmers Section */}
                {realFarmers && realFarmers.length > 0 && (
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <FarmersGrid
                            farmers={realFarmers as Farmer[]}
                            onViewProducts={handleViewProducts}
                        />
                        <FarmersStats farmers={realFarmers as Farmer[]} />
                    </motion.div>
                )}

                {/* Call to Action */}
                <CallToAction />
            </div>
        </div>
    );
} 