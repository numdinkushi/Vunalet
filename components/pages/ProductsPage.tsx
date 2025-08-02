'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    MapPin,
    Star,
    Heart,
    Filter
} from 'lucide-react';

const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'grains', name: 'Grains' },
    { id: 'herbs', name: 'Herbs' }
];

const products = [
    {
        id: '1',
        name: 'Organic Tomatoes',
        category: 'vegetables',
        price: 450,
        unit: 'KG',
        farmer: 'John Farmer',
        location: 'Jos, Plateau',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1546470427-e7ebce0a5e9c?w=400',
        quantity: 50,
        harvestDate: '2024-08-01'
    },
    {
        id: '2',
        name: 'Fresh Spinach',
        category: 'vegetables',
        price: 300,
        unit: 'KG',
        farmer: 'Mary Green',
        location: 'Abuja, FCT',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
        quantity: 30,
        harvestDate: '2024-08-02'
    },
    {
        id: '3',
        name: 'Sweet Corn',
        category: 'vegetables',
        price: 200,
        unit: 'PIECE',
        farmer: 'David Farm',
        location: 'Kaduna, Kaduna',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
        quantity: 100,
        harvestDate: '2024-07-30'
    }
];

export function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-primary mb-4">Fresh Products</h1>
                    <p className="text-xl text-gray-600">Discover the freshest produce from local farmers</p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
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
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <motion.button
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Heart size={20} className="text-gray-600" />
                                </motion.button>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-primary">{product.name}</h3>
                                    <div className="flex items-center">
                                        <Star className="text-yellow-400 fill-current" size={16} />
                                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-2">By {product.farmer}</p>
                                <div className="flex items-center text-gray-500 mb-4">
                                    <MapPin size={16} />
                                    <span className="ml-1 text-sm">{product.location}</span>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-2xl font-bold text-primary">
                                        ₦{product.price}
                                        <span className="text-sm text-gray-500">/{product.unit}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {product.quantity} {product.unit} available
                                    </div>
                                </div>

                                <motion.button
                                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
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