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
import { formatCurrency } from './utils';

interface FarmerDashboardProps {
    userProfile: any;
}

export function FarmerDashboard({ userProfile }: FarmerDashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddProduct, setShowAddProduct] = useState(false);

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

    const stats = {
        totalProducts: products?.length || 0,
        activeOrders: orders?.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length || 0,
        totalRevenue: orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0,
        averageRating: 4.5,
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-amber-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Star className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

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
                                    {products?.slice(0, 5).map((product) => (
                                        <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Leaf className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{formatCurrency(product.price)}</p>
                                                <p className="text-sm text-gray-500">{product.quantity} {product.unit}</p>
                                            </div>
                                        </div>
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
                                    {orders?.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Package className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                    <p className="text-sm text-gray-500">{order.orderStatus}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                                                <p className="text-sm text-gray-500">{order.products?.length || 0} items</p>
                                            </div>
                                        </div>
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
                                {products?.map((product) => (
                                    <div key={product._id} className="p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Leaf className="w-6 h-6 text-green-500" />
                                                <div>
                                                    <h3 className="font-semibold">{product.name}</h3>
                                                    <p className="text-sm text-gray-600">{product.category}</p>
                                                    <p className="text-sm text-gray-500">{product.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
                                                <p className="text-sm text-gray-600">{product.quantity} {product.unit}</p>
                                                <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                                    {product.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <MapPin className="w-4 h-4" />
                                                <span>{product.location}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
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
                                {orders?.map((order) => (
                                    <div key={order._id} className="p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Package className="w-6 h-6 text-blue-500" />
                                                <div>
                                                    <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                    <p className="text-sm text-gray-600">{order.orderStatus}</p>
                                                    <p className="text-sm text-gray-500">{order.products?.length || 0} items</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{formatCurrency(order.totalAmount)}</p>
                                                <Badge variant={order.orderStatus === 'delivered' ? 'default' : 'secondary'}>
                                                    {order.orderStatus}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{new Date(order.createdAt).toLocaleDateString('en-ZA')}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
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