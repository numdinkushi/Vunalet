'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchAndFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategory?: string;
    setSelectedCategory?: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    categories?: Array<{ id: string; name: string; }>;
    placeholder?: string;
}

export function SearchAndFilters({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories,
    placeholder = "Search products..."
}: SearchAndFiltersProps) {
    return (
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
                        placeholder={placeholder}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {categories && setSelectedCategory && (
                    <select
                        className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 transition-all duration-300 text-lg"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                )}

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
    );
} 