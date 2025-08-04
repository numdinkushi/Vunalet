'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { CategoryCard } from './CategoryCard';
import { SearchAndFilters } from './SearchAndFilters';
import { categories } from '../../../constants/categories';
import { allProducts } from '../../../constants/products';

// Featured products (first 6 products from vegetables and fruits)
const featuredProducts = [
    ...allProducts['1'].slice(0, 3), // vegetables
    ...allProducts['2'].slice(0, 3)  // fruits
];

export function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const categoryOptions = [
        { id: 'all', name: 'All Products' },
        ...categories.map(cat => ({ id: cat.id, name: cat.name }))
    ];

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
                <SearchAndFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    categories={categoryOptions}
                />

                {/* Featured Products Section */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-lg text-gray-600">Handpicked fresh produce from our top farmers</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
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
                            <CategoryCard key={category.id} category={category} index={index} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 