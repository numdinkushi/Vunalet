'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { CategoryCarousel } from '../../carousel/CategoryCarousel';

interface Category {
    id: string;
    name: string;
    description: string;
    images: string[];
    productCount: number;
}

interface CategoryCardProps {
    category: Category;
    index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
    return (
        <motion.div
            key={category.id}
            className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => window.location.href = `/categories/${category.id}`}
        >
            {/* Image Carousel */}
            <div className="relative h-48 overflow-hidden">
                <CategoryCarousel
                    images={category.images}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    categoryId={category.id}
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
                        <ShoppingBag size={16} className="text-gray-600" />
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
                        <ArrowRight size={20} />
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
    );
} 