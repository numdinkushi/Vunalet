'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    MapPin,
    Star,
    Heart,
    Filter,
    ShoppingCart
} from 'lucide-react';
import Image from 'next/image';
import { VideoBackground } from '../../components/ui/VideoBackground';

const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'grains', name: 'Grains & Cereals' },
    { id: 'tubers', name: 'Tubers & Root Vegetables' },
    { id: 'herbs', name: 'Herbs & Spices' },
    { id: 'legumes', name: 'Legumes & Beans' },
    { id: 'nuts', name: 'Nuts & Seeds' },
    { id: 'dairy', name: 'Dairy & Eggs' },
    { id: 'meat', name: 'Meat & Poultry' },
    { id: 'honey', name: 'Honey & Bee Products' }
];

const products = [
    {
        id: '1',
        name: 'Organic Tomatoes',
        category: 'vegetables',
        price: 45,
        unit: 'KG',
        farmer: 'John Farmer',
        location: 'Stellenbosch, Western Cape',
        rating: 4.8,
        image: '/assets/products/tomatoes/image.jpg',
        quantity: 50,
        harvestDate: '2024-08-01',
        featured: true
    },
    {
        id: '2',
        name: 'Fresh Spinach',
        category: 'vegetables',
        price: 30,
        unit: 'KG',
        farmer: 'Mary Green',
        location: 'Paarl, Western Cape',
        rating: 4.9,
        image: '/assets/products/spinach/image (1).jpg',
        quantity: 30,
        harvestDate: '2024-08-02',
        featured: false
    },
    {
        id: '3',
        name: 'Sweet Corn',
        category: 'vegetables',
        price: 20,
        unit: 'PIECE',
        farmer: 'David Farm',
        location: 'Robertson, Western Cape',
        rating: 4.7,
        image: '/assets/products/corn/image (2).jpg',
        quantity: 100,
        harvestDate: '2024-07-30',
        featured: true
    },
    {
        id: '4',
        name: 'Fresh Oranges',
        category: 'fruits',
        price: 35,
        unit: 'KG',
        farmer: 'Citrus Valley',
        location: 'Citrusdal, Western Cape',
        rating: 4.6,
        image: '/assets/products/orange/image (4).jpg',
        quantity: 75,
        harvestDate: '2024-08-01',
        featured: false
    },
    {
        id: '5',
        name: 'Organic Carrots',
        category: 'vegetables',
        price: 25,
        unit: 'KG',
        farmer: 'Root Farm',
        location: 'Ceres, Western Cape',
        rating: 4.5,
        image: '/assets/products/carrots/image (6).jpg',
        quantity: 40,
        harvestDate: '2024-07-29',
        featured: false
    },
    {
        id: '6',
        name: 'Fresh Strawberries',
        category: 'fruits',
        price: 60,
        unit: 'KG',
        farmer: 'Berry Farm',
        location: 'Stellenbosch, Western Cape',
        rating: 4.9,
        image: '/assets/products/strawberry/image (8).jpg',
        quantity: 25,
        harvestDate: '2024-08-02',
        featured: true
    }
];

export function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Fresh Products</h1>
                    <p className="text-xl text-gray-600">Discover the freshest produce from South African farmers</p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    className="bg-white rounded-3xl shadow-xl p-8 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 transition-all duration-300 text-lg"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>

                        <select
                            className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 transition-all duration-300 text-lg"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 ${product.featured ? 'ring-2 ring-green-500' : ''
                                }`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                        >
                            {product.featured && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        Featured
                                    </span>
                                </div>
                            )}

                            <div className="relative">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={400}
                                    height={300}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <motion.button
                                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Heart size={20} className="text-gray-600" />
                                </motion.button>
                            </div>

                            {/* Video Background for Product Content */}
                            <div className="absolute bottom-0 left-0 right-0 top-64 pointer-events-none z-0">
                                <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
                            </div>

                            <div className="relative p-6 bg-transparent backdrop-blur-sm z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                    <div className="flex items-center bg-yellow-500/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                        <Star className="text-yellow-300 fill-current" size={16} />
                                        <span className="text-sm font-semibold text-yellow-200 ml-1">{product.rating}</span>
                                    </div>
                                </div>

                                <p className="text-gray-200 mb-3">By {product.farmer}</p>
                                <div className="flex items-center text-gray-300 mb-4">
                                    <MapPin size={16} />
                                    <span className="ml-1 text-sm">{product.location}</span>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-2xl font-bold text-green-300">
                                        R{product.price}
                                        <span className="text-sm text-gray-300 font-normal">/{product.unit}</span>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        {product.quantity} {product.unit} available
                                    </div>
                                </div>

                                <motion.button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ShoppingCart className="mr-2" size={20} />
                                    Add to Cart
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
} 