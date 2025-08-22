'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Leaf, Truck } from 'lucide-react';
import { Order } from '../types';

interface RatingFormProps {
    order: Order;
    farmerRating: number;
    dispatcherRating: number;
    farmerComment: string;
    dispatcherComment: string;
    onFarmerRatingChange: (rating: number) => void;
    onDispatcherRatingChange: (rating: number) => void;
    onFarmerCommentChange: (comment: string) => void;
    onDispatcherCommentChange: (comment: string) => void;
    onSubmit: () => void;
    onSkip: () => void;
    isSubmitting: boolean;
}

export function RatingForm({
    order,
    farmerRating,
    dispatcherRating,
    farmerComment,
    dispatcherComment,
    onFarmerRatingChange,
    onDispatcherRatingChange,
    onFarmerCommentChange,
    onDispatcherCommentChange,
    onSubmit,
    onSkip,
    isSubmitting
}: RatingFormProps) {
    const renderStars = (rating: number, type: 'farmer' | 'dispatcher') => {
        const handleStarClick = (starRating: number) => {
            if (type === 'farmer') {
                onFarmerRatingChange(starRating);
            } else {
                onDispatcherRatingChange(starRating);
            }
        };

        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
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
        <div className="space-y-8">
            {/* Farmer Rating */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    <Label className="text-lg font-semibold">
                        Rate {order.farmName} (Farmer)
                    </Label>
                </div>

                <div className="space-y-3">
                    {renderStars(farmerRating, 'farmer')}

                    <div className="space-y-2">
                        <Label htmlFor="farmer-comment" className="text-sm text-gray-600">
                            Additional comments (optional)
                        </Label>
                        <Input
                            id="farmer-comment"
                            value={farmerComment}
                            onChange={(e) => onFarmerCommentChange(e.target.value)}
                            placeholder="Share your experience with the farm produce..."
                            className="min-h-[80px]"
                        />
                    </div>
                </div>
            </div>

            {/* Dispatcher Rating - Only show if dispatcher exists */}
            {order.riderName && order.dispatcherId && order.dispatcherId !== undefined && (
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-blue-500" />
                        <Label className="text-lg font-semibold">
                            Rate {order.riderName} (Dispatcher)
                        </Label>
                    </div>

                    <div className="space-y-3">
                        {renderStars(dispatcherRating, 'dispatcher')}

                        <div className="space-y-2">
                            <Label htmlFor="dispatcher-comment" className="text-sm text-gray-600">
                                Additional comments (optional)
                            </Label>
                            <Input
                                id="dispatcher-comment"
                                value={dispatcherComment}
                                onChange={(e) => onDispatcherCommentChange(e.target.value)}
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
                    onClick={onSkip}
                    disabled={isSubmitting}
                >
                    Skip Rating
                </Button>
                <Button
                    onClick={onSubmit}
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
    );
} 