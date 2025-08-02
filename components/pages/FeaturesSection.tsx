'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Truck } from 'lucide-react';

const features = [
    {
        icon: <Users className="w-8 h-8" />,
        title: "Direct Connection",
        description: "Connect farmers directly with consumers, eliminating middlemen"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Quality Assured",
        description: "Certified organic produce with quality guarantees"
    },
    {
        icon: <Truck className="w-8 h-8" />,
        title: "Fresh Delivery",
        description: "Farm-to-table delivery ensuring maximum freshness"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold text-primary mb-4">Why Choose Vunalet?</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the future of farm-to-consumer commerce with our innovative platform
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="text-center p-8 rounded-2xl bg-secondary hover:bg-white hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                        >
                            <motion.div
                                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
} 