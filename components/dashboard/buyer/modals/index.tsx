'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Order } from '../types';
import { formatDate } from '../utils';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { useOrderCancellation } from '../../../../hooks/use-order-cancellation';
import { useOrderConfirmation } from '../../../../hooks/use-order-confirmation';
import { useRouter } from 'next/navigation';
import { OrderDetails } from './OrderDetails';
import { CancellationForm } from './CancellationForm';
import { RatingForm } from './RatingForm';
import { OrderActions } from './OrderActions';
import { OrderCompletionMessage } from './OrderCompletionMessage';

interface OrderModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    buyerLiskId?: string;
}

export function OrderModal({ order, isOpen, onClose, buyerLiskId }: OrderModalProps) {
    const router = useRouter();
    const createRating = useMutation(api.ratings.createRating);

    const [cancellationReason, setCancellationReason] = useState('');
    const [showCancellationForm, setShowCancellationForm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [canShowRating, setCanShowRating] = useState(false);
    const [farmerRating, setFarmerRating] = useState(0);
    const [dispatcherRating, setDispatcherRating] = useState(0);
    const [farmerComment, setFarmerComment] = useState('');
    const [dispatcherComment, setDispatcherComment] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    const { cancelOrder } = useOrderCancellation();
    const { confirmOrder } = useOrderConfirmation();

    if (!order) return null;

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
        if (!buyerLiskId) {
            toast.error('Payment account not found. Please contact support.');
            return;
        }

        setIsConfirming(true);
        try {
            const success = await confirmOrder({
                orderId: order._id,
                buyerId: order.buyerId || '',
                buyerLiskId: buyerLiskId,
                dispatcherId: order.dispatcherId || '',
                farmerId: order.farmerId || '',
                totalCost: order.totalCost,
                dispatcherAmount: order.dispatcherAmount || 0,
                farmerAmount: order.farmerAmount || 0,
            });

            if (success) {
                setCanShowRating(true);
            }
        } catch (error) {
            console.log('Failed to confirm order:', error);
            toast.error('Failed to confirm order');
        } finally {
            setIsConfirming(false);
        }
    };

    const handleSubmitRating = async () => {
        if (farmerRating === 0) {
            toast.error('Please rate the farmer');
            return;
        }

        setIsSubmittingRating(true);
        try {
            await createRating({
                orderId: order._id,
                farmerId: order.farmerId || '',
                dispatcherId: order.dispatcherId || undefined,
                buyerId: order.buyerId || '',
                farmerRating: farmerRating,
                dispatcherRating: dispatcherRating > 0 ? dispatcherRating : undefined,
                farmerComment: farmerComment.trim() || undefined,
                dispatcherComment: dispatcherComment.trim() || undefined,
            });

            toast.success('Thank you for your feedback!');
            onClose();
            router.push('/dashboard');
        } catch (error) {
            console.log('Failed to submit ratings:', error);
            toast.error('Failed to submit ratings. Please try again.');
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const handleSkipRating = () => {
        onClose();
        router.push('/dashboard');
    };

    // Render Rating Modal Content
    if (canShowRating) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            Rate Your Experience
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Help us improve by rating your recent order experience
                        </DialogDescription>
                    </DialogHeader>

                    <RatingForm
                        order={order}
                        farmerRating={farmerRating}
                        dispatcherRating={dispatcherRating}
                        farmerComment={farmerComment}
                        dispatcherComment={dispatcherComment}
                        onFarmerRatingChange={setFarmerRating}
                        onDispatcherRatingChange={setDispatcherRating}
                        onFarmerCommentChange={setFarmerComment}
                        onDispatcherCommentChange={setDispatcherComment}
                        onSubmit={handleSubmitRating}
                        onSkip={handleSkipRating}
                        isSubmitting={isSubmittingRating}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    // Render Order Modal Content
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
                    <OrderDetails order={order} />

                    {/* Cancellation Form */}
                    {showCancellationForm && (order.orderStatus === 'arrived' || order.orderStatus === 'delivered') && (
                        <>
                            <CancellationForm
                                order={order}
                                cancellationReason={cancellationReason}
                                onCancellationReasonChange={setCancellationReason}
                                onCancelBack={handleCancelBack}
                                onCancelConfirm={handleCancelConfirm}
                                isCancelling={isCancelling}
                            />
                        </>
                    )}

                    {/* Order Completion Message */}
                    <OrderCompletionMessage order={order} />

                    {/* Actions */}
                    {!showCancellationForm && (
                        <div className="flex justify-end space-x-2">
                            <OrderActions
                                order={order}
                                onCancelClick={handleCancelClick}
                                onConfirmOrder={handleConfirmOrder}
                                onClose={onClose}
                                isCancelling={isCancelling}
                                isConfirming={isConfirming}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 