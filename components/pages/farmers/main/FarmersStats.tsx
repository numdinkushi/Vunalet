'use client';

import { motion } from 'framer-motion';
import { Farmer } from '../types';

interface FarmersStatsProps {
    farmers: Farmer[];
}

export function FarmersStats({ farmers }: FarmersStatsProps) {
    if (!farmers || farmers.length === 0) return null;

    const totalFarmers = farmers.length;
    const totalProducts = farmers.reduce((sum, farmer) => sum + farmer.stats.totalProducts, 0);
    const totalCustomers = farmers.reduce((sum, farmer) => sum + farmer.stats.totalCustomers, 0);
    const organicCertified = farmers.filter(f => f.isOrganicCertified).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalFarmers}
                </div>
                <div className="text-gray-600">Total Farmers</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalProducts}
                </div>
                <div className="text-gray-600">Total Products</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalCustomers}
                </div>
                <div className="text-gray-600">Happy Customers</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                    {organicCertified}
                </div>
                <div className="text-gray-600">Organic Certified</div>
            </div>
        </motion.div>
    );
} 