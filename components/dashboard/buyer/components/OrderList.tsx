import { Order } from '../types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';
import { Badge } from '@/components/ui/badge';

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
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>

            <div className="space-y-4">
                {orders.map((order, index) => (
                    <div
                        key={order._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => onRowClick?.(order)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Order #{order._id.slice(-6)}</div>
                            <div className="text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Farm:</span> {order.farmName}
                            </div>
                            <div>
                                <span className="font-medium">Products:</span> {order.products.length} items
                            </div>
                            <div>
                                <span className="font-medium">Total:</span> {formatCurrency(order.totalCost)}
                            </div>
                            <div>
                                <span className="font-medium">Status:</span>
                                <Badge className={`ml-2 ${getStatusColor(order.orderStatus)}`}>
                                    {getOrderStatusText(order.orderStatus)}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 