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
    User,
    AlertCircle,
    Timer,
    Hand
} from 'lucide-react';
import { StatCard, DeliveryCard } from './components';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useBalanceDisplay } from '../../../hooks/use-balance-display';
import { DispatcherOrder } from './types';
import { Button } from '../../ui/button';
import { formatCurrency } from './utils';


// Type for available order structure
interface AvailableOrder {
    _id: string;
    buyerId: string;
    farmerId: string;
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
    assignmentExpiryTime?: number; // Change from number to number | undefined
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
    const [isClaiming, setIsClaiming] = useState(false); // Move this here
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

    // Fetch available orders for self-assignment
    const availableOrders = useQuery(
        api.orders.getAvailableOrders,
        user?.id ? {} : "skip"
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
    const claimOrder = useMutation(api.orders.claimOrder);

    // Countdown timer component for available orders
    const CountdownTimer = ({ expiryTime }: { expiryTime: number; }) => {
        const [timeLeft, setTimeLeft] = useState(0);

        useEffect(() => {
            const updateTimer = () => {
                const now = Date.now();
                const remaining = Math.max(0, expiryTime - now);
                setTimeLeft(remaining);
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }, [expiryTime]);

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);

        if (timeLeft <= 0) {
            return <span className="text-red-500 text-sm">Expired</span>;
        }

        return (
            <div className="flex items-center gap-1 text-orange-600">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>
        );
    };

    // Available Order Card Component
    const AvailableOrderCard = ({ order }: { order: AvailableOrder; }) => {
        const isExpired = !!(order.assignmentExpiryTime && Date.now() > order.assignmentExpiryTime);

        return (
            <Card className={`hover:shadow-md transition-shadow ${isExpired ? 'opacity-60' : ''}`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-6 h-6 text-orange-500" />
                            <div>
                                <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                                <p className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                                {formatCurrency(order.dispatcherAmount, order.paymentMethod)}
                            </div>
                            <div className="text-sm text-gray-500">Your Earnings</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Total Order:</span>
                                <p className="text-lg font-bold text-green-600">{formatCurrency(order.totalCost, order.paymentMethod)}</p>
                            </div>
                            <div>
                                <span className="font-medium">Products:</span>
                                <p className="text-lg">{order.products.length} items</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">Products:</h4>
                            <div className="space-y-1">
                                {order.products.map((product, index: number) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <span>{product.name}</span>
                                        <span className="text-gray-600">
                                            {product.quantity} x {formatCurrency(product.price, order.paymentMethod)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">Delivery:</span>
                                </div>
                                <span className="text-right">{order.deliveryAddress}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">Customer:</span>
                                </div>
                                <span className="text-right">
                                    {order.buyerInfo ? `${order.buyerInfo.firstName} ${order.buyerInfo.lastName}` : 'Unknown'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                    <Truck className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">From:</span>
                                </div>
                                <span className="text-right">
                                    {order.farmerInfo?.businessName || `${order.farmerInfo?.firstName} ${order.farmerInfo?.lastName}` || 'Unknown Farm'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center space-x-1 text-orange-600">
                                <Timer className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {order.assignmentExpiryTime ?
                                        Math.max(0, Math.floor((order.assignmentExpiryTime - Date.now()) / 60000)) + ':' +
                                        Math.max(0, Math.floor(((order.assignmentExpiryTime - Date.now()) % 60000) / 1000)).toString().padStart(2, '0')
                                        : '0:00'
                                    }
                                </span>
                            </div>
                            <Button
                                onClick={() => handleClaimOrder(order._id)}
                                disabled={isExpired || isClaiming}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Hand className="w-4 h-4 mr-2" />
                                Claim Order
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

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

    const handleClaimOrder = async (orderId: string) => {
        if (!userProfile?.clerkUserId) return;

        setIsClaiming(true);
        try {
            await claimOrder({
                orderId,
                dispatcherId: userProfile.clerkUserId
            });
            console.log('Order claimed successfully!');
        } catch (error) {
            console.error('Error claiming order:', error);
        } finally {
            setIsClaiming(false);
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
    const transformedOrders: DispatcherOrder[] = orders?.map(order => ({
        _id: order._id,
        products: order.products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price
        })),
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
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="available">
                        Available Orders ({availableOrders?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="orders">My Orders ({transformedOrders.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Available Orders Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    Available Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {availableOrders?.slice(0, 2).map((order) => (
                                        <div key={order._id} className="p-3 border rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                    <p className="text-sm text-gray-600">
                                                        R {order.dispatcherAmount.toFixed(2)} earnings
                                                    </p>
                                                </div>
                                                <CountdownTimer expiryTime={order.assignmentExpiryTime || 0} />
                                            </div>
                                        </div>
                                    ))}
                                    {(!availableOrders || availableOrders.length === 0) && (
                                        <p className="text-gray-500 text-center py-4">No orders available</p>
                                    )}
                                    {availableOrders && availableOrders.length > 2 && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setActiveTab('available')}
                                        >
                                            View All Available Orders
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

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

                <TabsContent value="available" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                Available Orders
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                                Claim orders within 10 minutes or they&apos;ll be auto-assigned
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {availableOrders?.map((order) => (
                                    <AvailableOrderCard key={order._id} order={order} />
                                ))}
                                {(!availableOrders || availableOrders.length === 0) && (
                                    <div className="text-center py-8">
                                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No orders available for claiming</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            New orders will appear here as soon as they&apos;re placed
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
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