'use client';

import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, MapPin } from 'lucide-react';
import { ProductCarousel } from '../../carousel/ProductCarousel';
import { VideoBackground } from '../../ui/VideoBackground';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    farmer: string;
    location: string;
    rating: number;
    images: string[];
    quantity: number;
    harvestDate: string;
    featured: boolean;
}

interface ProductCardProps {
    product: Product;
    index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
    return (
        <motion.div
            className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 ${product.featured ? 'ring-2 ring-green-500' : ''
                }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
        >
            {product.featured && (
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                    </span>
                </div>
            )}

            <div className="relative h-64 overflow-hidden">
                <ProductCarousel
                    images={product.images}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    productId={product.id}
                />
                <motion.button
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 z-20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Heart size={20} className="text-gray-600" />
                </motion.button>
            </div>

            {/* Video Background for Product Content */}
            <div className="absolute bottom-0 left-0 right-0 top-64 pointer-events-none z-0">
                <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
            </div>

            <div className="relative p-6 bg-transparent backdrop-blur-sm z-10">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <div className="flex items-center bg-yellow-500/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="text-yellow-300 fill-current" size={16} />
                        <span className="text-sm font-semibold text-yellow-200 ml-1">{product.rating}</span>
                    </div>
                </div>

                <p className="text-gray-200 mb-3">By {product.farmer}</p>
                <div className="flex items-center text-gray-300 mb-4">
                    <MapPin size={16} />
                    <span className="ml-1 text-sm">{product.location}</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-bold text-green-300">
                        R{product.price}
                        <span className="text-sm text-gray-300 font-normal">/{product.unit}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                        {product.quantity} {product.unit} available
                    </div>
                </div>

                <motion.button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ShoppingCart className="mr-2" size={20} />
                    Add to Cart
                </motion.button>
            </div>
        </motion.div>
    );
} 