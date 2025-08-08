'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
    Truck,
    MapPin,
    Clock,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Navigation,
    Package,
    User,
    Phone,
    Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate, getStatusColor, getOrderStatusText } from './utils';

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
                                <div className="p-3 bg-amber-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="active">Active Deliveries</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Today's Deliveries */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Today's Deliveries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {orders?.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Package className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                    <p className="text-sm text-gray-500">{order.orderStatus}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                                                <p className="text-sm text-gray-500">{order.products?.length || 0} items</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {orders?.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Truck className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <p className="font-medium">Delivery #{order._id.slice(-6)}</p>
                                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                                </div>
                                            </div>
                                            <Badge className={getStatusColor(order.orderStatus)}>
                                                {getOrderStatusText(order.orderStatus)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="active" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders?.filter(order => order.orderStatus === 'in_transit' || order.orderStatus === 'ready').map((order) => (
                                    <div key={order._id} className="p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Truck className="w-6 h-6 text-blue-500" />
                                                <div>
                                                    <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                    <p className="text-sm text-gray-600">{order.orderStatus}</p>
                                                    <p className="text-sm text-gray-500">{order.products?.length || 0} items</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{formatCurrency(order.totalAmount)}</p>
                                                <Badge className={getStatusColor(order.orderStatus)}>
                                                    {getOrderStatusText(order.orderStatus)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{order.deliveryAddress || 'Address not set'}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(order.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order._id, 'delivered')}>
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Navigation className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Phone className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completed" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders?.filter(order => order.orderStatus === 'delivered').map((order) => (
                                    <div key={order._id} className="p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                                <div>
                                                    <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                    <p className="text-sm text-gray-600">Delivered</p>
                                                    <p className="text-sm text-gray-500">{order.products?.length || 0} items</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{formatCurrency(order.totalAmount)}</p>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Delivered
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{order.deliveryAddress || 'Address not set'}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(order.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <User className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 