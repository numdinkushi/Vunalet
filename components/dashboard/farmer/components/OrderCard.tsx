import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Clock, Truck, Edit, Eye, User, ShoppingBag, DollarSign } from 'lucide-react';
import { TransformedOrder } from '../types/dashboard-types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';

interface OrderCardProps {
    order: TransformedOrder;
    showActions?: boolean;
}

export function OrderCard({ order, showActions = true }: OrderCardProps) {
    const StatusIcon = getStatusIcon(order.orderStatus);

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                        {getOrderStatusText(order.orderStatus)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Financial Summary */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-1">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-gray-700 text-sm">Total Revenue</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(order.totalCost)}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-1">
                                <ShoppingBag className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-gray-700 text-sm">Items</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{order.products.length}</p>
                        </div>
                    </div>
                </div>

                {/* Customer & Dispatcher Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Section */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-blue-900">Customer</h4>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-blue-800 font-medium">{order.customerName}</p>
                            <div className="flex items-center space-x-2 text-xs text-blue-600">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{order.deliveryAddress}</span>
                            </div>
                            {order.customerPhone && (
                                <div className="flex items-center space-x-2 text-xs text-blue-600">
                                    <span>📞 {order.customerPhone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dispatcher Section */}
                    {order.riderName && (
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Truck className="w-4 h-4 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-purple-900">Dispatcher</h4>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-purple-800 font-medium">{order.riderName}</p>
                                <div className="flex items-center space-x-2 text-xs text-purple-600">
                                    <Clock className="w-3 h-3" />
                                    <span>Assigned for delivery</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                        <ShoppingBag className="w-4 h-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Products</h4>
                    </div>
                    <div className="space-y-2">
                        {order.products.map((product: { name: string; quantity: number; price: number; }, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                                <span className="font-medium text-gray-900">{product.name}</span>
                                <div className="text-right">
                                    <span className="text-sm text-gray-600">
                                        {product.quantity} x {formatCurrency(product.price)}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        Total: {formatCurrency(product.quantity * product.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <StatusIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{getOrderStatusText(order.orderStatus)}</span>
                        </div>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                            </Button>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                                <Edit className="w-4 h-4 mr-1" />
                                Update
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 