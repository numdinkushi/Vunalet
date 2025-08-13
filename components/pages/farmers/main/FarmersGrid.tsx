'use client';

import { motion } from 'framer-motion';
import { FarmerCard } from './FarmerCard';
import { Farmer } from '../types';

interface FarmersGridProps {
    farmers: Farmer[];
    onViewProducts?: (farmerId: string) => void;
}

export function FarmersGrid({ farmers, onViewProducts }: FarmersGridProps) {
    if (!farmers || farmers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
            >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        No Farmers Available
                    </h3>
                    <p className="text-gray-300">
                        We&apos;re working on connecting with local farmers.
                        Check back soon for fresh produce from our community!
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {farmers.map((farmer, index) => (
                <FarmerCard
                    key={farmer.clerkUserId}
                    farmer={farmer}
                    onViewProducts={onViewProducts}
                    index={index}
                />
            ))}
        </div>
    );
} 