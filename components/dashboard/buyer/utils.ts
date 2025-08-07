import { Clock, CheckCircle, Package, Truck, X } from 'lucide-react';
import { Order } from './types';

export const getStatusColor = (status: string) => {
    const colors = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
        preparing: 'bg-orange-50 text-orange-700 border-orange-200',
        ready: 'bg-purple-50 text-purple-700 border-purple-200',
        in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const getStatusIcon = (status: string) => {
    const icons = {
        pending: Clock,
        confirmed: CheckCircle,
        preparing: Package,
        ready: CheckCircle,
        in_transit: Truck,
        delivered: CheckCircle,
        cancelled: X
    };
    return icons[status as keyof typeof icons] || Clock;
};

export const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getOrderStatusText = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
};

export const filterOrdersByStatus = (orders: Order[], statuses: string[]) => {
    return orders.filter(order => statuses.includes(order.orderStatus));
};

export const searchOrders = (orders: Order[], searchTerm: string) => {
    if (!searchTerm) return orders;

    return orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
}; 