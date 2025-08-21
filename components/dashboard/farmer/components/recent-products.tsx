'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Plus } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { RecentProductsProps } from '../types/dashboard-types';

export function RecentProducts({ products, onProductDeleted }: RecentProductsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Recent Products</span>
                    <Button size="sm" onClick={() => window.location.href = '/dashboard?tab=products'}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            showActions={true}
                            onProductDeleted={onProductDeleted}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 