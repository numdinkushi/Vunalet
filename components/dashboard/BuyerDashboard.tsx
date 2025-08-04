'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
    ShoppingCart,
    Package,
    Clock,
    DollarSign,
    CheckCircle,
    AlertCircle,
    MapPin,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BuyerDashboardProps {
    userProfile: any;
}

export function BuyerDashboard({ userProfile }: BuyerDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');

    // Queries
    const orders = useQuery(api.orders.getOrdersByBuyer, { buyerId: userProfile.clerkUserId });
    const orderStats = useQuery(api.orders.getOrderStats, {
        role: 'buyer',
        userId: userProfile.clerkUserId
    });

    // Mutations
    const cancelOrder = useMutation(api.orders.cancelOrder);

    const handleCancelOrder = async (orderId: string) => {
        try {
            await cancelOrder({ orderId });
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const stats = {
        totalOrders: orderStats?.total || 0,
        activeOrders: orderStats?.pending || 0 + orderStats?.confirmed || 0 + orderStats?.preparing || 0 + orderStats?.ready || 0 + orderStats?.inTransit || 0,
        completedOrders: orderStats?.delivered || 0,
        totalSpent: orderStats?.totalRevenue || 0,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-orange-100 text-orange-800';
            case 'ready':
                return 'bg-purple-100 text-purple-800';
            case 'in_transit':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">R {stats.totalSpent.toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="active">Active Orders</TabsTrigger>
                    <TabsTrigger value="history">Order History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Your latest purchases</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.products.length} items • R {order.totalCost}
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(order.orderStatus)}>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No orders yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Orders</CardTitle>
                            <CardDescription>Orders currently being processed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.filter(o =>
                                ['pending', 'confirmed', 'preparing', 'ready', 'in_transit'].includes(o.orderStatus)
                            ).length > 0 ? (
                                <div className="space-y-4">
                                    {orders
                                        .filter(o => ['pending', 'confirmed', 'preparing', 'ready', 'in_transit'].includes(o.orderStatus))
                                        .map((order) => (
                                            <div key={order._id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(order.orderStatus)}>
                                                        {order.orderStatus}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Items</p>
                                                        <p className="text-sm text-gray-600">{order.products.length} products</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Total</p>
                                                        <p className="text-sm text-gray-600">R {order.totalCost}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Payment</p>
                                                        <p className="text-sm text-gray-600">{order.paymentStatus}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        {order.deliveryAddress}
                                                    </div>
                                                    {order.estimatedDeliveryTime && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Est. Delivery: {order.estimatedDeliveryTime}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    <Button size="sm" variant="outline">Track Order</Button>
                                                    {order.orderStatus === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCancelOrder(order._id)}
                                                            className="text-red-600"
                                                        >
                                                            Cancel Order
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No active orders</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                            <CardDescription>Your completed and cancelled orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.filter(o =>
                                ['delivered', 'cancelled'].includes(o.orderStatus)
                            ).length > 0 ? (
                                <div className="space-y-4">
                                    {orders
                                        .filter(o => ['delivered', 'cancelled'].includes(o.orderStatus))
                                        .map((order) => (
                                            <div key={order._id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(order.orderStatus)}>
                                                        {order.orderStatus}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Items</p>
                                                        <p className="text-sm text-gray-600">{order.products.length} products</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Total</p>
                                                        <p className="text-sm text-gray-600">R {order.totalCost}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Payment</p>
                                                        <p className="text-sm text-gray-600">{order.paymentStatus}</p>
                                                    </div>
                                                </div>

                                                {order.orderStatus === 'delivered' && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline">
                                                            <Star className="w-4 h-4 mr-1" />
                                                            Rate Order
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            Reorder
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No order history yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 