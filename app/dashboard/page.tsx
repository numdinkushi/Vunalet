'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Dashboard } from '../../components/dashboard/Dashboard';
import { UserRegistration } from '../../components/auth/UserRegistration';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const createUserProfile = useMutation(api.users.createUserProfile);
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Auto-create basic profile for new users
    useEffect(() => {
        if (user && !userProfile && isLoaded) {
            // Create a basic profile automatically
            createUserProfile({
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                role: 'buyer', // Default role
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: '',
                address: '',
                location: '',
            });
        }
    }, [user, userProfile, isLoaded, createUserProfile]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
                        <p className="text-gray-600">Please wait while we load your dashboard.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">Welcome to Vunalet</h2>
                        <p className="text-gray-600 mb-6">
                            Sign in to access your personalized dashboard and manage your account.
                        </p>
                        <Button className="w-full">Sign In</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if user has completed profile setup
    const hasCompletedProfile = userProfile && userProfile.role;

    if (!hasCompletedProfile) {
        return <UserRegistration />;
    }

    return <Dashboard />;
} 