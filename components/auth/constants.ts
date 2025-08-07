import { User, Truck, ShoppingCart } from 'lucide-react';
import { RoleConfig } from './types';

export const roleConfig: Record<'farmer' | 'dispatcher' | 'buyer', RoleConfig> = {
    farmer: {
        title: 'Farmer',
        description: 'Sell your fresh produce directly to customers',
        icon: User,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
    },
    dispatcher: {
        title: 'Dispatcher',
        description: 'Deliver orders and earn from deliveries',
        icon: Truck,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
    buyer: {
        title: 'Buyer',
        description: 'Purchase fresh produce from local farmers',
        icon: ShoppingCart,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
    },
}; 