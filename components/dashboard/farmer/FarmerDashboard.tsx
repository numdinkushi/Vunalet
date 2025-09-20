'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Plus } from 'lucide-react';
import { ProductCard, OrderCard, AddProductModal, DashboardStats, RecentProducts, RecentOrders } from './components';
import { useFarmerDashboard } from './hooks/use-farmer-dashboard';
import { WalletCard } from '../shared/WalletCard';
import { FarmerDashboardProps } from './types/dashboard-types';
import { useMounted } from '@/hooks/use-mounted';

export function FarmerDashboard({ userProfile }: FarmerDashboardProps) {
    useMounted();

    const {
        activeTab,
        setActiveTab,
        showAddProduct,
        setShowAddProduct,
        products,
        orders,
        dashboardStats,
        onProductDeleted,
        isLoading,
    } = useFarmerDashboard(userProfile);

    if (!products || !orders) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <DashboardStats stats={dashboardStats} isLoading={isLoading} />

            {/* Wallet Card */}
            <WalletCard />

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RecentProducts
                            products={products}
                            onProductDeleted={onProductDeleted}
                            onAddProduct={() => setShowAddProduct(true)}
                        />
                        <RecentOrders orders={orders} />
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
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onProductDeleted={onProductDeleted}
                                    />
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
                                {orders.map((order) => (
                                    <OrderCard key={order._id} order={order} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={showAddProduct}
                onClose={() => setShowAddProduct(false)}
                userProfile={userProfile}
                onProductAdded={() => window.location.reload()} // Refresh to show new product
            />
        </div>
    );
} 