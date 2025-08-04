'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
    Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
                images: [], // Will be handled with Cloudinary upload
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
        averageRating: 4.5, // This would come from reviews
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
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">R {stats.totalRevenue.toFixed(2)}</p>
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
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest orders from your customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.slice(0, 5).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Order #{order._id.slice(-6)}</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.products.length} items • R {order.totalAmount}
                                                </p>
                                            </div>
                                            <Badge variant={
                                                order.orderStatus === 'pending' ? 'secondary' :
                                                    order.orderStatus === 'confirmed' ? 'default' :
                                                        order.orderStatus === 'delivered' ? 'default' : 'destructive'
                                            }>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No orders yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Products</h2>
                            <p className="text-gray-600">Manage your product inventory</p>
                        </div>
                        <Button onClick={() => setShowAddProduct(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>

                    {showAddProduct && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Product</CardTitle>
                                <CardDescription>Add a new product to your inventory</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Product Name</Label>
                                            <Input
                                                id="name"
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                value={newProduct.category}
                                                onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vegetables">Vegetables</SelectItem>
                                                    <SelectItem value="fruits">Fruits</SelectItem>
                                                    <SelectItem value="grains">Grains</SelectItem>
                                                    <SelectItem value="dairy">Dairy</SelectItem>
                                                    <SelectItem value="meat">Meat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="price">Price (R)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="unit">Unit</Label>
                                            <Select
                                                value={newProduct.unit}
                                                onValueChange={(value) => setNewProduct(prev => ({ ...prev, unit: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="kg">Kilogram</SelectItem>
                                                    <SelectItem value="g">Gram</SelectItem>
                                                    <SelectItem value="piece">Piece</SelectItem>
                                                    <SelectItem value="dozen">Dozen</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="quantity">Quantity Available</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                value={newProduct.quantity}
                                                onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe your product..."
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="submit">Add Product</Button>
                                        <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <Card key={product._id}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold">{product.name}</h3>
                                            <p className="text-sm text-gray-600">{product.category}</p>
                                        </div>
                                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                            {product.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-lg font-bold">R {product.price}/{product.unit}</p>
                                        <p className="text-sm text-gray-600">Available: {product.quantity} {product.unit}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-red-600">
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Orders</CardTitle>
                            <CardDescription>Track all your customer orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orders && orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order._id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant={
                                                    order.orderStatus === 'pending' ? 'secondary' :
                                                        order.orderStatus === 'confirmed' ? 'default' :
                                                            order.orderStatus === 'delivered' ? 'default' : 'destructive'
                                                }>
                                                    {order.orderStatus}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm font-medium">Items</p>
                                                    <p className="text-sm text-gray-600">{order.products.length} products</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Total</p>
                                                    <p className="text-sm text-gray-600">R {order.totalAmount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Payment</p>
                                                    <p className="text-sm text-gray-600">{order.paymentStatus}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm">View Details</Button>
                                                {order.orderStatus === 'pending' && (
                                                    <Button size="sm" variant="outline">Confirm Order</Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No orders yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 