'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { VideoBackground } from '../ui/VideoBackground';
import { categoryMap, categories } from '../../constants/categories';
import { allProducts } from '../../constants/products';

interface CategoryPageProps {
    categoryId: string;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number; }>({});

    const categoryName = categoryMap[categoryId as keyof typeof categoryMap] || 'Category';
    const products = allProducts[categoryId as keyof typeof allProducts] || [];

    // Auto-rotate images for products with multiple images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndexes(prev => {
                const newIndexes = { ...prev };
                products.forEach(product => {
                    if (product.images.length > 1) {
                        const currentIndex = newIndexes[product.id] || 0;
                        newIndexes[product.id] = (currentIndex + 1) % product.images.length;
                    }
                });
                return newIndexes;
            });
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [products]);

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center mb-4">
                        <motion.button
                            onClick={() => window.history.back()}
                            className="mr-4 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </motion.button>
                        <h1 className="text-4xl font-bold text-gray-900">{categoryName}</h1>
                    </div>
                    <p className="text-xl text-gray-600">Discover fresh {categoryName.toLowerCase()} from local farmers</p>
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
                                placeholder={`Search ${categoryName.toLowerCase()}...`}
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

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
                    {products.map((product, index) => {
                        const currentImageIndex = currentImageIndexes[product.id] || 0;

                        return (
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

                                <div className="relative h-64 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`${product.id}-${currentImageIndex}`}
                                            className="absolute inset-0"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 1.2, ease: "easeInOut" }}
                                        >
                                            <Image
                                                src={product.images[currentImageIndex]}
                                                alt={`${product.name} - View ${currentImageIndex + 1}`}
                                                width={400}
                                                height={300}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                    <motion.button
                                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 z-20"
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 