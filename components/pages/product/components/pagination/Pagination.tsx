'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-12 space-x-4">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
            </button>

            <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors duration-200 ${currentPage === page
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
} 