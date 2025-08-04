'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
    Truck,
    MapPin,
    Clock,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DispatcherDashboardProps {
    userProfile: any;
}

export function DispatcherDashboard({ userProfile }: DispatcherDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');

    // Queries
    const orders = useQuery(api.orders.getOrdersByDispatcher, { dispatcherId: userProfile.clerkUserId });
    const orderStats = useQuery(api.orders.getOrderStats, {
        role: 'dispatcher',
        userId: userProfile.clerkUserId
    });

    // Mutations
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await updateOrderStatus({
                orderId,
                orderStatus: status as any,
            });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const stats = {
        totalDeliveries: orderStats?.total || 0,
        activeDeliveries: orderStats?.inTransit || 0,
        completedDeliveries: orderStats?.delivered || 0,
        totalEarnings: 0, // This would be calculated from delivery fees
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
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
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
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.activeDeliveries}</p>
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
                                    <p className="text-2xl font-bold text-gray-900">{stats.completedDeliveries}</p>
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
                                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                    <p className="text-2xl font-bold text-gray-900">R {stats.totalEarnings.toFixed(2)}</p>
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
                    <TabsTrigger value="active">Active Deliveries</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Deliveries</CardTitle>
                            <CardDescription>Your latest delivery assignments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.deliveryAddress} • R {order.deliveryCost}
                                                </p>
                                            </div>
                                            <Badge variant={
                                                order.orderStatus === 'in_transit' ? 'default' :
                                                    order.orderStatus === 'delivered' ? 'default' :
                                                        order.orderStatus === 'ready' ? 'secondary' : 'outline'
                                            }>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No deliveries assigned yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Deliveries</CardTitle>
                            <CardDescription>Orders currently in transit</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.filter(o => o.orderStatus === 'in_transit').length > 0 ? (
                                <div className="space-y-4">
                                    {orders
                                        .filter(o => o.orderStatus === 'in_transit')
                                        .map((order) => (
                                            <div key={order._id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge variant="default">In Transit</Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Pickup</p>
                                                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Delivery</p>
                                                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Fee</p>
                                                        <p className="text-sm text-gray-600">R {order.deliveryCost}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        <Navigation className="w-4 h-4 mr-1" />
                                                        Navigate
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                                    >
                                                        Mark Delivered
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No active deliveries</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completed" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Deliveries</CardTitle>
                            <CardDescription>Successfully delivered orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.filter(o => o.orderStatus === 'delivered').length > 0 ? (
                                <div className="space-y-4">
                                    {orders
                                        .filter(o => o.orderStatus === 'delivered')
                                        .map((order) => (
                                            <div key={order._id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                        Delivered
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Delivery Address</p>
                                                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Delivery Fee</p>
                                                        <p className="text-sm text-gray-600">R {order.deliveryCost}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Completed</p>
                                                        <p className="text-sm text-gray-600">
                                                            {order.actualDeliveryTime ?
                                                                new Date(order.actualDeliveryTime).toLocaleDateString() :
                                                                'N/A'
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No completed deliveries yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 