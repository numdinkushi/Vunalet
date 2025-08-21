'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '../../../../app/cards/ProductCard';
import { Product, Farmer } from '../../types';

interface ProductGridProps {
    products: Product[];
    farmers?: Farmer[];
    currentImageIndexes: { [key: string]: number; };
    showVideoBackground: boolean;
}

export function ProductGrid({ products, farmers, currentImageIndexes, showVideoBackground }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: Product, index: number) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                    currentImageIndex={currentImageIndexes[product._id] || 0}
                    farmers={farmers}
                    showVideoBackground={showVideoBackground}
                />
            ))}
        </div>
    );
} 