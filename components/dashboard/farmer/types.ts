export interface FarmerStats {
    totalProducts: number;
    activeOrders: number;
    totalRevenue: number;
    averageRating: number;
}

export interface Product {
    _id: string;
    name: string;
    categoryId: string;
    category?: {
        name: string;
        categoryId: string;
    };
    price: number;
    unit: string;
    quantity: number;
    description?: string;
    harvestDate: string;
    expiryDate?: string;
    storageMethod?: 'room_temp' | 'refrigerated' | 'frozen';
    location: string;
    isOrganic: boolean;
    isFeatured: boolean;
    status: 'active' | 'inactive';
    images: string[];
}

export interface FarmerOrder {
    _id: string;
    products: OrderProduct[];
    totalCost: number;
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
    paymentStatus: 'paid' | 'pending' | 'failed';
    paymentMethod: 'lisk_zar' | 'celo' | 'cash';
    createdAt: string;
    deliveryAddress: string;
    estimatedDeliveryTime?: string;
    riderName?: string;
    farmName: string;
}

export interface OrderProduct {
    name: string;
    quantity: number;
    price: number;
}

export interface StatCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: string | number;
    trend?: string;
    color: string;
}

export interface ProductCardProps {
    product: Product;
    showActions?: boolean;
}

export interface OrderCardProps {
    order: FarmerOrder;
    showActions?: boolean;
}

export interface TabItem {
    id: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} 