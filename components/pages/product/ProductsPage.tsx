'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    ShoppingCart,
    ArrowRight,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { categories } from '../../../constants/categories';
import { ProductCard } from '../../app/cards/ProductCard';

interface Product {
    _id: string;
    images: string[];
    name: string;
    price: number;
    unit: string;
    quantity: number;
    description?: string;
    harvestDate: string;
    isOrganic?: boolean;
    isFeatured: boolean;
    location: string;
    status: string;
    farmerId: string;
    categoryId: string;
    createdAt: number;
    updatedAt: number;
}

export function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number; }>({});

    const PRODUCTS_PER_PAGE = 6;

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
                featuredProducts.forEach((product: Product) => {
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

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, sortBy]);

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

    // Filter products based on search and category
    const filteredProducts = allProducts.filter((product: Product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return b.createdAt - a.createdAt;
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="mb-16 text-center relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-60"></div>
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                    {/* Main content */}
                    <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block mb-6"
                        >
                            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                                🌱 Fresh from the Farm
                            </div>
                        </motion.div>

                        <motion.h1
                            className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Fresh Products
                        </motion.h1>

                        <motion.p
                            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Discover the freshest produce from South African farmers, delivered straight from the farm to your table
                        </motion.p>

                        <motion.div
                            className="flex justify-center items-center space-x-8 text-sm text-gray-500"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span>100% Fresh</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span>Local Farmers</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                <span>Quality Assured</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Featured Products */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-lg text-gray-600">Handpicked fresh produce from our trusted farmers</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.slice(0, 6).map((product: Product, index: number) => (
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

                {/* Search and Filters */}
                <motion.div
                    className="bg-white rounded-3xl shadow-xl p-8 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
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

                {/* All Products Grid */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">All Products</h2>
                        <p className="text-lg text-gray-600">
                            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedProducts.map((product: Product, index: number) => (
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-12 space-x-4">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </button>

                                    <div className="flex space-x-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${currentPage === page
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
                            <p className="text-gray-600 mb-8">
                                No products match your current search criteria. Try adjusting your filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSortBy('newest');
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Categories Section */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
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