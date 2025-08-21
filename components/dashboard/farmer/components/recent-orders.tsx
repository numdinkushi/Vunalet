'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { OrderCard } from './OrderCard';
import { RecentOrdersProps } from '../types/dashboard-types';

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                        <OrderCard key={order._id} order={order} showActions={false} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 