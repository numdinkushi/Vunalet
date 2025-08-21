'use client';

import { motion } from 'framer-motion';
import { Product, Farmer } from '../../types';
import { ProductGrid } from './ProductGrid';
import { Pagination } from '../pagination/Pagination';

interface AllProductsSectionProps {
    products: Product[];
    farmers?: Farmer[];
    currentImageIndexes: { [key: string]: number; };
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function AllProductsSection({
    products,
    farmers,
    currentImageIndexes,
    currentPage,
    totalPages,
    onPageChange
}: AllProductsSectionProps) {
    return (
        <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
        >
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">All Products</h2>
                <p className="text-lg text-gray-600">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {products.length > 0 ? (
                <>
                    <ProductGrid
                        products={products}
                        farmers={farmers}
                        currentImageIndexes={currentImageIndexes}
                        showVideoBackground={true}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
                    <p className="text-gray-600 mb-8">
                        No products match your current search criteria. Try adjusting your filters.
                    </p>
                </div>
            )}
        </motion.div>
    );
} 