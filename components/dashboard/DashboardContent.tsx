'use client';

import { useUser, SignInButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Dashboard } from './Dashboard';
import { UserRegistration } from '../auth/UserRegistration';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';

export function DashboardContent() {
    useMounted();
    const { user, isLoaded } = useUser();
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    console.log('userProfile', userProfile);
    console.log('user', user);

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

    // if (!user) {
    //     return (
    //         <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-br from-green-50 to-blue-50">
    //             <Card className="w-full max-w-md">
    //                 <CardContent className="p-6 text-center">
    //                     <h2 className="text-2xl font-bold mb-4">Welcome to Vunalet</h2>
    //                     <p className="text-gray-600 mb-6">
    //                         Sign in to access your personalized dashboard and manage your account.
    //                     </p>
    //                     <SignInButton mode="modal">
    //                         <Button className="w-full">Sign In</Button>
    //                     </SignInButton>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     );
    // }

    // // If user is signed in but profile is still loading, show loading state
    // if (userProfile === undefined) {
    //     return (
    //         <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
    //             <Card className="w-full max-w-md">
    //                 <CardContent className="p-6 text-center">
    //                     <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
    //                     <h2 className="text-xl font-semibold mb-2">Loading Profile...</h2>
    //                     <p className="text-gray-600">Please wait while we load your profile.</p>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     );
    // }

    // If user is signed in but has no profile (null), redirect to user registration
    if (user && userProfile === null) {
        return <UserRegistration />;
    }

    // If user has a profile but no role assigned, redirect to user registration
    if (userProfile && !userProfile.role) {
        return <UserRegistration />;
    }

    // User has a profile with a role, show dashboard
    return <Dashboard />;
} 