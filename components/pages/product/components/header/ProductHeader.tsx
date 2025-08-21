'use client';

import { motion } from 'framer-motion';

export function ProductHeader() {
    return (
        <motion.div
            className="mb-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-60"></div>
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Main content */}
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-block mb-6"
                >
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                        🌱 Fresh from the Farm
                    </div>
                </motion.div>

                <motion.h1
                    className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Fresh Products
                </motion.h1>

                <motion.p
                    className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Discover the freshest produce from South African farmers, delivered straight from the farm to your table
                </motion.p>

                <motion.div
                    className="flex justify-center items-center space-x-8 text-sm text-gray-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>100% Fresh</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Local Farmers</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        <span>Quality Assured</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
} 