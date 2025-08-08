import { ShoppingCart, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import { DashboardStats } from '../types';

interface StatsGridProps {
    stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                icon={ShoppingCart}
                title="Total Orders"
                value={stats.totalOrders}
                trend="+12% this month"
                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
                icon={Clock}
                title="Active Orders"
                value={stats.activeOrders}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
                icon={CheckCircle}
                title="Completed"
                value={stats.completedOrders}
                trend="+8% this week"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
                icon={DollarSign}
                title="Total Spent"
                value={`R ${stats.totalSpent.toLocaleString()}`}
                trend="+R 450 this month"
                color="bg-gradient-to-br from-amber-500 to-amber-600"
            />
        </div>
    );
} 