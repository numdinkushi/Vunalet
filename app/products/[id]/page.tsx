
'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { getDistance } from 'geolib';
import { api } from '../../../convex/_generated/api';
import { VideoBackground } from '../../../components/ui/VideoBackground';
import { ProductDetailCard } from '../../../components/app/cards/product-detail';
import { DeliveryMap } from '../../../components/app/maps/delivery-map/index';
import { PurchaseFormData } from '../../../app/types';
import Link from 'next/link';
import { DELIVERY_CONSTANTS } from '../../../constants/delivery';
import { useOrderManagement } from '../../../hooks/use-order-management';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string; }>; }) {
    // Unwrap params using React.use()
    const { id } = use(params);
    const { user, isLoaded } = useUser();

    const [formData, setFormData] = useState<PurchaseFormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        quantity: 1,
        deliveryDistance: 0,
        deliveryCost: 0,
        totalCost: 0
    });
    const [isCalculating, setIsCalculating] = useState(false);

    // Get product from database
    const product = useQuery(api.products.getProductById, { productId: id });

    // Get farmer profile if product exists
    const farmer = useQuery(
        api.users.getUserProfile,
        { clerkUserId: product?.farmerId || "" }
    );

    // Get current user's profile
    const userProfile = useQuery(
        api.users.getUserProfile,
        { clerkUserId: user?.id || "" }
    );

    // Auto-populate form with user data when available
    useEffect(() => {
        if (user && userProfile && isLoaded) {
            setFormData(prev => ({
                ...prev,
                name: `${userProfile.firstName} ${userProfile.lastName}`,
                email: user.emailAddresses[0]?.emailAddress || '',
                phone: userProfile.phone || '',
                address: userProfile.addressFull || userProfile.address || '',
            }));
        }
    }, [user, userProfile, isLoaded]);

    useEffect(() => {
        if (product) {
            calculateDeliveryCost();
        }
    }, [product, formData.address, formData.quantity, farmer, userProfile]);

    const calculateDeliveryCost = async () => {
        if (!product || !formData.address) return;

        setIsCalculating(true);
        try {
            let distance = 0;

            // Get farmer coordinates from farmer profile
            const farmerCoords = farmer?.coordinates;

            // Get customer coordinates from user profile
            const customerCoords = userProfile?.coordinates;

            console.log('Farmer coords:', farmerCoords);
            console.log('Customer coords:', customerCoords);

            if (farmerCoords && customerCoords &&
                typeof farmerCoords.lat === 'number' &&
                typeof farmerCoords.lng === 'number' &&
                typeof customerCoords.lat === 'number' &&
                typeof customerCoords.lng === 'number') {

                // Calculate actual distance using geolib
                const distanceInMeters = getDistance(
                    { latitude: farmerCoords.lat, longitude: farmerCoords.lng },
                    { latitude: customerCoords.lat, longitude: customerCoords.lng }
                );

                distance = Math.round((distanceInMeters / 1000) * 10) / 10; // Convert to km and round to 1 decimal

                console.log('Calculated distance:', distance, 'km');
            } else {
                console.log('Missing coordinates, using fallback');
                // Fallback to a reasonable default distance
                distance = 25; // Default 25km instead of random
            }

            const deliveryCost = distance * DELIVERY_CONSTANTS.COST_PER_KM; // 0.005 lisk per km
            const totalCost = (product.price * formData.quantity) + deliveryCost;

            setFormData(prev => ({
                ...prev,
                deliveryDistance: distance,
                deliveryCost,
                totalCost
            }));
        } catch (error) {
            console.error('Error calculating delivery cost:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 1 : value
        }));
    };

    const { initiateOrder, isProcessing } = useOrderManagement();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!product) {
            toast.error('Product not found');
            return;
        }

        if (!user) {
            toast.error('Please sign in to place an order');
            return;
        }

        if (!userProfile) {
            toast.error('Please complete your profile to place an order');
            return;
        }

        if (!farmer) {
            toast.error('Farmer information not available');
            return;
        }

        // Check if requested quantity is available
        if (formData.quantity > product.quantity) {
            toast.error(`Only ${product.quantity} ${product.unit} available`);
            return;
        }

        // Check if product is out of stock
        if (product.quantity <= 0) {
            toast.error('This product is currently out of stock');
            return;
        }

        const totalAmount = product.price * formData.quantity;
        const farmerAmount = totalAmount; // Product cost goes to farmer
        const dispatcherAmount = formData.deliveryCost; // Delivery cost goes to dispatcher

        // Calculate estimated times
        const estimatedPickupTime = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes from now
        const estimatedDeliveryTime = new Date(Date.now() + (30 + formData.deliveryDistance * 2) * 60 * 1000).toISOString(); // 30 min + 2 min per km

        const orderData = {
            buyerId: user.id,
            farmerId: product.farmerId,
            products: [{
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: formData.quantity,
                unit: product.unit,
            }],
            totalAmount,
            farmerAmount,
            dispatcherAmount,
            deliveryAddress: formData.address,
            deliveryCoordinates: userProfile.coordinates,
            pickupLocation: product.location || "Farm Location",
            pickupCoordinates: product.coordinates,
            deliveryDistance: formData.deliveryDistance,
            deliveryCost: formData.deliveryCost,
            totalCost: formData.totalCost,
            paymentMethod: "lisk_zar" as const,
            specialInstructions: formData.specialInstructions,
            estimatedPickupTime,
            estimatedDeliveryTime,
        };

        await initiateOrder(orderData);
    };

    // Show loading state
    if (product === undefined || !isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold text-gray-600 mb-4">Loading product...</h1>
                    <Link href="/products" className="text-green-600 hover:text-green-700">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    // Show error for product not found
    if (product === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-600 mb-4">Product Not Found</h1>
                    <p className="text-gray-500 mb-6">
                        The product you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link href="/products" className="text-green-600 hover:text-green-700">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    // Show authentication prompt for unauthenticated users
    if (!user) {
        return (
            <div className="min-h-screen relative">
                <div className="absolute inset-0 z-0">
                    <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
                </div>
                <div className="relative z-10 py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <Link href="/products">
                            <motion.button
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ x: -5 }}
                                className="flex items-center space-x-2 text-white mb-8 hover:text-green-300 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back to Products</span>
                            </motion.button>
                        </Link>

                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
                                <p className="text-gray-600 mb-6">
                                    Please sign in to view product details and make purchases.
                                </p>
                                <Link href="/sign-in">
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300">
                                        Sign In
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
            </div>

            <div className="relative z-10 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Back Button */}
                    <Link href="/products">
                        <motion.button
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: -5 }}
                            className="flex items-center space-x-2 text-white mb-8 hover:text-green-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Products</span>
                        </motion.button>
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Card - Product Details & Purchase Form */}
                        <ProductDetailCard
                            product={product}
                            farmer={farmer}
                            formData={formData}
                            isCalculating={isCalculating}
                            isProcessing={isProcessing} // Pass the processing state
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                        />

                        {/* Right Card - Map */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="h-full"
                        >
                            <DeliveryMap
                                farmerLocation={product.location}
                                customerAddress={formData.address}
                                customerCoordinates={userProfile?.coordinates}
                                deliveryDistance={formData.deliveryDistance}
                                deliveryCost={formData.deliveryCost}
                                className="h-full"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 