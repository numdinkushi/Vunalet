export interface DispatcherStats {
    totalDeliveries: number;
    activeDeliveries: number;
    completedDeliveries: number;
    totalEarnings: number;
}

export interface DispatcherOrder {
    _id: string;
    products: OrderProduct[];
    totalCost: number;
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';
    paymentStatus: 'paid' | 'pending' | 'failed';
    createdAt: string;
    deliveryAddress: string;
    estimatedDeliveryTime?: string;
    riderName?: string;
    farmName: string;
    customerName: string;
    customerPhone: string;
}

export interface OrderProduct {
    name: string;
    quantity: number;
    price: number;
}

export interface StatCardProps {
    icon: React.ComponentType<any>;
    title: string;
    value: string | number;
    trend?: string;
    color: string;
}

export interface DeliveryCardProps {
    order: DispatcherOrder;
    showActions?: boolean;
}

export interface TabItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
} 