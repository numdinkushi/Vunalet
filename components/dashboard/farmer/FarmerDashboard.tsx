'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ImageUpload } from '../../ui/image-upload';
import { Checkbox } from '../../ui/checkbox';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import {
    Plus,
    Package,
    TrendingUp,
    DollarSign,
    MapPin,
    Clock,
    Edit,
    Trash2,
    Eye,
    Upload,
    Leaf,
    Star,
    Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { StatCard, ProductCard, OrderCard } from './components';
import { cn } from '../../../lib/utils';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { walletService } from '../../../lib/services/wallet/wallet.service';
import { LZC_TOKEN_NAME } from '../../../constants/tokens';

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

    const [newProduct, setNewProduct] = useState({
        name: '',
        categoryId: '',
        price: 0,
        unit: '',
        quantity: 0,
        description: '',
        harvestDate: '',
        location: userProfile.location || '',
        isOrganic: false,
        isFeatured: false,
        images: [] as string[],
    });
    const [harvestDate, setHarvestDate] = useState<Date | undefined>(undefined);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createProduct({
                farmerId: userProfile.clerkUserId,
                ...newProduct,
                status: 'active',
            });

            toast.success('Product added successfully!');
            setShowAddProduct(false);
            setNewProduct({
                name: '',
                categoryId: '',
                price: 0,
                unit: '',
                quantity: 0,
                description: '',
                harvestDate: '',
                location: userProfile.location || '',
                isOrganic: false,
                isFeatured: false,
                images: [],
            });
            setHarvestDate(undefined);
        } catch (error) {
            toast.error('Failed to add product');
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl mx-4">
                        <CardHeader>
                            <CardTitle>Add New Product</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={newProduct.location}
                                            onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                                            placeholder="Farm location"
                                            required
                                        />
                                    </div>
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
                                    <ImageUpload
                                        onImagesUploaded={(urls) => setNewProduct({ ...newProduct, images: urls })}
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
                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Add Product
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
} 