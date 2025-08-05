'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ProductCarouselProps {
    images: string[];
    alt: string;
    className?: string;
    interval?: number;
    autoPlay?: boolean;
    productId: string;
}

export function ProductCarousel({
    images,
    alt,
    className = "w-full h-full object-cover",
    interval = 5000,
    autoPlay = true,
    productId
}: ProductCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Filter out invalid images
    const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');

    useEffect(() => {
        if (!autoPlay || validImages.length <= 1) return;

        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
                setIsTransitioning(false);
            }, 600); // Half of the transition duration
        }, interval);

        return () => clearInterval(timer);
    }, [validImages.length, interval, autoPlay]);

    // Reset state when images change
    useEffect(() => {
        setImageError(false);
        setCurrentImageIndex(0);
        setIsTransitioning(false);
    }, [images]);

    if (validImages.length === 0) {
        return (
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-sm">No images available</div>
                    </div>
                </div>
            </div>
        );
    }

    const currentImage = validImages[currentImageIndex];

    return (
        <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`product-${productId}-${currentImageIndex}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                        duration: 1.2,
                        ease: "easeInOut",
                        delay: isTransitioning ? 0.6 : 0 // Delay during transition
                    }}
                >
                    <Image
                        src={currentImage}
                        alt={`${alt} - View ${currentImageIndex + 1}`}
                        fill
                        className={className}
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                        priority={currentImageIndex === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Fallback for image errors */}
            {imageError && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-sm">Image not available</div>
                    </div>
                </div>
            )}

            {/* Navigation dots for multiple images */}
            {validImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {validImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                ? 'bg-white shadow-lg'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 