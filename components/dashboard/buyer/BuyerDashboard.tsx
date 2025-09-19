'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader, StatsGrid, TabNavigation, OrderList } from './components';
import { OrderModal } from './modals';
import { filterOrdersByStatus } from './utils';
import { Order } from './types';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LZC_TOKEN_NAME } from '../../../constants/tokens';
import { useOrderManagement } from '../../../hooks/use-order-management';
import { useMounted } from '@/hooks/use-mounted';
import { useBalanceDisplay } from '../../../hooks/use-balance-display';

// Type for Convex order structure
interface ConvexOrder {
    _id: string;
    buyerId: string;
    farmerId: string;
    dispatcherId?: string;
    products: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        unit: string;
    }>;
    totalAmount: number;
    farmerAmount: number;
    dispatcherAmount: number;
    deliveryAddress: string;
    deliveryCoordinates?: {
        lat: number;
        lng: number;
    };
    pickupLocation?: string;
    pickupCoordinates?: {
        lat: number;
        lng: number;
    };
    deliveryDistance: number;
    deliveryCost: number;
    totalCost: number;
    paymentMethod: 'lisk_zar' | 'celo' | 'cash';
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
    specialInstructions?: string;
    estimatedPickupTime?: string;
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    createdAt: number;
    updatedAt: number;
    celoFarmerAddress?: string;
    celoDispatcherAddress?: string;
    celoPlatformAddress?: string;
    celoFromAddress?: string;
    farmerInfo?: {
        celoAddress?: string;
        firstName: string;
        lastName: string;
        businessName?: string;
    } | null;
    dispatcherInfo?: {
        celoAddress?: string;
        firstName: string;
        lastName: string;
    } | null;
}

export default function BuyerDashboard() {
    const mounted = useMounted();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user, isLoaded } = useUser();

    // Move all hooks to the top, before any conditional returns
    const userProfile = useQuery(
        api.users.getUserProfile,
        user?.id ? { clerkUserId: user.id } : "skip"
    );

    const buyerOrders = useQuery(
        api.orders.getOrdersByBuyerWithFarmerInfo,
        user?.id ? { buyerId: user.id } : "skip"
    );

    const orderStats = useQuery(
        api.orders.getOrderStats,
        user?.id ? {
            role: 'buyer',
            userId: user.id,
        } : "skip"
    );

    const {
        walletBalance,
        ledgerBalance,
        isLoading: balanceLoading
    } = useBalanceDisplay();

    const { confirmDelivery, isProcessing } = useOrderManagement();

    // Now handle conditional returns after all hooks
    if (!isLoaded || !user) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
        );
    }

    // Calculate stats from real data
    const stats = {
        totalOrders: orderStats?.total ?? 0,
        activeOrders: orderStats ? (orderStats.pending + orderStats.confirmed + orderStats.preparing + orderStats.ready + orderStats.inTransit) : 0,
        completedOrders: orderStats?.delivered ?? 0,
        totalSpent: orderStats?.totalRevenue ?? 0,
    };

    // Transform Convex orders to match the Order interface
    const transformOrders = (convexOrders: ConvexOrder[]): Order[] => {
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
            farmName: order.farmerInfo ?
                (order.farmerInfo.businessName || `${order.farmerInfo.firstName} ${order.farmerInfo.lastName}`) :
                order.farmerId,
            buyerId: order.buyerId,
            dispatcherId: order.dispatcherId,
            farmerId: order.farmerId,
            dispatcherAmount: order.dispatcherAmount,
            farmerAmount: order.farmerAmount,
            celoFarmerAddress: order.farmerInfo?.celoAddress || order.celoFarmerAddress,
            celoDispatcherAddress: order.dispatcherInfo?.celoAddress || order.celoDispatcherAddress,
            celoPlatformAddress: order.celoPlatformAddress,
            celoFromAddress: order.celoFromAddress,
        })) || [];
    };

    const transformedOrders = transformOrders(buyerOrders || []);

    const getActiveOrders = () => {
        return filterOrdersByStatus(transformedOrders, ['pending', 'confirmed', 'preparing', 'ready', 'in_transit', 'arrived']);
    };

    const getHistoryOrders = () => {
        return filterOrdersByStatus(transformedOrders, ['delivered', 'cancelled']);
    };

    const handleRowClick = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
            />

            <WalletCard
            />

            <StatsGrid stats={stats} />

            <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {activeTab === 'overview' && (
                <OrderList
                    title="Recent Orders"
                    orders={getActiveOrders()}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onRowClick={handleRowClick}
                />
            )}

            {activeTab === 'history' && (
                <OrderList
                    title="Order History"
                    orders={getHistoryOrders()}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onRowClick={handleRowClick}
                />
            )}

            <OrderModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                buyerLiskId={userProfile?.liskId}
            />
        </div>
    );
}
