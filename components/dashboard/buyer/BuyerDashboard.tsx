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
    paymentMethod: 'lisk_zar' | 'cash';
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
    specialInstructions?: string;
    estimatedPickupTime?: string;
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    createdAt: number;
    updatedAt: number;
    farmerInfo?: {
        firstName: string;
        lastName: string;
        businessName?: string;
    } | null;
    dispatcherInfo?: {
        firstName: string;
        lastName: string;
    } | null;
}

export default function BuyerDashboard() {
    useMounted();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useUser();

    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Fetch real orders from Convex
    const buyerOrders = useQuery(api.orders.getOrdersByBuyerWithFarmerInfo, {
        buyerId: user?.id || '',
    });

    // Fetch order stats from Convex
    const orderStats = useQuery(api.orders.getOrderStats, {
        role: 'buyer',
        userId: user?.id || '',
    });

    // Use the enhanced balance display hook instead of direct queries
    const {
        walletBalance,
        ledgerBalance,
        isLoading: balanceLoading
    } = useBalanceDisplay();

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
            createdAt: new Date(order.createdAt).toISOString(),
            deliveryAddress: order.deliveryAddress,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            riderId: order.dispatcherId,
            riderName: order.dispatcherInfo ?
                `${order.dispatcherInfo.firstName} ${order.dispatcherInfo.lastName}` :
                order.dispatcherId || '',
            farmName: order.farmerInfo ?
                (order.farmerInfo.businessName || `${order.farmerInfo.firstName} ${order.farmerInfo.lastName}`) :
                order.farmerId, // Fallback to ID if no farmer info
            buyerId: order.buyerId,
            dispatcherId: order.dispatcherId,
            farmerId: order.farmerId,
            dispatcherAmount: order.dispatcherAmount,
            farmerAmount: order.farmerAmount,
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

    const { confirmDelivery, isProcessing } = useOrderManagement();

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <StatsGrid stats={stats} />

                {/* Wallet Card */}
                <WalletCard className="mt-4" />
                <div className="mt-8">
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <OrderList
                            title="Recent Orders"
                            orders={transformedOrders.slice(0, 3)}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onRowClick={handleRowClick}
                        />
                    </div>
                )}

                {activeTab === 'active' && (
                    <div className="space-y-6">
                        <OrderList
                            title="Active Orders"
                            orders={getActiveOrders()}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onRowClick={handleRowClick}
                        />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <OrderList
                            title="Order History"
                            orders={getHistoryOrders()}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onRowClick={handleRowClick}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <OrderModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    buyerLiskId={userProfile?.liskId}
                />
            )}
        </div>
    );
} 