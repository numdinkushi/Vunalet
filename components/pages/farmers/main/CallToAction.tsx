'use client';

import { motion } from 'framer-motion';

export function CallToAction() {
    return (
        <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Network</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Are you a South African farmer looking to connect directly with consumers?
                Join our platform and start selling your fresh produce today.
            </p>
            <motion.button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
            >
                Become a Farmer
            </motion.button>
        </motion.div>
    );
} 