'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Leaf,
    Package,
    MapPin,
    Clock,
    Truck,
    CreditCard,
} from 'lucide-react';
import { Order } from '../types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';

interface OrderDetailsProps {
    order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const StatusIcon = getStatusIcon(order.orderStatus);

    return (
        <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4" />
                    <span className="font-medium">Status</span>
                </div>
                <Badge className={getStatusColor(order.orderStatus)}>
                    {getOrderStatusText(order.orderStatus)}
                </Badge>
            </div>

            <Separator />

            {/* Farm Information */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Farm Information</h3>
                <div className="flex items-center space-x-2 text-sm">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{order.farmName}</span>
                </div>
            </div>

            <Separator />

            {/* Products */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Products</h3>
                <div className="space-y-2">
                    {order.products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Package className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">{product.name}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Qty: {product.quantity}</span>
                                <span>{formatCurrency(product.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(order.totalCost, order.paymentMethod)}</span>
                </div>
            </div>

            <Separator />

            {/* Delivery Information */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Delivery Information</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Address:</span>
                        <span>{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Estimated Delivery:</span>
                        <span>{order.estimatedDeliveryTime ? formatDate(order.estimatedDeliveryTime) : 'Not set'}</span>
                    </div>
                    {order.riderName && (
                        <div className="flex items-center space-x-2 text-sm">
                            <Truck className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Rider:</span>
                            <span>{order.riderName}</span>
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Payment Information</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                            {order.paymentStatus}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
} 