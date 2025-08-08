import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Clock, Truck, Edit, Eye, User } from 'lucide-react';
import { FarmerOrder } from '../types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';

interface OrderCardProps {
    order: FarmerOrder;
    showActions?: boolean;
}

export function OrderCard({ order, showActions = true }: OrderCardProps) {
    const StatusIcon = getStatusIcon(order.orderStatus);

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Package className="w-6 h-6 text-blue-500" />
                        <div>
                            <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                        {getOrderStatusText(order.orderStatus)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Total:</span>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(order.totalCost)}</p>
                        </div>
                        <div>
                            <span className="font-medium">Products:</span>
                            <p className="text-lg">{order.products.length} items</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Products:</h4>
                        <div className="space-y-1">
                            {order.products.map((product, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span>{product.name}</span>
                                    <span className="text-gray-600">
                                        {product.quantity} x {formatCurrency(product.price)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{order.deliveryAddress}</span>
                        </div>
                        {order.riderName && (
                            <div className="flex items-center space-x-1">
                                <Truck className="w-4 h-4" />
                                <span>{order.riderName}</span>
                            </div>
                        )}
                    </div>

                    {showActions && (
                        <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center space-x-2">
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-sm text-gray-600">{getOrderStatusText(order.orderStatus)}</span>
                            </div>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                    <User className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 