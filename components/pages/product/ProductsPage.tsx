'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { categories } from '../../../constants/categories';
import { Product, Farmer } from './types';
import { ProductHeader } from './components/header/ProductHeader';
import { FeaturedProducts } from './components/featured/FeaturedProducts';
import { ProductFilters } from './components/filters/ProductFilters';
import { AllProductsSection } from './components/products/AllProductsSection';
import { CategoryGrid } from './components/categories/CategoryGrid';
import { useProductFilters } from './hooks/useProductFilters';
import { useImageRotation } from './hooks/useImageRotation';

export function ProductsPage() {
    // Get products from database
    const allProducts = useQuery(api.products.getActiveProducts);
    const featuredProducts = useQuery(api.products.getFeaturedProducts);
    const farmers = useQuery(api.users.getAllFarmers);

    // Custom hooks
    const {
        filterState,
        paginationState,
        paginatedProducts,
        totalPages,
        updateFilters,
        updatePage,
        clearFilters
    } = useProductFilters(allProducts);

    const currentImageIndexes = useImageRotation(featuredProducts);

    if (!allProducts || !featuredProducts) {
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

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <ProductHeader />

                {/* Featured Products */}
                <FeaturedProducts
                    products={featuredProducts}
                    farmers={farmers}
                    currentImageIndexes={currentImageIndexes}
                />

                {/* Search and Filters */}
                <ProductFilters
                    filterState={filterState}
                    onFilterChange={updateFilters}
                    categories={categories}
                />

                {/* All Products Section */}
                <AllProductsSection
                    products={paginatedProducts}
                    farmers={farmers}
                    currentImageIndexes={currentImageIndexes}
                    currentPage={paginationState.currentPage}
                    totalPages={totalPages}
                    onPageChange={updatePage}
                />

                {/* Categories Section */}
                <CategoryGrid categories={categories} />
            </div>
        </div>
    );
} 