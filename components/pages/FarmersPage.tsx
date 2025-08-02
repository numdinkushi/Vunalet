'use client';

import { motion } from 'framer-motion';
import { MapPin, Shield } from 'lucide-react';

const farmers = [
    {
        id: '1',
        name: 'John Farmer',
        location: 'Jos, Plateau State',
        rating: 4.8,
        totalProducts: 15,
        farmSize: '5 hectares',
        specialties: ['Vegetables', 'Fruits'],
        verified: true,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        description: 'Organic farming specialist with 10+ years experience'
    },
    {
        id: '2',
        name: 'Mary Green',
        location: 'Abuja, FCT',
        rating: 4.9,
        totalProducts: 22,
        farmSize: '8 hectares',
        specialties: ['Herbs', 'Leafy Greens'],
        verified: true,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400',
        description: 'Sustainable agriculture advocate and certified organic farmer'
    }
];

export function FarmersPage() {
    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-primary mb-4">Our Farmers</h1>
                    <p className="text-xl text-gray-600">Meet the dedicated farmers bringing you fresh produce</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {farmers.map((farmer, index) => (
                        <motion.div
                            key={farmer.id}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-6">
                                <img
                                    src={farmer.image}
                                    alt={farmer.name}
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="text-xl font-bold text-primary">{farmer.name}</h3>
                                        {farmer.verified && (
                                            <Shield className="text-green-500 ml-2" size={20} />
                                        )}
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <MapPin size={16} />
                                        <span className="ml-1">{farmer.location}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">{farmer.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-sm text-gray-500">Farm Size</div>
                                    <div className="font-semibold">{farmer.farmSize}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Products</div>
                                    <div className="font-semibold">{farmer.totalProducts}</div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm text-gray-500 mb-2">Specialties</div>
                                <div className="flex flex-wrap gap-2">
                                    {farmer.specialties.map((specialty, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-secondary text-primary rounded-full text-sm"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-yellow-400 text-lg">★</span>
                                    <span className="ml-1 font-semibold">{farmer.rating}</span>
                                </div>
                                <motion.button
                                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Products
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
} 