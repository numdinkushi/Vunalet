export interface OrderStats {
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    inTransit: number;
    delivered: number;
    totalRevenue: number;
}

export interface OrderProduct {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    products: OrderProduct[];
    totalCost: number;
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
    paymentStatus: 'paid' | 'pending' | 'failed';
    createdAt: string;
    deliveryAddress: string;
    estimatedDeliveryTime?: string;
    riderId?: string;
    riderName?: string;
    farmName: string;
}

export interface DashboardStats {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    totalSpent: number;
}

export interface StatCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: string | number;
    trend?: string;
    color: string;
}

export interface OrderCardProps {
    order: Order;
    showActions?: boolean;
}

export interface TabItem {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} 