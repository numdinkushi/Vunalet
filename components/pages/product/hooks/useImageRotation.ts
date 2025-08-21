import { useState, useEffect } from 'react';
import { Product } from '../types';

export function useImageRotation(products: Product[] | undefined) {
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number; }>({});

    useEffect(() => {
        if (!products) return;

        const interval = setInterval(() => {
            setCurrentImageIndexes(prev => {
                const newIndexes = { ...prev };
                products.forEach((product: Product) => {
                    if (product.images.length > 1) {
                        const currentIndex = newIndexes[product._id] || 0;
                        newIndexes[product._id] = (currentIndex + 1) % product.images.length;
                    }
                });
                return newIndexes;
            });
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [products]);

    return currentImageIndexes;
} 