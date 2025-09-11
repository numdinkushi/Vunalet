'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
    Truck,
    Clock,
    DollarSign,
    CheckCircle,
    Package,
    MapPin,
    User
} from 'lucide-react';
import { StatCard, DeliveryCard } from './components';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { LZC_TOKEN_NAME } from '../../../constants/tokens';
import { useOrderManagement } from '../../../hooks/use-order-management';
import { Badge } from '../../ui/badge';
import { useBalanceDisplay } from '../../../hooks/use-balance-display';
import { DispatcherOrder } from './types';
import { Button } from '../../ui/button';

// Type for Convex order structure with user info
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
    buyerInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    } | null;
    farmerInfo?: {
        firstName: string;
        lastName: string;
        businessName?: string;
        email: string;
    } | null;
    dispatcherInfo?: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

interface DispatcherDashboardProps {
    userProfile: {
        clerkUserId: string;
        liskId?: string;
    };
}

export function DispatcherDashboard({ userProfile }: DispatcherDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const { user, isLoaded } = useUser();

    // Use the enhanced balance display hook instead of direct queries
    const {
        walletBalance,
        ledgerBalance,
        isLoading: balanceLoading
    } = useBalanceDisplay();

    // Fetch real data from Convex - Add skip conditions to prevent "Failed to fetch" errors
    const orders = useQuery(
        api.orders.getOrdersByDispatcherWithUserInfo,
        user?.id && userProfile?.clerkUserId ? { dispatcherId: userProfile.clerkUserId } : "skip"
    );

    const orderStats = useQuery(
        api.orders.getOrderStats,
        user?.id && userProfile?.clerkUserId ? {
            role: 'dispatcher',
            userId: userProfile.clerkUserId
        } : "skip"
    );

    // Mutations
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

    // Show loading state while user is being loaded
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

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await updateOrderStatus({
                orderId,
                orderStatus: status as "pending" | "confirmed" | "preparing" | "ready" | "in_transit" | "delivered" | "cancelled",
            });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Calculate real stats from data
    const stats = {
        totalDeliveries: orderStats?.total ?? 0,
        activeDeliveries: orderStats ? (orderStats.pending + orderStats.confirmed + orderStats.preparing + orderStats.ready + orderStats.inTransit + (orderStats.arrived || 0)) : 0,
        completedDeliveries: orderStats?.delivered ?? 0,
        totalEarnings: orderStats?.totalRevenue ?? 0,
    };

    // Transform Convex orders to match the expected interface
    const transformedOrders = orders?.map(order => ({
        _id: order._id,
        products: order.products,
        totalCost: order.totalCost,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: new Date(order.createdAt).toISOString(),
        deliveryAddress: order.deliveryAddress,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        farmName: order.farmerInfo?.businessName || `${order.farmerInfo?.firstName} ${order.farmerInfo?.lastName}` || 'Unknown Farm',
        customerName: order.buyerInfo ? `${order.buyerInfo.firstName} ${order.buyerInfo.lastName}` : 'Unknown Customer',
        customerPhone: order.buyerInfo?.phone || 'No phone provided',
    })) || [];

    // Remove the useOrderManagement hook since it's not needed
    // const { confirmDelivery, isProcessing } = useOrderManagement();

    // Remove the handleMarkAsDelivered function since it's not used
    // const handleMarkAsDelivered = async (orderId: string) => {
    //     await confirmDelivery(orderId);
    // };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Deliveries"
                    value={stats.totalDeliveries}
                    icon={Truck}
                    color="blue"
                />
                <StatCard
                    title="Active Deliveries"
                    value={stats.activeDeliveries}
                    icon={Clock}
                    color="orange"
                />
                <StatCard
                    title="Completed"
                    value={stats.completedDeliveries}
                    icon={CheckCircle}
                    color="green"
                />
                <StatCard
                    title="Total Earnings"
                    value={`R ${stats.totalEarnings.toFixed(2)}`}
                    icon={DollarSign}
                    color="green"
                />
            </div>

            {/* Wallet Card */}
            <WalletCard />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">My Orders ({transformedOrders.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Recent Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transformedOrders.slice(0, 3).map((order) => (
                                        <DeliveryCard
                                            key={order._id}
                                            order={order}
                                            showActions={false}
                                        />
                                    ))}
                                    {transformedOrders.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No recent orders</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Button className="w-full" variant="outline">
                                        <User className="w-4 h-4 mr-2" />
                                        Update Profile
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <Truck className="w-4 h-4 mr-2" />
                                        View All Orders
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transformedOrders.map((order) => (
                                    <DeliveryCard
                                        key={order._id}
                                        order={order}
                                        showActions={true}
                                    // Remove this line: onUpdateStatus={handleUpdateStatus}
                                    />
                                ))}
                                {transformedOrders.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No orders assigned</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 