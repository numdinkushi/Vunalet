'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { EnhancedImageUpload } from '../../ui/enhanced-image-upload';
import { Checkbox } from '../../ui/checkbox';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import {
    Plus,
    Package,
    DollarSign,
    Clock,
    Star,
    Calendar as CalendarIcon,
    Snowflake,
    Thermometer
} from 'lucide-react';
import { toast } from 'sonner';
import { StatCard, ProductCard, OrderCard } from './components';
import { cn } from '../../../lib/utils';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { LZC_TOKEN_NAME } from '../../../constants/tokens';
import { calculateExpiryDate, StorageMethod } from '../../../lib/utils/product-utils';

// Type for Convex order structure with buyer info
interface ConvexOrder {
    _id: string;
    buyerId: string;
    farmerId: string;
    dispatcherId?: string;
    products: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        unit: string;
    }>;
    totalAmount: number;
    farmerAmount: number;
    dispatcherAmount: number;
    deliveryAddress: string;
    deliveryCoordinates?: {
        lat: number;
        lng: number;
    };
    pickupLocation?: string;
    pickupCoordinates?: {
        lat: number;
        lng: number;
    };
    deliveryDistance: number;
    deliveryCost: number;
    totalCost: number;
    paymentMethod: 'lisk_zar' | 'cash';
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';
    specialInstructions?: string;
    estimatedPickupTime?: string;
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    createdAt: number;
    updatedAt: number;
    buyerInfo?: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    dispatcherInfo?: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

interface FarmerDashboardProps {
    userProfile: {
        clerkUserId: string;
        liskId?: string;
        location?: string;
        specialties?: string[];
    };
}

interface NewProduct {
    name: string;
    categoryId: string;
    price: number;
    unit: string;
    quantity: number;
    description: string;
    harvestDate: string;
    storageMethod: StorageMethod;
    location: string;
    isOrganic: boolean;
    isFeatured: boolean;
    images: string[];
}

export function FarmerDashboard({ userProfile }: FarmerDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const { user } = useUser();

    const balance = useQuery((api as any).balances.getUserBalance, {
        clerkUserId: user?.id || '',
        token: LZC_TOKEN_NAME,
    });

    const upsertBalance = useMutation((api as any).balances.upsertUserBalance);

    // Fetch real data from Convex
    const products = useQuery(api.products.getProductsByFarmer, { farmerId: userProfile.clerkUserId });
    const orders = useQuery(api.orders.getOrdersByFarmerWithUserInfo, { farmerId: userProfile.clerkUserId });
    const categories = useQuery(api.categories.getActiveCategories);
    const orderStats = useQuery(api.orders.getOrderStats, {
        role: 'farmer',
        userId: userProfile.clerkUserId,
    });

    useEffect(() => {
        if (!user?.id) return;

        const refreshBalances = async () => {
            try {
                if (!userProfile?.liskId) {
                    toast.error('No payment account found for user');
                    return;
                }

                const { walletService } = await import('../../../lib/services/wallet/wallet.service');
                const balances = await walletService.fetchBalances(userProfile.liskId);

                await upsertBalance({
                    clerkUserId: user.id,
                    token: LZC_TOKEN_NAME,
                    walletBalance: balances.walletBalance,
                    ledgerBalance: 0,
                });
            } catch (error) {
                toast.error('Failed to refresh wallet balance');
            }
        };

        refreshBalances();
    }, [user?.id, userProfile?.liskId]);

    // Helper function to get current balance
    const getCurrentBalance = async () => {
        try {
            const balance = await fetch(`/api/balances/${user?.id}`).then(r => r.json());
            return balance;
        } catch (error) {
            return null;
        }
    };

    const walletBalance = balance?.walletBalance ?? 0;
    const ledgerBalance = balance?.ledgerBalance ?? 0;

    const createProduct = useMutation(api.products.createProduct);
    const updateProduct = useMutation(api.products.updateProduct);
    const deleteProduct = useMutation(api.products.deleteProduct);

    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: '',
        categoryId: '',
        price: 0,
        unit: '',
        quantity: 0,
        description: '',
        harvestDate: '',
        storageMethod: 'room_temp',
        location: userProfile.location || '',
        isOrganic: false,
        isFeatured: false,
        images: [],
    });
    const [harvestDate, setHarvestDate] = useState<Date | undefined>(undefined);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Calculate expiry date based on harvest date, category, and storage method
            let expiryDate: string | undefined;
            if (newProduct.harvestDate && newProduct.categoryId) {
                try {
                    expiryDate = calculateExpiryDate(
                        newProduct.harvestDate,
                        newProduct.categoryId,
                        newProduct.storageMethod
                    );
                } catch (error) {
                    console.error('Error calculating expiry date:', error);
                    toast.error('Error calculating expiry date. Please check your harvest date.');
                    return;
                }
            }

            await createProduct({
                farmerId: userProfile.clerkUserId,
                categoryId: newProduct.categoryId,
                name: newProduct.name,
                price: newProduct.price,
                unit: newProduct.unit,
                quantity: newProduct.quantity,
                description: newProduct.description,
                images: newProduct.images,
                harvestDate: newProduct.harvestDate,
                expiryDate,
                storageMethod: newProduct.storageMethod,
                isOrganic: newProduct.isOrganic,
                isFeatured: newProduct.isFeatured,
                location: newProduct.location,
                status: 'active',
            });

            toast.success('Product added successfully!');
            setShowAddProduct(false);
            resetProductForm();
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create product. Please try again.');
        }
    };

    const resetProductForm = () => {
        setNewProduct({
            name: '',
            categoryId: '',
            price: 0,
            unit: '',
            quantity: 0,
            description: '',
            harvestDate: '',
            storageMethod: 'room_temp',
            location: userProfile.location || '',
            isOrganic: false,
            isFeatured: false,
            images: [],
        });
        setHarvestDate(undefined);
    };

    const handleImagesUploaded = (urls: string[]) => {
        setNewProduct(prev => ({ ...prev, images: urls }));
    };

    const getStorageMethodIcon = (method: StorageMethod) => {
        switch (method) {
            case 'refrigerated':
                return <Thermometer className="w-4 h-4" />;
            case 'frozen':
                return <Snowflake className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const getStorageMethodLabel = (method: StorageMethod) => {
        switch (method) {
            case 'refrigerated':
                return 'Refrigerated';
            case 'frozen':
                return 'Frozen';
            default:
                return 'Room Temperature';
        }
    };

    // Calculate real stats from data
    const stats = {
        totalProducts: products?.length ?? 0,
        activeOrders: orderStats ? (orderStats.pending + orderStats.confirmed + orderStats.preparing + orderStats.ready + orderStats.inTransit) : 0,
        totalRevenue: orderStats?.totalRevenue ?? 0,
        averageRating: 4.7, // This would need to be calculated from ratings table
    };

    // Transform Convex orders to match the Order interface
    const transformOrders = (convexOrders: ConvexOrder[]) => {
        return convexOrders?.map((order: ConvexOrder) => ({
            _id: order._id,
            products: order.products.map((p: { name: string; quantity: number; price: number; unit: string; productId: string; }) => ({
                name: p.name,
                quantity: p.quantity,
                price: p.price,
            })),
            totalCost: order.totalCost,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: new Date(order.createdAt).toISOString(),
            deliveryAddress: order.deliveryAddress,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            riderId: order.dispatcherId,
            riderName: order.dispatcherInfo ?
                `${order.dispatcherInfo.firstName} ${order.dispatcherInfo.lastName}` :
                order.dispatcherId || '',
            farmName: order.buyerInfo ?
                `${order.buyerInfo.firstName} ${order.buyerInfo.lastName}` :
                order.buyerId,
        })) || [];
    };

    const handleRefreshBalance = async () => {
        if (!userProfile?.liskId) {
            toast.error('No Lisk ID found for user');
            return;
        }

        try {
            const { walletService } = await import('../../../lib/services/wallet/wallet.service');
            const balances = await walletService.fetchBalances(userProfile.liskId);

            console.log('Manual refresh - balances:', balances);

            if (user?.id) {
                await upsertBalance({
                    clerkUserId: user.id,
                    token: LZC_TOKEN_NAME,
                    walletBalance: balances.walletBalance,
                    ledgerBalance: 0,
                });
            }

            toast.success('Balance refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh balance:', error);
            toast.error('Failed to refresh balance');
        }
    };

    // Transform products to match the expected interface
    const transformProducts = (convexProducts: any[]) => {
        return convexProducts?.map(product => ({
            ...product,
            description: product.description || '',
        })) || [];
    };

    const transformedOrders = transformOrders(orders || []);
    const transformedProducts = transformProducts(products || []);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={Package}
                    title="Total Products"
                    value={stats.totalProducts}
                    color="bg-green-100 text-green-600"
                    delay={0.1}
                />
                <StatCard
                    icon={Clock}
                    title="Active Orders"
                    value={stats.activeOrders}
                    color="bg-blue-100 text-blue-600"
                    delay={0.2}
                />
                <StatCard
                    icon={DollarSign}
                    title="Total Revenue"
                    value={`R ${stats.totalRevenue.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`}
                    color="bg-amber-100 text-amber-600"
                    delay={0.3}
                />
                <StatCard
                    icon={Star}
                    title="Average Rating"
                    value={stats.averageRating}
                    color="bg-purple-100 text-purple-600"
                    delay={0.4}
                />
            </div>

            {/* Wallet & Ledger */}
            <WalletCard />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Products */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Recent Products</span>
                                    <Button size="sm" onClick={() => setShowAddProduct(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Product
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transformedProducts.slice(0, 3).map((product) => (
                                        <ProductCard key={product._id} product={product} showActions={false} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transformedOrders.slice(0, 3).map((order) => (
                                        <OrderCard key={order._id} order={order} showActions={false} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>My Products</span>
                                <Button onClick={() => setShowAddProduct(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transformedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transformedOrders.map((order) => (
                                    <OrderCard key={order._id} order={order} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add Product Modal */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle>Add New Product</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto">
                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input
                                            id="name"
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={newProduct.categoryId} onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.filter((category: any) =>
                                                    userProfile.specialties?.includes(category.categoryId)
                                                ).map((category: any) => (
                                                    <SelectItem key={category.categoryId} value={category.categoryId}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="price">Price (R)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={newProduct.quantity}
                                            onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="unit">Unit</Label>
                                        <Input
                                            id="unit"
                                            value={newProduct.unit}
                                            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                            placeholder="kg, pcs, etc."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="harvestDate">Harvest Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !harvestDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {harvestDate ? (
                                                        harvestDate.toLocaleDateString()
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={harvestDate}
                                                    onSelect={(date) => {
                                                        setHarvestDate(date);
                                                        if (date) {
                                                            setNewProduct({
                                                                ...newProduct,
                                                                harvestDate: date.toISOString().split('T')[0]
                                                            });
                                                        }
                                                    }}
                                                    initialFocus
                                                    disabled={(date) => date > new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <Label htmlFor="storageMethod">Storage Method</Label>
                                        <Select
                                            value={newProduct.storageMethod}
                                            onValueChange={(value: StorageMethod) => setNewProduct({ ...newProduct, storageMethod: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select storage method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="room_temp">
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="w-4 h-4" />
                                                        <span>Room Temperature</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="refrigerated">
                                                    <div className="flex items-center space-x-2">
                                                        <Thermometer className="w-4 h-4" />
                                                        <span>Refrigerated</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="frozen">
                                                    <div className="flex items-center space-x-2">
                                                        <Snowflake className="w-4 h-4" />
                                                        <span>Frozen</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Expiry Date Preview */}
                                {newProduct.harvestDate && newProduct.categoryId && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">Expiry Date Preview</span>
                                        </div>
                                        <div className="text-sm text-blue-700">
                                            {(() => {
                                                try {
                                                    const expiryDate = calculateExpiryDate(
                                                        newProduct.harvestDate,
                                                        newProduct.categoryId,
                                                        newProduct.storageMethod
                                                    );
                                                    const expiryDateObj = new Date(expiryDate);
                                                    const daysUntilExpiry = Math.ceil((expiryDateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                                                    return (
                                                        <div className="space-y-1">
                                                            <p>
                                                                <span className="font-medium">Expires:</span> {expiryDateObj.toLocaleDateString()}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Storage:</span> {getStorageMethodLabel(newProduct.storageMethod)}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Shelf Life:</span> {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                                                            </p>
                                                        </div>
                                                    );
                                                } catch (error) {
                                                    return <p className="text-red-600">Error calculating expiry date</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={newProduct.location}
                                        onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                                        placeholder="Farm location"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label>Product Images</Label>
                                    <EnhancedImageUpload
                                        onImagesUploaded={handleImagesUploaded}
                                        maxImages={5}
                                    />
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isOrganic"
                                            checked={newProduct.isOrganic}
                                            onCheckedChange={(checked) => setNewProduct({ ...newProduct, isOrganic: checked as boolean })}
                                        />
                                        <Label htmlFor="isOrganic">Organic Product</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isFeatured"
                                            checked={newProduct.isFeatured}
                                            onCheckedChange={(checked) => setNewProduct({ ...newProduct, isFeatured: checked as boolean })}
                                        />
                                        <Label htmlFor="isFeatured">Featured Product</Label>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={handleAddProduct}>
                                    Add Product
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
} 