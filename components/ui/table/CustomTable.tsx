'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { TableProps } from './types';

export function CustomTable<T = Record<string, unknown>>({
    data,
    columns,
    title,
    headerButtons,
    searchTerm = '',
    onSearchChange,
    onRowClick,
    canClickRow = true,
    pagination,
    loading = false,
    emptyMessage = 'No data found.',
    searchPlaceholder = 'Search...',
    showSearch = true,
    showPagination = true,
    showHeader = true,
    className = '',
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Calculate pagination if not provided
    const paginationState = useMemo(() => {
        if (pagination) {
            return pagination;
        }

        const totalPages = Math.ceil(data.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = data.slice(startIndex, endIndex);

        return {
            currentPage,
            pageSize,
            totalPages,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
            data: paginatedData,
        };
    }, [data, currentPage, pageSize, pagination]);

    const currentData = pagination ? data : paginationState.data;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Simple header */}
            {showHeader && title && (
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    {showSearch && onSearchChange && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Simple table */}
            <Card className="overflow-hidden">
                <div className="p-4">
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            <span className="ml-2">Loading...</span>
                        </div>
                    ) : currentData.length === 0 ? (
                        <div className="flex items-center justify-center p-8 text-gray-500">
                            {emptyMessage}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {currentData.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {columns.map((column) => (
                                        <div key={column.key} className="mb-2">
                                            <span className="font-medium">{column.header}: </span>
                                            {column.cell(item)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Simple pagination */}
            {showPagination && paginationState.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {((paginationState.currentPage - 1) * paginationState.pageSize) + 1} to{' '}
                        {Math.min(paginationState.currentPage * paginationState.pageSize, data.length)} of{' '}
                        {data.length} results
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => paginationState.onPageChange(paginationState.currentPage - 1)}
                            disabled={paginationState.currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1">
                            Page {paginationState.currentPage} of {paginationState.totalPages}
                        </span>
                        <button
                            onClick={() => paginationState.onPageChange(paginationState.currentPage + 1)}
                            disabled={paginationState.currentPage === paginationState.totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 