import { Leaf, Package, MapPin, Clock, Truck, Eye, Star } from 'lucide-react';
import { OrderCardProps } from '../types';
import { getStatusColor, getStatusIcon, formatCurrency, formatDate, getOrderStatusText } from '../utils';

export function OrderCard({ order, showActions = false }: OrderCardProps) {
    const StatusIcon = getStatusIcon(order.orderStatus);

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-6)}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="ml-1 capitalize">{getOrderStatusText(order.orderStatus)}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Leaf className="w-4 h-4 mr-2 text-emerald-500" />
                        <span className="font-medium">{order.farmName}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <Package className="w-4 h-4 mr-2" />
                        <span>{order.products.length} items • {formatCurrency(order.totalCost, order.paymentMethod)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{order.deliveryAddress}</span>
                    </div>

                    {order.estimatedDeliveryTime && (
                        <div className="flex items-center text-sm text-emerald-600 font-medium">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Est. Delivery: {order.estimatedDeliveryTime}</span>
                        </div>
                    )}

                    {order.riderName && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Truck className="w-4 h-4 mr-2" />
                            <span>Rider: {order.riderName}</span>
                        </div>
                    )}
                </div>

                <div className="border-t pt-4">
                    <div className="flex gap-2">
                        <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                        </button>

                        {showActions && order.orderStatus === 'pending' && (
                            <button className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200">
                                Cancel
                            </button>
                        )}

                        {order.orderStatus === 'delivered' && (
                            <button className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center">
                                <Star className="w-4 h-4 mr-1" />
                                Rate
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 