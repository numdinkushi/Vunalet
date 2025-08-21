import { StorageMethod } from '../../../../lib/utils/product-utils';

// User profile interface
export interface FarmerUserProfile {
    clerkUserId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'farmer';
    liskId?: string;
    specialties?: string[];
}

// New product interface
export interface NewProduct {
    name: string;
    categoryId: string;
    price: number;
    unit: string;
    quantity: number;
    description: string;
    harvestDate: string;
    storageMethod: StorageMethod;
    location: string;
    isOrganic: boolean;
    isFeatured: boolean;
    images: string[];
}

// Convex order interface
export interface ConvexOrder {
    _id: string;
    buyerId: string;
    farmerId: string;
    dispatcherId?: string;
    products: Array<{
        name: string;
        quantity: number;
        price: number;
        unit: string;
        productId: string;
    }>;
    totalCost: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: number;
    deliveryAddress: string;
    estimatedDeliveryTime?: string;
    buyerInfo?: {
        firstName: string;
        lastName: string;
        phone?: string;
    } | null;
    farmerInfo?: {
        firstName: string;
        lastName: string;
        businessName?: string;
    } | null;
    dispatcherInfo?: {
        firstName: string;
        lastName: string;
    } | null;
}

// Transformed order interface
export interface TransformedOrder {
    _id: string;
    products: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totalCost: number;
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
    deliveryAddress: string;
    estimatedDeliveryTime?: string;
    customerName: string;
    customerPhone: string;
    farmName: string;
    riderName?: string;
}

// Dashboard stats interface
export interface DashboardStats {
    totalProducts: number;
    activeOrders: number;
    totalRevenue: number;
    pendingOrders: number;
}

// Props interfaces
export interface FarmerDashboardProps {
    userProfile: FarmerUserProfile;
}

export interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: FarmerUserProfile;
    onProductAdded: () => void;
}

export interface DashboardStatsProps {
    stats: DashboardStats;
}

export interface RecentProductsProps {
    products: any[];
    onProductDeleted: () => void;
}

export interface RecentOrdersProps {
    orders: TransformedOrder[];
} 