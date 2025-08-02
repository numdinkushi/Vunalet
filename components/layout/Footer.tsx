'use client';

import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { AnimatedLogo } from '../ui/AnimatedLogo';

export function Footer() {
    return (
        <motion.footer
            className="bg-primary text-white py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <AnimatedLogo size={32} />
                            <h3 className="text-2xl font-bold">Vunalet</h3>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Harvesting the future through sustainable agriculture and direct farmer-consumer connections.
                        </p>
                        <div className="flex space-x-4">
                            <motion.a href="#" className="text-gray-300 hover:text-white" whileHover={{ scale: 1.2 }}>
                                <Phone size={20} />
                            </motion.a>
                            <motion.a href="#" className="text-gray-300 hover:text-white" whileHover={{ scale: 1.2 }}>
                                <Mail size={20} />
                            </motion.a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Products', 'Farmers', 'About', 'Contact'].map((link) => (
                                <li key={link}>
                                    <motion.a
                                        href="#"
                                        className="text-gray-300 hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        {link}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            {['Vegetables', 'Fruits', 'Grains', 'Herbs'].map((category) => (
                                <li key={category}>
                                    <motion.a
                                        href="#"
                                        className="text-gray-300 hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        {category}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            {['Help Center', 'Shipping Info', 'Returns', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <motion.a
                                        href="#"
                                        className="text-gray-300 hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        {item}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <motion.div
                    className="border-t border-gray-600 mt-12 pt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <p className="text-gray-300">
                        © 2024 Vunalet. All rights reserved. Built with ❤️ for Nigerian farmers.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    );
} 