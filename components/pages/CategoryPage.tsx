'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { categories } from '../../constants/categories';
import { ProductCard } from '../app/cards/ProductCard';

interface CategoryPageProps {
    categoryId: string;
}

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

export function CategoryPage({ categoryId }: CategoryPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number; }>({});

    const category = categories.find(cat => cat.id === categoryId);
    const products = useQuery(
        api.products.getProductsByCategory,
        categoryId ? { categoryId } : "skip"
    );
    const farmers = useQuery(api.users.getAllFarmers);

    // Auto-rotate images for products with multiple images
    useEffect(() => {
        if (!products) return;

        const interval = setInterval(() => {
            setCurrentImageIndexes(prev => {
                const newIndexes = { ...prev };
                products.forEach((product: Product) => {
                    if (product.images.length > 1) {
                        const currentIndex = newIndexes[product._id] || 0;
                        newIndexes[product._id] = (currentIndex + 1) % product.images.length;
                    }
                });
                return newIndexes;
            });
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [products]);

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-600">Category not found</h1>
                    <Link href="/products" className="text-green-600 hover:text-green-700">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (!products) {
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
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">{category.name}</h1>
                    <p className="text-xl text-gray-600">{category.description}</p>
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
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {products.map((product: Product, index: number) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            index={index}
                            currentImageIndex={currentImageIndexes[product._id] || 0}
                            farmers={farmers}
                            showVideoBackground={true}
                        />
                    ))}
                </motion.div>

                {/* Empty State */}
                {products.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No Products Available
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We don&apos;t have any products in this category yet. Check back soon!
                            </p>
                            <Link href="/products">
                                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                    Browse All Products
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}