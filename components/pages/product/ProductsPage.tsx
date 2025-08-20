'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    ShoppingCart,
    ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { categories } from '../../../constants/categories';
import { ProductCard } from '../../app/cards/ProductCard';

export function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number; }>({});

    // Get products from database
    const allProducts = useQuery(api.products.getActiveProducts);
    const featuredProducts = useQuery(api.products.getFeaturedProducts);
    const farmers = useQuery(api.users.getAllFarmers);

    // Auto-rotate images for products with multiple images
    useEffect(() => {
        if (!featuredProducts) return;

        const interval = setInterval(() => {
            setCurrentImageIndexes(prev => {
                const newIndexes = { ...prev };
                featuredProducts.forEach(product => {
                    if (product.images.length > 1) {
                        const currentIndex = newIndexes[product._id] || 0;
                        newIndexes[product._id] = (currentIndex + 1) % product.images.length;
                    }
                });
                return newIndexes;
            });
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [featuredProducts]);

    if (!allProducts || !featuredProducts) {
        return (
            <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="mb-12 text-center"
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
                            <option value="all">All Products</option>
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

                {/* Featured Products */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-lg text-gray-600">Handpicked fresh produce from our trusted farmers</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.slice(0, 6).map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                index={index}
                                currentImageIndex={currentImageIndexes[product._id] || 0}
                                farmers={farmers}
                                showVideoBackground={true}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Categories Section */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
                        <p className="text-lg text-gray-600">Explore our wide range of fresh produce categories</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                onClick={() => window.location.href = `/categories/${category.id}`}
                            >
                                {/* Category Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={category.images[0]}
                                        alt={category.name}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                            {category.productCount} items
                                        </span>
                                    </div>

                                    {/* Shopping Bag Icon */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                            <ShoppingCart size={16} className="text-gray-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                        <motion.div
                                            className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            whileHover={{ x: 5 }}
                                        >
                                            <ShoppingCart size={20} />
                                        </motion.div>
                                    </div>

                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                        {category.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 font-medium">
                                            {category.productCount} products available
                                        </span>
                                        <span className="text-sm font-semibold text-green-600 group-hover:text-green-700 transition-colors duration-300 flex items-center">
                                            Explore
                                            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 