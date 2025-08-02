'use client';

import { motion } from 'framer-motion';
import { MapPin, Shield, Star, Users, Leaf } from 'lucide-react';
import Image from 'next/image';
import { VideoBackground } from '../../components/ui/VideoBackground';

const farmers = [
    {
        id: '1',
        name: 'John Farmer',
        location: 'Stellenbosch, Western Cape',
        rating: 4.8,
        totalProducts: 15,
        farmSize: '5 hectares',
        specialties: ['Vegetables', 'Fruits'],
        verified: true,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        description: 'Organic farming specialist with 10+ years experience in sustainable agriculture',
        customers: 120,
        experience: '10+ years'
    },
    {
        id: '2',
        name: 'Mary Green',
        location: 'Paarl, Western Cape',
        rating: 4.9,
        totalProducts: 22,
        farmSize: '8 hectares',
        specialties: ['Herbs', 'Leafy Greens'],
        verified: true,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400',
        description: 'Sustainable agriculture advocate and certified organic farmer',
        customers: 85,
        experience: '8+ years'
    },
    {
        id: '3',
        name: 'David Robertson',
        location: 'Robertson, Western Cape',
        rating: 4.7,
        totalProducts: 18,
        farmSize: '12 hectares',
        specialties: ['Grains', 'Vegetables'],
        verified: true,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        description: 'Multi-generational farmer specializing in traditional and modern farming techniques',
        customers: 95,
        experience: '15+ years'
    }
];

export function FarmersPage() {
    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Farmers</h1>
                    <p className="text-xl text-gray-600">Meet the dedicated South African farmers bringing you fresh produce</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {farmers.map((farmer, index) => (
                        <motion.div
                            key={farmer.id}
                            className="relative group"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                        >
                            {/* Video Background for Individual Farmer Card */}
                            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl">
                                <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
                            </div>

                            <div className="relative bg-transparent backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 z-10">
                                <div className="flex items-center mb-8">
                                    <div className="relative w-20 h-20 mr-6">
                                        <Image
                                            src={farmer.image}
                                            alt={farmer.name}
                                            fill
                                            className="rounded-2xl object-cover"
                                        />
                                        {farmer.verified && (
                                            <div className="absolute -top-2 -right-2 bg-green-500 p-1 rounded-full">
                                                <Shield className="text-white" size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-2xl font-bold text-white">{farmer.name}</h3>
                                        </div>
                                        <div className="flex items-center text-gray-200 mb-2">
                                            <MapPin size={16} />
                                            <span className="ml-1">{farmer.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="text-yellow-400 fill-current" size={16} />
                                            <span className="ml-1 font-semibold text-white">{farmer.rating}</span>
                                            <span className="ml-2 text-sm text-gray-300">({farmer.customers} customers)</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-200 mb-6 leading-relaxed">{farmer.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                                        <div className="text-sm text-gray-300 mb-1">Farm Size</div>
                                        <div className="font-semibold text-white">{farmer.farmSize}</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                                        <div className="text-sm text-gray-300 mb-1">Products</div>
                                        <div className="font-semibold text-white">{farmer.totalProducts}</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                                        <div className="text-sm text-gray-300 mb-1">Experience</div>
                                        <div className="font-semibold text-white">{farmer.experience}</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                                        <div className="text-sm text-gray-300 mb-1">Customers</div>
                                        <div className="font-semibold text-white">{farmer.customers}</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="text-sm text-gray-300 mb-3">Specialties</div>
                                    <div className="flex flex-wrap gap-2">
                                        {farmer.specialties.map((specialty, i) => (
                                            <span
                                                key={i}
                                                className="px-4 py-2 bg-green-500/30 text-green-200 rounded-full text-sm font-medium backdrop-blur-sm"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center text-green-300">
                                            <Leaf className="mr-1" size={16} />
                                            <span className="text-sm font-medium">Organic Certified</span>
                                        </div>
                                    </div>
                                    <motion.button
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Users className="mr-2" size={16} />
                                        View Products
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
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
            </div>
        </div>
    );
} 