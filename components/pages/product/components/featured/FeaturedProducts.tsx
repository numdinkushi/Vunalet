'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '../../../../app/cards/ProductCard';
import { Product, Farmer } from '../../types';

interface FeaturedProductsProps {
    products: Product[];
    farmers?: Farmer[];
    currentImageIndexes: { [key: string]: number; };
}

export function FeaturedProducts({ products, farmers, currentImageIndexes }: FeaturedProductsProps) {
    return (
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
                {products.slice(0, 6).map((product: Product, index: number) => (
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
    );
} 