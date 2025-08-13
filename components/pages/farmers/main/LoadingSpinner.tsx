'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner() {
    return (
        <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading verified farmers...</p>
        </motion.div>
    );
} 