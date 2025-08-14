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
    CheckCircle
} from 'lucide-react';
import { mockDispatcherStats, mockDispatcherOrders } from './data';
import { StatCard, DeliveryCard } from './components';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { LZC_TOKEN_NAME } from '../../../constants/tokens';

interface DispatcherDashboardProps {
    userProfile: {
        clerkUserId: string;
        liskId?: string;
    };
}

export function DispatcherDashboard({ userProfile }: DispatcherDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const { user } = useUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const balance = useQuery((api as unknown as any).balances.getUserBalance, {
        clerkUserId: user?.id || '',
        token: LZC_TOKEN_NAME,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertBalance = useMutation((api as unknown as any).balances.upsertUserBalance);

    useEffect(() => {
        if (!user?.id) return;

        const refreshBalances = async () => {
            try {
                const { walletService } = await import('../../../lib/services/wallet/wallet.service');
                const balances = await walletService.fetchBalances(userProfile?.liskId || user.id);

                await upsertBalance({
                    clerkUserId: user.id,
                    token: LZC_TOKEN_NAME,
                    walletBalance: balances.walletBalance,
                    ledgerBalance: balances.ledgerBalance,
                });
            } catch (error) {
                console.log('Failed to refresh balances:', error);
            }
        };

        refreshBalances();
    }, [user?.id, userProfile?.liskId]);

    const walletBalance = balance?.walletBalance ?? 0;
    const ledgerBalance = balance?.ledgerBalance ?? 0;

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
                orderStatus: status as "pending" | "confirmed" | "preparing" | "ready" | "in_transit" | "delivered" | "cancelled",
            });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const stats = mockDispatcherStats;
    const dispatcherOrders = mockDispatcherOrders;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={Truck}
                    title="Total Deliveries"
                    value={stats.totalDeliveries}
                    color="bg-blue-100 text-blue-600"
                    delay={0.1}
                />
                <StatCard
                    icon={Clock}
                    title="Active Deliveries"
                    value={stats.activeDeliveries}
                    color="bg-orange-100 text-orange-600"
                    delay={0.2}
                />
                <StatCard
                    icon={CheckCircle}
                    title="Completed"
                    value={stats.completedDeliveries}
                    color="bg-green-100 text-green-600"
                    delay={0.3}
                />
                <StatCard
                    icon={DollarSign}
                    title="Total Earnings"
                    value={`R ${stats.totalEarnings.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`}
                    color="bg-amber-100 text-amber-600"
                    delay={0.4}
                />
            </div>

            {/* Wallet & Ledger */}
            <WalletCard
                walletBalance={walletBalance}
                ledgerBalance={ledgerBalance}
            />

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
                                <CardTitle>Today&apos;s Deliveries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dispatcherOrders.slice(0, 3).map((order) => (
                                        <DeliveryCard key={order._id} order={order} showActions={false} />
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
                                    {dispatcherOrders.slice(0, 3).map((order) => (
                                        <DeliveryCard key={order._id} order={order} showActions={false} />
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
                                {dispatcherOrders.filter(order => order.orderStatus === 'in_transit' || order.orderStatus === 'ready').map((order) => (
                                    <DeliveryCard key={order._id} order={order} />
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
                                {dispatcherOrders.filter(order => order.orderStatus === 'delivered').map((order) => (
                                    <DeliveryCard key={order._id} order={order} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 