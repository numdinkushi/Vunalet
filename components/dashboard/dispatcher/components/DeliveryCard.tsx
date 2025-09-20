import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Eye, User, Phone, CheckCircle, Navigation } from 'lucide-react';
import { DispatcherOrder } from '../types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { AwaitingConfirmationMessage } from '../../shared/AwaitingConfirmationMessage';

interface DeliveryCardProps {
    order: DispatcherOrder;
    showActions?: boolean;
}

export function DeliveryCard({ order, showActions = true }: DeliveryCardProps) {
    const StatusIcon = getStatusIcon(order.orderStatus);
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

    const handleMarkAsArrived = async () => {
        try {
            await updateOrderStatus({
                orderId: order._id,
                orderStatus: 'arrived',
                actualDeliveryTime: new Date().toISOString(),
            });
            toast.success('Order marked as arrived successfully!');
        } catch (error) {
            console.error('Failed to mark order as arrived:', error);
            toast.error('Failed to mark order as arrived');
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Truck className="w-6 h-6 text-blue-500" />
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
                            <p className="text-lg font-bold text-green-600">{formatCurrency(order.totalCost, order.paymentMethod)}</p>
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
                                        {product.quantity} x {formatCurrency(product.price, order.paymentMethod)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">Address:</span>
                            </div>
                            <span className="text-right">{order.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">Customer:</span>
                            </div>
                            <span>{order.customerName}</span>
                        </div>
                        {order.riderName && (
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                    <Truck className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">Rider:</span>
                                </div>
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
                                    <Phone className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Navigation className="w-4 h-4" />
                                </Button>
                                {order.orderStatus === 'ready' && (
                                    <Button size="sm" variant="outline" className="text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Delivered Button for Pending/In Transit Orders */}
                    {(order.orderStatus === 'pending' || order.orderStatus === 'in_transit' || order.orderStatus === 'ready') && (
                        <div className="pt-3 border-t">
                            <Button
                                onClick={handleMarkAsArrived}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                                size="default"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Arrived
                            </Button>
                        </div>
                    )}

                    {/* Awaiting Confirmation Message for Arrived Orders */}
                    {order.orderStatus === 'arrived' && (
                        <AwaitingConfirmationMessage customerName={order.customerName} />
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 