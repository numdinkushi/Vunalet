import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { LZC_TOKEN_NAME } from '../../../../constants/tokens';
import { FarmerUserProfile, ConvexOrder, TransformedOrder, DashboardStats } from '../types/dashboard-types';
import { Product } from '../types';
import { useBalanceDisplay } from '../../../../hooks/use-balance-display';

export function useFarmerDashboard(userProfile: FarmerUserProfile) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const { user } = useUser();

    // Use the enhanced balance display hook
    const {
        walletBalance,
        ledgerBalance,
        isLoading: balanceLoading,
        isRefreshing: balanceRefreshing,
        refreshBalance
    } = useBalanceDisplay();

    // Queries with skip safety
    const products = useQuery(
        api.products.getProductsByFarmer,
        userProfile?.clerkUserId ? { farmerId: userProfile.clerkUserId } : "skip"
    );

    const orders = useQuery(
        api.orders.getOrdersByFarmerWithUserInfo,
        userProfile?.clerkUserId ? { farmerId: userProfile.clerkUserId } : "skip"
    );

    const categories = useQuery(api.categories.getActiveCategories);

    const orderStats = useQuery(
        api.orders.getOrderStats,
        userProfile?.clerkUserId ? {
            role: 'farmer',
            userId: userProfile.clerkUserId,
        } : "skip"
    );

    // Debug logging
    console.log('Farmer Dashboard Debug:', {
        userProfile: userProfile?.clerkUserId,
        orders: orders,
        orderStats: orderStats,
        products: products
    });

    // Check if any data is loading
    const isLoading = products === undefined || orders === undefined || orderStats === undefined || balanceLoading;

    // Transform orders
    const transformOrders = (convexOrders: ConvexOrder[]): TransformedOrder[] => {
        return convexOrders?.map(order => ({
            _id: order._id,
            products: order.products.map((p) => ({
                name: p.name,
                quantity: p.quantity,
                price: p.price,
            })),
            totalCost: order.totalCost,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            createdAt: new Date(order.createdAt).toISOString(),
            deliveryAddress: order.deliveryAddress,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            riderId: order.dispatcherId,
            riderName: order.dispatcherInfo ?
                `${order.dispatcherInfo.firstName} ${order.dispatcherInfo.lastName}` :
                order.dispatcherId || '',
            customerName: order.buyerInfo ?
                `${order.buyerInfo.firstName} ${order.buyerInfo.lastName}` :
                order.buyerId,
            customerPhone: order.buyerInfo?.phone || '',
            farmName: userProfile?.firstName ? `${userProfile.firstName}'s Farm` : 'My Farm',
            buyerId: order.buyerId,
            dispatcherId: order.dispatcherId,
            farmerId: order.farmerId,
        })) || [];
    };

    const transformedOrders = transformOrders(orders || []);

    // Calculate stats from real data - FIXED: Add missing properties and rename to dashboardStats
    const dashboardStats: DashboardStats = {
        totalProducts: products?.length ?? 0,
        activeOrders: orderStats ? (orderStats.pending + orderStats.confirmed + orderStats.preparing + orderStats.ready + orderStats.inTransit) : 0,
        totalRevenue: orderStats?.totalRevenue ?? 0,
        pendingOrders: orderStats?.pending ?? 0,
    };

    return {
        activeTab,
        setActiveTab,
        showAddProduct,
        setShowAddProduct,
        products: products || [],
        orders: transformedOrders,
        categories: categories || [],
        dashboardStats, // FIXED: Return dashboardStats instead of stats
        isLoading,
        walletBalance,
        ledgerBalance,
        balanceLoading,
        balanceRefreshing,
        refreshBalance,
        userProfile
    };
}
