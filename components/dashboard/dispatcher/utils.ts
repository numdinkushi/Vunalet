import { Clock, CheckCircle, Package, Truck, X } from 'lucide-react';

// Constants for CELO conversion
const ZAR_TO_CELO = 0.003;

// Helper function
const convertZarToCelo = (zarAmount: number): number => {
    return Number((zarAmount * ZAR_TO_CELO).toFixed(6));
};

export const formatCurrency = (amount: number, paymentMethod?: 'lisk_zar' | 'celo' | 'cash') => {
    if (paymentMethod === 'celo') {
        const celoAmount = convertZarToCelo(amount);
        return `${celoAmount.toFixed(6)} CELO`;
    }

    // Default to ZAR for lisk_zar and cash
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

export const getStatusColor = (status: string) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-orange-100 text-orange-800',
        ready: 'bg-purple-100 text-purple-800',
        in_transit: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const getOrderStatusText = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
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