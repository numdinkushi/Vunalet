'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    DollarSign,
    ShoppingCart,
    Star,
    TrendingUp,
    User
} from 'lucide-react';

const stats = [
    { label: 'Active Listings', value: '12', icon: <Package className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Total Sales', value: '₦45,000', icon: <DollarSign className="w-6 h-6" />, color: 'bg-green-500' },
    { label: 'Orders Today', value: '8', icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-orange-500' },
    { label: 'Rating', value: '4.8', icon: <Star className="w-6 h-6" />, color: 'bg-yellow-500' }
];

const recentOrders = [
    { id: '1', product: 'Organic Tomatoes', buyer: 'John Doe', quantity: '5 KG', amount: '₦2,250', status: 'pending' },
    { id: '2', product: 'Fresh Spinach', buyer: 'Jane Smith', quantity: '3 KG', amount: '₦900', status: 'confirmed' },
    { id: '3', product: 'Sweet Corn', buyer: 'Mike Johnson', quantity: '10 pieces', amount: '₦2,000', status: 'delivered' }
];

const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> }
];

export function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-primary mb-2">Farmer Dashboard</h1>
                    <p className="text-xl text-gray-600">Welcome back, John Farmer!</p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ y: -2 }}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </motion.button>
                            ))}
                        </nav>
                    </div>
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                            </div>
                                            <div className={`p-3 rounded-full ${stat.color} text-white`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Orders */}
                            <motion.div
                                className="bg-white rounded-2xl shadow-lg p-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <h3 className="text-xl font-bold text-primary mb-6">Recent Orders</h3>
                                <div className="space-y-4">
                                    {recentOrders.map((order, index) => (
                                        <motion.div
                                            key={order.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                            whileHover={{ x: 5 }}
                                        >
                                            <div>
                                                <h4 className="font-semibold text-primary">{order.product}</h4>
                                                <p className="text-sm text-gray-600">by {order.buyer}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{order.amount}</p>
                                                <p className="text-sm text-gray-600">{order.quantity}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
} 