'use client';

import { motion } from 'framer-motion';
import { Star, Heart, MapPin, ShoppingCart, Clock, Thermometer, Snowflake, Package } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { VideoBackground } from '../../ui/VideoBackground';
import { getExpiryStatus, getDaysUntilExpiry } from '../../../lib/utils/product-utils';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        images: string[];
        isFeatured?: boolean;
        farmerId: string;
        location: string;
        price: number;
        unit: string;
        quantity: number;
        expiryDate?: string;
        storageMethod?: 'room_temp' | 'refrigerated' | 'frozen';
        harvestDate: string;
    };
    index?: number;
    currentImageIndex?: number;
    farmers?: Array<{
        clerkUserId: string;
        firstName: string;
    }>;
    showVideoBackground?: boolean;
}

export function ProductCard({
    product,
    index = 0,
    currentImageIndex = 0,
    farmers,
    showVideoBackground = true
}: ProductCardProps) {
    const { user } = useUser();
    const router = useRouter();
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    const farmerName = farmers?.find(f => f.clerkUserId === product.farmerId)?.firstName || 'Unknown Farmer';
    const isBuyer = userProfile?.role === 'buyer';
    const hasNoRole = !userProfile?.role;
    const isSignedInButNoProfile = user && userProfile === null;

    const handlePurchaseClick = () => {
        if (isBuyer) {
            // Buyer can proceed to product page
            router.push(`/products/${product._id}`);
        } else if (hasNoRole || isSignedInButNoProfile) {
            // User with no role or no profile gets redirected to dashboard (which will redirect to registration)
            router.push('/dashboard');
        }
        // Other roles (farmer, dispatcher) won't see the button
    };

    const getStorageMethodIcon = (method?: string) => {
        switch (method) {
            case 'refrigerated':
                return <Thermometer className="w-4 h-4" />;
            case 'frozen':
                return <Snowflake className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const getStorageMethodLabel = (method?: string) => {
        switch (method) {
            case 'refrigerated':
                return 'Refrigerated';
            case 'frozen':
                return 'Frozen';
            default:
                return 'Room Temp';
        }
    };

    const getExpiryStatusColor = (expiryDate?: string) => {
        if (!expiryDate) return 'text-gray-500';
        const status = getExpiryStatus(expiryDate);
        switch (status) {
            case 'expired':
                return 'text-red-500';
            case 'expiring_soon':
                return 'text-orange-500';
            default:
                return 'text-green-500';
        }
    };

    const getExpiryStatusText = (expiryDate?: string) => {
        if (!expiryDate) return 'No expiry date';
        const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
        if (daysUntilExpiry < 0) return 'Expired';
        if (daysUntilExpiry <= 3) return `Expires in ${daysUntilExpiry} days`;
        return `Expires in ${daysUntilExpiry} days`;
    };

    return (
        <motion.div
            key={product._id}
            className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
        >
            {/* Product Image */}
            <div className="relative h-64 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <Image
                        src={product.images[currentImageIndex] || product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Featured Badge */}
                {product.isFeatured && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Featured
                        </span>
                    </div>
                )}

                {/* Heart Icon */}
                <div className="absolute top-4 right-4 z-10">
                    <motion.button
                        className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Heart size={16} className="text-gray-600" />
                    </motion.button>
                </div>
            </div>

            {/* Video Background for Product Content */}
            {showVideoBackground && (
                <div className="absolute bottom-0 left-0 right-0 top-64 pointer-events-none z-0">
                    <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
                </div>
            )}

            {/* Content */}
            <div className={`relative p-6 ${showVideoBackground ? 'bg-transparent backdrop-blur-sm z-10' : 'bg-gradient-to-br from-white to-gray-50'}`}>
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold ${showVideoBackground ? 'text-white group-hover:text-green-300' : 'text-gray-900 group-hover:text-green-600'} transition-colors duration-300`}>
                        {product.name}
                    </h3>
                    <div className={`flex items-center ${showVideoBackground ? 'bg-yellow-500/30 backdrop-blur-sm' : 'bg-yellow-500/30'} px-2 py-1 rounded-full`}>
                        <Star className={`${showVideoBackground ? 'text-yellow-300' : 'text-yellow-500'} fill-current`} size={16} />
                        <span className={`text-sm font-semibold ${showVideoBackground ? 'text-yellow-200' : 'text-yellow-600'} ml-1`}>4.8</span>
                    </div>
                </div>

                <p className={`${showVideoBackground ? 'text-gray-200' : 'text-gray-600'} mb-3`}>By {farmerName}</p>
                <div className={`flex items-center ${showVideoBackground ? 'text-gray-300' : 'text-gray-500'} mb-4`}>
                    <MapPin size={16} />
                    <span className="ml-1 text-sm">{product.location}</span>
                </div>

                {/* Expiry Date and Storage Method */}
                <div className="space-y-2 mb-4">
                    {product.expiryDate && (
                        <div className="flex items-center space-x-2">
                            <Clock className={`w-4 h-4 ${getExpiryStatusColor(product.expiryDate)}`} />
                            <span className={`text-sm ${getExpiryStatusColor(product.expiryDate)}`}>
                                {getExpiryStatusText(product.expiryDate)}
                            </span>
                        </div>
                    )}
                    {product.storageMethod && (
                        <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 ${showVideoBackground ? 'text-blue-300' : 'text-blue-600'}`}>
                                {getStorageMethodIcon(product.storageMethod)}
                            </div>
                            <span className={`text-sm ${showVideoBackground ? 'text-blue-300' : 'text-blue-600'}`}>
                                {getStorageMethodLabel(product.storageMethod)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className={`text-2xl font-bold ${showVideoBackground ? 'text-green-300' : 'text-green-600'}`}>
                        R{product.price}
                        <span className={`text-sm ${showVideoBackground ? 'text-gray-300' : 'text-gray-500'} font-normal`}>/{product.unit}</span>
                    </div>
                    <div className={`text-sm ${showVideoBackground ? 'text-gray-300' : 'text-gray-500'}`}>
                        {product.quantity} {product.unit} available
                    </div>
                </div>

                {/* Show Purchase button for buyers and users with no role */}
                {(isBuyer || hasNoRole || isSignedInButNoProfile) && (
                    <motion.button
                        onClick={handlePurchaseClick}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ShoppingCart className="mr-2" size={20} />
                        {isBuyer ? 'Purchase' : isSignedInButNoProfile ? 'Complete Profile' : 'Set Up Account'}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
} 