'use client';

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
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { mockFarmerStats, mockProducts, mockFarmerOrders } from './data';
import { StatCard, ProductCard, OrderCard } from './components';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { walletService } from '../../../lib/services/wallet/wallet.service';
import { LZC_TOKEN_NAME } from '../../../constants/tokens';

interface FarmerDashboardProps {
    userProfile: any;
}

export function FarmerDashboard({ userProfile }: FarmerDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const { user } = useUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const balance = useQuery((api as unknown as any).balances.getUserBalance, {
        clerkUserId: user?.id || '',
        token: LZC_TOKEN_NAME,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertBalance = useMutation((api as unknown as any).balances.upsertUserBalance);

    useEffect(() => {
        if (!user?.id) return;
        walletService
            .fetchBalances(userProfile?.liskId || user.id)
            .then(({ walletBalance, ledgerBalance }) => {
                console.log('Fetched balances', { walletBalance, ledgerBalance });
                return upsertBalance({
                    clerkUserId: user.id,
                    token: LZC_TOKEN_NAME,
                    walletBalance,
                    ledgerBalance,
                });
            })
            .catch((err) => console.log('Failed to refresh balances', err));
    }, [user?.id]);

    const walletBalance = balance?.walletBalance ?? 0;
    const ledgerBalance = balance?.ledgerBalance ?? 0;

    // Queries
    const products = useQuery(api.products.getProductsByFarmer, { farmerId: userProfile.clerkUserId });
    const orders = useQuery(api.orders.getOrdersByFarmer, { farmerId: userProfile.clerkUserId });

    // Mutations
    const createProduct = useMutation(api.products.createProduct);
    const updateProduct = useMutation(api.products.updateProduct);
    const deleteProduct = useMutation(api.products.deleteProduct);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: 0,
        unit: '',
        quantity: 0,
        description: '',
        harvestDate: '',
        location: userProfile.location || '',
        isOrganic: false,
        isFeatured: false,
    });

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createProduct({
                farmerId: userProfile.clerkUserId,
                ...newProduct,
                images: [],
                status: 'active',
            });

            toast.success('Product added successfully!');
            setShowAddProduct(false);
            setNewProduct({
                name: '',
                category: '',
                price: 0,
                unit: '',
                quantity: 0,
                description: '',
                harvestDate: '',
                location: userProfile.location || '',
                isOrganic: false,
                isFeatured: false,
            });
        } catch (error) {
            toast.error('Failed to add product');
        }
    };

    const stats = mockFarmerStats;
    const farmerProducts = mockProducts;
    const farmerOrders = mockFarmerOrders;

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
            <WalletCard
                walletBalance={walletBalance}
                ledgerBalance={ledgerBalance}
            />

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
                                    {farmerProducts.slice(0, 3).map((product) => (
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
                                    {farmerOrders.slice(0, 3).map((order) => (
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
                                {farmerProducts.map((product) => (
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
                                {farmerOrders.map((order) => (
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
                                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="vegetables">Vegetables</SelectItem>
                                                <SelectItem value="fruits">Fruits</SelectItem>
                                                <SelectItem value="grains">Grains</SelectItem>
                                                <SelectItem value="dairy">Dairy</SelectItem>
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
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        rows={3}
                                    />
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