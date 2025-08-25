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

    // Queries
    const products = useQuery(api.products.getProductsByFarmer, {
        farmerId: userProfile.clerkUserId
    });

    const orders = useQuery(api.orders.getOrdersByFarmerWithUserInfo, {
        farmerId: userProfile.clerkUserId
    });

    const categories = useQuery(api.categories.getActiveCategories);

    const orderStats = useQuery(api.orders.getOrderStats, {
        role: 'farmer',
        userId: userProfile.clerkUserId,
    });

    // Check if any data is loading
    const isLoading = products === undefined || orders === undefined || orderStats === undefined || balanceLoading;

    // Transform orders
    const transformOrders = (convexOrders: ConvexOrder[]): TransformedOrder[] => {
        return convexOrders?.map((order: ConvexOrder) => ({
            _id: order._id,
            products: order.products.map((p) => ({
                name: p.name,
                quantity: p.quantity,
                price: p.price,
            })),
            totalCost: order.totalCost,
            orderStatus: order.orderStatus as 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled',
            paymentStatus: order.paymentStatus as 'pending' | 'paid' | 'failed',
            createdAt: new Date(order.createdAt).toISOString(),
            deliveryAddress: order.deliveryAddress,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            customerName: order.buyerInfo ?
                `${order.buyerInfo.firstName} ${order.buyerInfo.lastName}` :
                order.buyerId,
            customerPhone: order.buyerInfo?.phone || '',
            farmName: order.farmerInfo ?
                (order.farmerInfo.businessName || `${order.farmerInfo.firstName} ${order.farmerInfo.lastName}`) :
                order.farmerId,
            riderName: order.dispatcherInfo ?
                `${order.dispatcherInfo.firstName} ${order.dispatcherInfo.lastName}` :
                order.dispatcherId,
        })) || [];
    };

    const transformedOrders = transformOrders(orders || []);

    // Calculate dashboard stats
    const dashboardStats: DashboardStats = {
        totalProducts: products?.length || 0,
        activeOrders: orderStats ? (orderStats.pending + orderStats.confirmed + orderStats.preparing + orderStats.ready + orderStats.inTransit + (orderStats.arrived || 0)) : 0,
        totalRevenue: orderStats?.totalRevenue || 0,
        pendingOrders: orderStats?.pending || 0,
    };

    return {
        // State
        activeTab,
        setActiveTab,
        showAddProduct,
        setShowAddProduct,

        // Data
        balance: { walletBalance, ledgerBalance },
        products: products as Product[],
        orders: transformedOrders,
        categories,
        orderStats,
        dashboardStats,

        // Loading states
        isLoading,
        balanceLoading,
        balanceRefreshing,

        // Actions
        refreshBalance,
        onProductDeleted: () => {
            toast.success('Product list refreshed');
        },
    };
} 