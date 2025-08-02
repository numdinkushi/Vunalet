'use client';

import { motion } from 'framer-motion';

const stats = [
    { number: "500+", label: "Active Farmers" },
    { number: "10K+", label: "Happy Customers" },
    { number: "50+", label: "Cities Served" },
    { number: "99%", label: "Fresh Guarantee" }
];

export function StatsSection() {
    return (
        <section className="py-20 bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <motion.div
                                className="text-4xl md:text-5xl font-bold text-accent mb-2"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            >
                                {stat.number}
                            </motion.div>
                            <div className="text-lg opacity-90">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
} 