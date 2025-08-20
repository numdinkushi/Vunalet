'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, Leaf, Zap } from 'lucide-react';
import Image from 'next/image';
import { VideoBackground } from '../../components/ui/VideoBackground';

const features = [
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Direct Connection",
        description: "Connect directly with South African farmers, eliminating middlemen and ensuring fair prices for both farmers and consumers",
        image: '/assets/background_images/image4.jpg',
        color: 'from-green-500 to-green-600'
    },
    {
        icon: <Truck className="w-8 h-8" />,
        title: "Quality Assured",
        description: "Every product is carefully selected and quality-tested, with organic certification and freshness guarantees",
        image: '/assets/background_images/image5.jpg',
        color: 'from-blue-500 to-blue-600'
    },
    {
        icon: <Leaf className="w-8 h-8" />,
        title: "Fresh Delivery",
        description: "Farm-to-table delivery across South Africa, ensuring maximum freshness and supporting local communities",
        image: '/assets/background_images/image6.jpg',
        color: 'from-orange-500 to-orange-600'
    }
];

const stats = [
    {
        number: "500+",
        label: "Active Farmers",
        description: "Registered farmers across South Africa",
        icon: <Leaf className="w-6 h-6" />,
        color: "from-emerald-500 to-green-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        neonColor: "emerald",
        neonRGB: "34, 197, 94"
    },
    {
        number: "10K+",
        label: "Happy Customers",
        description: "Satisfied consumers nationwide",
        icon: <Zap className="w-6 h-6" />,
        color: "from-rose-500 to-pink-600",
        bgColor: "bg-rose-50",
        textColor: "text-rose-700",
        neonColor: "rose",
        neonRGB: "244, 63, 94"
    },
    {
        number: "50+",
        label: "Cities Served",
        description: "Major cities and towns covered",
        icon: <Zap className="w-6 h-6" />,
        color: "from-blue-500 to-indigo-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        neonColor: "blue",
        neonRGB: "59, 130, 246"
    },
    {
        number: "99%",
        label: "Fresh Guarantee",
        description: "Quality assurance rate",
        icon: <Zap className="w-6 h-6" />,
        color: "from-amber-500 to-yellow-600",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        neonColor: "amber",
        neonRGB: "245, 158, 11"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose Vunalet?</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Experience the future of farm-to-consumer commerce with our innovative platform designed for South Africa
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-8">
                                <motion.div
                                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {feature.icon}
                                </motion.div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                                <motion.div
                                    className="mt-6 flex items-center text-green-600 font-semibold"
                                    whileHover={{ x: 5 }}
                                >
                                    Learn More
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Sleek Stats Section with Video Background */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Video Background for Stats Section */}
                    <div className="absolute inset-0 pointer-events-none z-0 ">
                        <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" styles='rounded-3xl' />
                    </div>
                    <div className="absolute inset-0 bg-green-500/20 rounded-3xl" />

                    <div className="relative bg-transparent rounded-3xl p-12 shadow-lg ">
                        <div className="text-center mb-16">
                            <motion.h3
                                className="text-4xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                Our Impact in Numbers
                            </motion.h3>
                            <motion.p
                                className="text-xl text-gray-200 max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                See how we&apos;ve revolutionized agriculture across South Africa
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="relative group"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    whileHover={{ y: -5, scale: 1.05 }}
                                >
                                    {/* Card Background */}
                                    <div className={`absolute inset-0 ${stat.bgColor} rounded-2xl transform transition-transform duration-300 group-hover:scale-105`}></div>

                                    {/* Enhanced hover glow effect */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                        style={{
                                            background: `radial-gradient(circle at center, rgba(${stat.neonRGB}, 0.6) 0%, transparent 70%)`,
                                            filter: 'blur(15px)',
                                            boxShadow: `0 0 30px rgba(${stat.neonRGB}, 0.8), inset 0 0 30px rgba(${stat.neonRGB}, 0.3)`
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="relative p-6 text-center">
                                        <motion.div
                                            className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            style={{
                                                boxShadow: `0 0 20px rgba(${stat.neonRGB}, 0.5), inset 0 0 20px rgba(${stat.neonRGB}, 0.2)`
                                            }}
                                        >
                                            {stat.icon}
                                        </motion.div>

                                        <motion.div
                                            className={`text-3xl lg:text-4xl font-bold ${stat.textColor} mb-2 group-hover:scale-105 transition-transform duration-300`}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                                            style={{
                                                textShadow: `0 0 10px rgba(${stat.neonRGB}, 0.6), 0 0 20px rgba(${stat.neonRGB}, 0.4)`
                                            }}
                                        >
                                            {stat.number}
                                        </motion.div>

                                        <div className={`text-sm font-medium text-gray-800 mb-2`}>
                                            {stat.label}
                                        </div>

                                        <div className={`text-xs text-gray-600`}>
                                            {stat.description}
                                        </div>

                                        {/* Neon glow effect */}
                                        <motion.div
                                            className={`absolute inset-0 rounded-2xl opacity-20`}
                                            style={{
                                                background: `radial-gradient(circle at center, rgba(${stat.neonRGB}, 0.3) 0%, transparent 70%)`,
                                                filter: 'blur(10px)'
                                            }}
                                            animate={{
                                                scale: [1, 1.05, 1],
                                                opacity: [0.2, 0.3, 0.2]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />

                                        {/* Decorative element */}
                                        <motion.div
                                            className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br ${stat.color} rounded-full opacity-60`}
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom CTA */}
                        <motion.div
                            className="text-center mt-12 pt-8 border-t border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Zap className="w-6 h-6 text-green-300" />
                                <h4 className="text-2xl font-bold text-white">Growing Fast</h4>
                            </div>
                            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                                Our network continues to expand across South Africa, connecting more farmers and consumers every day.
                            </p>

                            <motion.button
                                className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Join Our Network
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 