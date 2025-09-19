'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    ArrowLeft
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
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

interface FarmerProductsPageProps {
    farmerId: string;
}

export function FarmerProductsPage({ farmerId }: FarmerProductsPageProps) {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number; }>({});

    // Get farmer-specific products
    const farmerProducts = useQuery(
        api.products.getProductsByFarmer,
        farmerId ? { farmerId } : "skip"
    );
    const farmers = useQuery(api.users.getAllFarmers);

    // Get farmer info
    const farmerInfo = useQuery(
        api.users.getUserProfile,
        farmerId ? { clerkUserId: farmerId } : "skip"
    );

    // Auto-rotate images for products with multiple images
    useEffect(() => {
        if (!farmerProducts) return;

        const interval = setInterval(() => {
            setCurrentImageIndexes(prev => {
                const newIndexes = { ...prev };
                farmerProducts.forEach((product: Product) => {
                    if (product.images.length > 1) {
                        const currentIndex = newIndexes[product._id] || 0;
                        newIndexes[product._id] = (currentIndex + 1) % product.images.length;
                    }
                });
                return newIndexes;
            });
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [farmerProducts]);

    if (!farmerProducts) {
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
    const filteredProducts = farmerProducts.filter((product: Product) => {
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

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        onClick={() => router.push('/products')}
                        className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Products
                    </button>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        {farmerInfo ? `${farmerInfo.firstName} ${farmerInfo.lastName}'s Products` : 'Farmer Products'}
                    </h1>
                    <p className="text-xl text-gray-600">
                        Discover fresh produce from this trusted farmer
                    </p>
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

                {/* Products Grid */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {sortedProducts.length > 0 ? (
                        <>
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    {farmerInfo ? `${farmerInfo.firstName}'s Products` : 'Farmer Products'}
                                </h2>
                                <p className="text-lg text-gray-600">
                                    {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {sortedProducts.map((product: Product, index: number) => (
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
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
                            <p className="text-gray-600 mb-8">
                                {farmerInfo ? `${farmerInfo.firstName} ${farmerInfo.lastName}` : 'This farmer'} doesn&apos;t have any products available at the moment.
                            </p>
                            <button
                                onClick={() => router.push('/products')}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                            >
                                Browse All Products
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
} 