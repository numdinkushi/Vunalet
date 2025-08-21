'use client';

import { motion } from 'framer-motion';
import { Star, Heart, MapPin, Truck, Calculator, User } from 'lucide-react';
import { ProductCarousel } from '../../carousel/ProductCarousel';
import { PurchaseFormData } from '../../../app/types';

interface ProductDetailCardProps {
    product: {
        _id: string;
        name: string;
        images: string[];
        farmerId: string;
        location: string;
        price: number;
        unit: string;
        quantity: number;
        harvestDate: string;
    };
    farmer?: {
        firstName: string;
        lastName: string;
        businessName?: string;
    } | null;
    formData: PurchaseFormData;
    isCalculating: boolean;
    isProcessing: boolean; // Add this prop
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function ProductDetailCard({
    product,
    farmer,
    formData,
    isCalculating,
    isProcessing, // Add this prop
    handleInputChange,
    handleSubmit
}: ProductDetailCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
        >
            {/* Product Images */}
            <div className="mb-8">
                <ProductCarousel
                    images={product.images}
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-2xl"
                    productId={product._id}
                />
            </div>

            {/* Product Details */}
            <div className="space-y-6 mb-8">
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-yellow-500/30 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Star className="text-yellow-300 fill-current" size={16} />
                            <span className="text-sm font-semibold text-yellow-200 ml-1">4.8</span>
                        </div>
                        <motion.button
                            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Heart size={20} className="text-red-400" />
                        </motion.button>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-gray-300">
                        By {farmer ? (farmer.businessName || `${farmer.firstName} ${farmer.lastName}`) : product.farmerId}
                    </p>

                    <div className="flex items-center text-gray-300">
                        <MapPin size={16} />
                        <span className="ml-2">{product.location}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold text-green-300">
                            R{product.price}
                            <span className="text-lg text-gray-300 font-normal">/{product.unit}</span>
                        </div>
                        <div className="text-gray-300">
                            {product.quantity} {product.unit} available
                        </div>
                    </div>

                    <div className="text-sm text-gray-400">
                        Harvest Date: {new Date(product.harvestDate).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Purchase Form */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Purchase Details</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-green-300 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Customer Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    min="1"
                                    max={product.quantity}
                                    className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Delivery Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none resize-none"
                                placeholder="Enter your delivery address"
                                required
                            />
                        </div>
                    </div>

                    {/* Delivery Calculation */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-green-300 flex items-center">
                            <Truck className="w-5 h-5 mr-2" />
                            Delivery Information
                        </h3>

                        {formData.address && (
                            <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Distance:</span>
                                        <span className="text-white">{formData.deliveryDistance} km</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Delivery Cost:</span>
                                        <span className="text-white">R{formData.deliveryCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Product Cost:</span>
                                        <span className="text-white">R{(product.price * formData.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-600 pt-2">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-green-300">Total Cost:</span>
                                            <span className="text-green-300">R{formData.totalCost.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                        disabled={isCalculating || isProcessing || !formData.address}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center"
                    >
                        {isCalculating ? (
                            <>
                                <Calculator className="w-5 h-5 mr-2 animate-spin" />
                                Calculating...
                            </>
                        ) : isProcessing ? (
                            <>
                                <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Processing Order...
                            </>
                        ) : (
                            <>
                                <Truck className="w-5 h-5 mr-2" />
                                Confirm Purchase
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
} 