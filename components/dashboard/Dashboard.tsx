'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    User,
    Truck,
    ShoppingCart,
    AlertCircle
} from 'lucide-react';
import { FarmerDashboard } from './farmer/FarmerDashboard';
import { DispatcherDashboard } from './dispatcher/DispatcherDashboard';
import BuyerDashboard from './buyer/BuyerDashboard';

export function Dashboard() {
    const { user } = useUser();
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                        <p className="text-gray-600 mb-4">Please sign in to access your dashboard.</p>
                        <Button>Sign In</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
                        <p className="text-gray-600">Please wait while we load your profile...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const roleConfig = {
        farmer: {
            title: 'Farmer Dashboard',
            description: 'Manage your products and orders',
            icon: User,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        dispatcher: {
            title: 'Dispatcher Dashboard',
            description: 'Manage deliveries and track orders',
            icon: Truck,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        buyer: {
            title: 'Buyer Dashboard',
            description: 'Track your orders and purchases',
            icon: ShoppingCart,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    };

    const config = roleConfig[userProfile.role as keyof typeof roleConfig];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-lg ${config.bgColor}`}>
                            <config.icon className={`w-8 h-8 ${config.color}`} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
                            <p className="text-gray-600">{config.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Welcome back, {userProfile.firstName}!</span>
                        <Badge variant="secondary">{userProfile.role}</Badge>
                        {userProfile.isVerified && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                                Verified
                            </Badge>
                        )}
                    </div>
                </motion.div>

                {/* Role-specific Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {userProfile.role === 'farmer' && <FarmerDashboard userProfile={userProfile} />}
                    {userProfile.role === 'dispatcher' && <DispatcherDashboard userProfile={userProfile} />}
                    {userProfile.role === 'buyer' && <BuyerDashboard />}
                </motion.div>
            </div>
        </div>
    );
} 