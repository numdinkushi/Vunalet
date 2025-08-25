'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface BalanceLoadingProps {
    className?: string;
    showRefreshButton?: boolean;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function BalanceLoading({
    className = '',
    showRefreshButton = false,
    onRefresh,
    isRefreshing = false
}: BalanceLoadingProps) {
    return (
        <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                {showRefreshButton && onRefresh && (
                    <motion.button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className={`p-2 rounded-full transition-all duration-300 ${isRefreshing
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                            }`}
                        whileHover={!isRefreshing ? { scale: 1.1 } : {}}
                        whileTap={!isRefreshing ? { scale: 0.9 } : {}}
                    >
                        <motion.div
                            animate={isRefreshing ? { rotate: 360 } : {}}
                            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                        >
                            <RefreshCw size={16} />
                        </motion.div>
                    </motion.button>
                )}
            </div>

            <div className="space-y-4">
                {/* Wallet Balance Skeleton */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Ledger Balance Skeleton */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export function BalanceShimmer() {
    return (
        <div className="bg-white rounded-lg shadow p-6 overflow-hidden relative">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
} 