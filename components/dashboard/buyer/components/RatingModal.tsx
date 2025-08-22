'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Truck, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    farmerName: string;
    dispatcherName?: string;
    farmerId: string;
    dispatcherId?: string | undefined;
}

export function RatingModal({
    isOpen,
    onClose,
    orderId,
    farmerName,
    dispatcherName,
    farmerId,
    dispatcherId
}: RatingModalProps) {
    const router = useRouter();
    const createRating = useMutation(api.ratings.createRating);

    const [farmerRating, setFarmerRating] = useState(0);
    const [dispatcherRating, setDispatcherRating] = useState(0);
    const [farmerComment, setFarmerComment] = useState('');
    const [dispatcherComment, setDispatcherComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStarClick = (rating: number, type: 'farmer' | 'dispatcher') => {
        if (type === 'farmer') {
            setFarmerRating(rating);
        } else {
            setDispatcherRating(rating);
        }
    };

    const handleSubmit = async () => {
        if (farmerRating === 0) {
            toast.error('Please rate the farmer');
            return;
        }

        setIsSubmitting(true);
        try {
            const ratings = [];

            // Create farmer rating
            ratings.push(
                createRating({
                    orderId,
                    ratedUserId: farmerId,
                    raterRole: 'buyer',
                    ratedRole: 'farmer',
                    rating: farmerRating,
                    comment: farmerComment.trim() || undefined,
                })
            );

            // Create dispatcher rating if dispatcher exists and was rated
            if (dispatcherId && dispatcherRating > 0) {
                ratings.push(
                    createRating({
                        orderId,
                        ratedUserId: dispatcherId,
                        raterRole: 'buyer',
                        ratedRole: 'dispatcher',
                        rating: dispatcherRating,
                        comment: dispatcherComment.trim() || undefined,
                    })
                );
            }

            await Promise.all(ratings);

            toast.success('Thank you for your feedback!');
            onClose();

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.log('Failed to submit ratings:', error);
            toast.error('Failed to submit ratings. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        onClose();
        // Redirect to dashboard
        router.push('/dashboard');
    };

    const renderStars = (rating: number, type: 'farmer' | 'dispatcher') => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star, type)}
                        className={`p-1 transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400`}
                    >
                        <Star className="w-6 h-6 fill-current" />
                    </button>
                ))}
            </div>
        );
    };

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

                <div className="space-y-8">
                    {/* Farmer Rating */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Leaf className="w-5 h-5 text-emerald-500" />
                            <Label className="text-lg font-semibold">
                                Rate {farmerName} (Farmer)
                            </Label>
                        </div>

                        <div className="space-y-3">
                            {renderStars(farmerRating, 'farmer')}

                            <div className="space-y-2">
                                <Label htmlFor="farmer-comment" className="text-sm text-gray-600">
                                    Additional comments (optional)
                                </Label>
                                <Textarea
                                    id="farmer-comment"
                                    value={farmerComment}
                                    onChange={(e) => setFarmerComment(e.target.value)}
                                    placeholder="Share your experience with the farm produce..."
                                    className="min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dispatcher Rating - Only show if dispatcher exists */}
                    {dispatcherName && dispatcherId && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Truck className="w-5 h-5 text-blue-500" />
                                <Label className="text-lg font-semibold">
                                    Rate {dispatcherName} (Dispatcher)
                                </Label>
                            </div>

                            <div className="space-y-3">
                                {renderStars(dispatcherRating, 'dispatcher')}

                                <div className="space-y-2">
                                    <Label htmlFor="dispatcher-comment" className="text-sm text-gray-600">
                                        Additional comments (optional)
                                    </Label>
                                    <Textarea
                                        id="dispatcher-comment"
                                        value={dispatcherComment}
                                        onChange={(e) => setDispatcherComment(e.target.value)}
                                        placeholder="Share your experience with the delivery service..."
                                        className="min-h-[80px]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleSkip}
                            disabled={isSubmitting}
                        >
                            Skip Rating
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || farmerRating === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Rating'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 