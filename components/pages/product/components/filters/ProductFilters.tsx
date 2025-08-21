'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { FilterState, Category } from '../../types';

interface ProductFiltersProps {
    filterState: FilterState;
    onFilterChange: (filters: Partial<FilterState>) => void;
    categories: Category[];
}

export function ProductFilters({ filterState, onFilterChange, categories }: ProductFiltersProps) {
    return (
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
                        value={filterState.searchTerm}
                        onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                    />
                </div>

                <select
                    className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 transition-all duration-300 text-lg"
                    value={filterState.selectedCategory}
                    onChange={(e) => onFilterChange({ selectedCategory: e.target.value })}
                >
                    <option value="all">All Products</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>

                <select
                    className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 transition-all duration-300 text-lg"
                    value={filterState.sortBy}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value })}
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