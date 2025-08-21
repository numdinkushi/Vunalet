'use client';

import { motion } from 'framer-motion';
import { Category } from '../../types';
import { CategoryCard } from './CategoryCard';

interface CategoryGridProps {
    categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
    return (
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
                    <CategoryCard key={category.id} category={category} index={index} />
                ))}
            </div>
        </motion.div>
    );
} 