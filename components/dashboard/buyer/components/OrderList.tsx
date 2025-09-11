import { Order } from '../types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Store,
    Package,
    DollarSign,
    Calendar,
    ChevronRight,
    MapPin
} from 'lucide-react';

interface OrderListProps {
    title: string;
    orders: Order[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onRowClick?: (order: Order) => void;
}

export function OrderList({
    title,
    orders,
    searchTerm,
    onSearchChange,
    onRowClick
}: OrderListProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>

            <div className="space-y-4">
                {orders.map((order, index) => {
                    const StatusIcon = getStatusIcon(order.orderStatus);
                    return (
                        <div
                            key={order._id}
                            className="p-6 border border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-gradient-to-r from-white to-gray-50/30"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Package className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            Order #{order._id.slice(-6)}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <StatusIcon className="w-5 h-5 text-gray-400" />
                                    <Badge className={`${getStatusColor(order.orderStatus)}`}>
                                        {getOrderStatusText(order.orderStatus)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-sm">
                                    <Store className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-gray-700">Farm:</span>
                                    <span className="text-gray-900">{order.farmName}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Package className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-gray-700">Products:</span>
                                    <span className="text-gray-900">{order.products.length} items</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-gray-700">Total:</span>
                                    <span className="text-gray-900 font-semibold">{formatCurrency(order.totalCost, order.paymentMethod)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <MapPin className="w-4 h-4 text-red-600" />
                                    <span className="font-medium text-gray-700">Delivery:</span>
                                    <span className="text-gray-900 truncate">{order.deliveryAddress}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onRowClick?.(order)}
                                    className="flex items-center space-x-2 hover:bg-primary hover:text-white transition-colors"
                                >
                                    <span>View Details</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 