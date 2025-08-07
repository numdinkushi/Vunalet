gi'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Leaf,
    Package,
    MapPin,
    Clock,
    Truck,
    Eye,
    Star,
    X,
    Calendar,
    CreditCard
} from 'lucide-react';
import { Order } from '../types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';

interface OrderModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderModal({ order, isOpen, onClose }: OrderModalProps) {
    if (!order) return null;

    const StatusIcon = getStatusIcon(order.orderStatus);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Order #{order._id.slice(-6)}</span>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        Order placed on {formatDate(order.createdAt)}
                    </DialogDescription>
                </DialogHeader>

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
                            <span className="font-bold text-lg">{formatCurrency(order.totalCost)}</span>
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

                            {order.estimatedDeliveryTime && (
                                <div className="flex items-center space-x-2 text-sm">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span className="font-medium">Estimated Delivery:</span>
                                    <span className="text-emerald-600">{order.estimatedDeliveryTime}</span>
                                </div>
                            )}

                            {order.riderName && (
                                <div className="flex items-center space-x-2 text-sm">
                                    <Truck className="w-4 h-4 text-blue-500" />
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <CreditCard className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">Payment Status</span>
                            </div>
                            <Badge
                                variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : ''}
                            >
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4">
                        <Button className="flex-1" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Track Order
                        </Button>

                        {order.orderStatus === 'pending' && (
                            <Button className="flex-1" variant="destructive">
                                Cancel Order
                            </Button>
                        )}

                        {order.orderStatus === 'delivered' && (
                            <Button className="flex-1" variant="outline">
                                <Star className="w-4 h-4 mr-2" />
                                Rate Order
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 