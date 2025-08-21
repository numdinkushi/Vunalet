import { useState, useEffect } from 'react';
import { Product, FilterState, PaginationState } from '../types';

export function useProductFilters(allProducts: Product[] | undefined) {
    const [filterState, setFilterState] = useState<FilterState>({
        searchTerm: '',
        selectedCategory: 'all',
        sortBy: 'newest'
    });

    const [paginationState, setPaginationState] = useState<PaginationState>({
        currentPage: 1,
        productsPerPage: 6
    });

    // Reset to first page when filters change
    useEffect(() => {
        setPaginationState(prev => ({ ...prev, currentPage: 1 }));
    }, [filterState.searchTerm, filterState.selectedCategory, filterState.sortBy]);

    // Filter products based on search and category
    const filteredProducts = allProducts?.filter((product: Product) => {
        const matchesSearch = product.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(filterState.searchTerm.toLowerCase()));
        const matchesCategory = filterState.selectedCategory === 'all' || product.categoryId === filterState.selectedCategory;
        return matchesSearch && matchesCategory;
    }) || [];

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
        switch (filterState.sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return b.createdAt - a.createdAt;
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / paginationState.productsPerPage);
    const startIndex = (paginationState.currentPage - 1) * paginationState.productsPerPage;
    const endIndex = startIndex + paginationState.productsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    const updateFilters = (newFilters: Partial<FilterState>) => {
        setFilterState(prev => ({ ...prev, ...newFilters }));
    };

    const updatePage = (page: number) => {
        setPaginationState(prev => ({ ...prev, currentPage: page }));
    };

    const clearFilters = () => {
        setFilterState({
            searchTerm: '',
            selectedCategory: 'all',
            sortBy: 'newest'
        });
    };

    return {
        filterState,
        paginationState,
        filteredProducts: sortedProducts,
        paginatedProducts,
        totalPages,
        updateFilters,
        updatePage,
        clearFilters
    };
} 