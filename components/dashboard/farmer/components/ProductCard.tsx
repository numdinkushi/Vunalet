import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Package, MapPin, Clock, Thermometer, Snowflake } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { getExpiryStatus, getDaysUntilExpiry } from '../../../../lib/utils/product-utils';
import { DeleteProductButton } from './delete-product-button';

interface ProductCardProps {
    product: Product;
    showActions?: boolean;
    onProductDeleted?: () => void;
}

export function ProductCard({ product, showActions = true, onProductDeleted }: ProductCardProps) {
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
                return 'Room Temperature';
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
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Leaf className="w-6 h-6 text-green-500" />
                        <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <p className="text-sm text-gray-600">{product.category?.name || product.categoryId}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {product.isOrganic && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Organic
                            </Badge>
                        )}
                        {product.isFeatured && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                Featured
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Product Images */}
                    {product.images && product.images.length > 0 && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                {product.images.slice(0, 2).map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                            {product.images.length > 2 && (
                                <p className="text-xs text-gray-500 text-center">
                                    +{product.images.length - 2} more images
                                </p>
                            )}
                        </div>
                    )}

                    <p className="text-gray-700">{product.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Price:</span>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(product.price)}</p>
                        </div>
                        <div>
                            <span className="font-medium">Quantity:</span>
                            <p className="text-lg">{product.quantity} {product.unit}</p>
                        </div>
                    </div>

                    {/* Expiry Date and Storage Method */}
                    <div className="space-y-2">
                        {product.expiryDate && (
                            <div className="flex items-center space-x-2 text-sm">
                                <Clock className={`w-4 h-4 ${getExpiryStatusColor(product.expiryDate)}`} />
                                <span className={`${getExpiryStatusColor(product.expiryDate)}`}>
                                    {getExpiryStatusText(product.expiryDate)}
                                </span>
                            </div>
                        )}
                        {product.storageMethod && (
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-4 h-4 text-blue-600">
                                    {getStorageMethodIcon(product.storageMethod)}
                                </div>
                                <span className="text-blue-600">{getStorageMethodLabel(product.storageMethod)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{product.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Harvested: {formatDate(product.harvestDate)}</span>
                        </div>
                    </div>

                    {showActions && (
                        <div className="flex items-center justify-between pt-3 border-t">
                            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                {product.status}
                            </Badge>
                            <div className="flex space-x-2">
                                <DeleteProductButton
                                    productId={product._id}
                                    productName={product.name}
                                    onSuccess={onProductDeleted}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 