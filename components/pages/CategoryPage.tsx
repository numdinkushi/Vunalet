'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from './product/ProductCard';
import { SearchAndFilters } from './product/SearchAndFilters';
import { categoryMap, categories } from '../../constants/categories';
import { allProducts } from '../../constants/products';

interface CategoryPageProps {
    categoryId: string;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const categoryName = categoryMap[categoryId as keyof typeof categoryMap] || 'Category';
    const products = allProducts[categoryId as keyof typeof allProducts] || [];

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
                <SearchAndFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    placeholder={`Search ${categoryName.toLowerCase()}...`}
                />

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
} 