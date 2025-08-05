'use client';

import { useUser, SignInButton } from '@clerk/nextjs';
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
    const createBasicUserProfile = useMutation(api.users.createBasicUserProfile);
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Create basic profile for new users (without role)
    useEffect(() => {
        if (user && !userProfile && isLoaded) {
            // Create a basic profile without role
            createBasicUserProfile({
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
            });
        }
    }, [user, userProfile, isLoaded, createBasicUserProfile]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
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
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-br from-green-50 to-blue-50">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">Welcome to Vunalet</h2>
                        <p className="text-gray-600 mb-6">
                            Sign in to access your personalized dashboard and manage your account.
                        </p>
                        <SignInButton mode="modal">
                            <Button className="w-full">Sign In</Button>
                        </SignInButton>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if user profile is still loading
    if (user && userProfile === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Loading Profile...</h2>
                        <p className="text-gray-600">Please wait while we load your profile.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if user has a role assigned
    const hasRole = userProfile && userProfile.role;

    if (!hasRole) {
        return <UserRegistration />;
    }

    return <Dashboard />;
} 