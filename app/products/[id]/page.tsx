
'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { VideoBackground } from '../../../components/ui/VideoBackground';
import { ProductDetailCard } from '../../../components/app/cards/product-detail';
import { DeliveryMap } from '../../../components/app/maps/delivery-map';
import { PurchaseFormData } from '../../../app/types';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string; }>; }) {
    // Unwrap params using React.use()
    const { id } = use(params);

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

    useEffect(() => {
        if (product) {
            calculateDeliveryCost();
        }
    }, [product, formData.address, formData.quantity]);

    const calculateDeliveryCost = async () => {
        if (!product || !formData.address) return;

        setIsCalculating(true);
        try {
            // Simulate distance calculation (in a real app, you'd use Google Maps API)
            const distance = Math.floor(Math.random() * 50) + 5; // 5-55 km
            const deliveryCost = distance * 0.5; // 0.5 lisk per km
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle purchase submission
        console.log('Purchase submitted:', { product, formData });
        alert('Purchase submitted successfully!');
    };



    // Show loading state
    if (product === undefined) {
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
                            formData={formData}
                            isCalculating={isCalculating}
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