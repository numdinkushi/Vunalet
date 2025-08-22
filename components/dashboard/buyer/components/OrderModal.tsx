'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    CreditCard,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Order } from '../types';
import { formatCurrency, formatDate, getOrderStatusText, getStatusColor, getStatusIcon } from '../utils';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { useOrderCancellation } from '../../../../hooks/use-order-cancellation';

interface OrderModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    buyerLiskId?: string; // Add buyer's liskId prop
}

export function OrderModal({ order, isOpen, onClose, buyerLiskId }: OrderModalProps) {
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
    const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
    const [cancellationReason, setCancellationReason] = useState('');
    const [showCancellationForm, setShowCancellationForm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const { cancelOrder } = useOrderCancellation();

    if (!order) return null;

    const StatusIcon = getStatusIcon(order.orderStatus);

    const handleCancelClick = () => {
        setShowCancellationForm(true);
    };

    const handleCancelConfirm = async () => {
        if (!cancellationReason.trim()) {
            toast.error('Please provide a reason for cancellation');
            return;
        }

        if (!buyerLiskId) {
            toast.error('Payment account not found. Please contact support.');
            return;
        }

        setIsCancelling(true);
        try {
            const success = await cancelOrder({
                orderId: order._id,
                buyerId: order.buyerId || '',
                buyerLiskId: buyerLiskId,
                dispatcherId: order.dispatcherId || '',
                farmerId: order.farmerId || '',
                totalCost: order.totalCost,
                dispatcherAmount: order.dispatcherAmount || 0,
                farmerAmount: order.farmerAmount || 0,
                reason: cancellationReason.trim()
            });

            if (success) {
                setCancellationReason('');
                setShowCancellationForm(false);
                onClose();
            }
        } finally {
            setIsCancelling(false);
        }
    };

    const handleCancelBack = () => {
        setShowCancellationForm(false);
        setCancellationReason('');
    };

    const handleConfirmOrder = async () => {
        setIsConfirming(true);
        try {
            console.log('Order confirmed:', order._id);
            // TODO: Implement confirmation logic
            toast.success('Order confirmed!');
            onClose();
        } catch (error) {
            console.error('Failed to confirm order:', error);
            toast.error('Failed to confirm order');
        } finally {
            setIsConfirming(false);
        }
    };

    const handleApproveOrder = async () => {
        setIsApproving(true);
        try {
            await updatePaymentStatus({
                orderId: order._id,
                paymentStatus: 'paid',
            });
            toast.success('Order approved and payment completed!');
            onClose();
        } catch (error) {
            console.error('Failed to approve order:', error);
            toast.error('Failed to approve order');
        } finally {
            setIsApproving(false);
        }
    };

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

                    <Separator />

                    {/* Cancellation Warning and Form (only when showCancellationForm is true) */}
                    {showCancellationForm && (order.orderStatus === 'arrived' || order.orderStatus === 'delivered') && (
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-3">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <h3 className="font-semibold text-red-800">Cancellation Warning</h3>
                                </div>
                                <div className="text-sm text-red-700 space-y-2">
                                    <p><strong>You will lose the following amounts if you cancel:</strong></p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Dispatcher refund: R {((order.dispatcherAmount || 0) / 2).toFixed(2)}</li>
                                        <li>Farmer refund: R {((order.farmerAmount || 0) / 2).toFixed(2)}</li>
                                    </ul>
                                    <p className="mt-3 font-medium">Total amount you will lose: R {(((order.dispatcherAmount || 0) + (order.farmerAmount || 0)) / 2).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="cancellationReason" className="text-sm font-medium text-gray-700">
                                    Why are you cancelling this order? *
                                </Label>
                                <Input
                                    id="cancellationReason"
                                    value={cancellationReason}
                                    onChange={(e) => setCancellationReason(e.target.value)}
                                    placeholder="Please provide a reason for cancellation..."
                                    className="w-full"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancelBack}
                                    disabled={isCancelling}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleCancelConfirm}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    disabled={!cancellationReason.trim() || isCancelling}
                                >
                                    {isCancelling ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Proceed with Cancellation
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Actions */}
                    {!showCancellationForm && (
                        <div className="flex justify-end space-x-2">
                            {order.orderStatus === 'arrived' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelClick}
                                        className="text-red-600 hover:text-red-700"
                                        disabled={isCancelling}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirmOrder}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isConfirming}
                                    >
                                        {isConfirming ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Confirming...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Confirm
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : order.orderStatus === 'delivered' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelClick}
                                        className="text-red-600 hover:text-red-700"
                                        disabled={isCancelling}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleApproveOrder}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isApproving}
                                    >
                                        {isApproving ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Approving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Approve
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Track Order
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 