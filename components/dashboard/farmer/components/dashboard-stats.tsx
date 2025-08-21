'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { DashboardStatsProps } from '../types/dashboard-types';

export function DashboardStats({ stats }: DashboardStatsProps) {
    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Active Orders',
            value: stats.activeOrders,
            icon: ShoppingCart,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Revenue',
            value: `R${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
} 