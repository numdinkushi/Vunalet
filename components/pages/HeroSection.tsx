'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { FloatingParticles } from '../3d/FloatingParticles';

export function HeroSection() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, -50]);
    const y2 = useTransform(scrollY, [0, 300], [0, -100]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-white to-secondary-dark">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <Suspense fallback={null}>
                        <FloatingParticles />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                    </Suspense>
                </Canvas>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ y: y1 }}
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-primary mb-6"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        Harvesting the
                        <motion.span
                            className="block text-accent"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            Future
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        Connect directly with local farmers and access the freshest produce
                        while supporting sustainable agriculture
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <motion.a
                            href="/products"
                            className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Shop Fresh Produce
                            <ArrowRight className="ml-2" size={20} />
                        </motion.a>

                        <motion.a
                            href="/farmers"
                            className="border-2 border-primary text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Join as Farmer
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Action */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
                    <motion.div
                        className="w-1 h-3 bg-primary rounded-full mt-2"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
} 