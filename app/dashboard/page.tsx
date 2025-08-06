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
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { userIntegrationService } from '../../lib/services/userIntegrationService';

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const createBasicUserProfile = useMutation(api.users.createBasicUserProfile);
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Create basic profile for new users (without role) with stablecoin integration
    // useEffect(() => {
    //     if (user && !userProfile && isLoaded) {
    //         const createBasicProfileWithStablecoin = async () => {
    //             try {
    //                 // Step 1: Create user in stablecoin system FIRST
    //                 console.log('Step 1: Creating user in stablecoin system...');
    //                 const integrationResult = await userIntegrationService.completeUserIntegration({
    //                     clerkUserId: user.id,
    //                     email: user.emailAddresses[0].emailAddress,
    //                     firstName: user.firstName || '',
    //                     lastName: user.lastName || '',
    //                 });

    //                 if (integrationResult.success && integrationResult.stablecoinUser) {
    //                     // Step 2: Create basic profile in Convex WITH stablecoin data
    //                     console.log('Step 2: Creating basic profile in Convex with stablecoin data...');
    //                     console.log('Stablecoin data to save:', {
    //                         liskId: integrationResult.stablecoinUser.id,
    //                         publicKey: integrationResult.stablecoinUser.publicKey,
    //                         paymentIdentifier: integrationResult.stablecoinUser.paymentIdentifier,
    //                     });

    //                     const result = await createBasicUserProfile({
    //                         clerkUserId: user.id,
    //                         email: user.emailAddresses[0].emailAddress,
    //                         firstName: user.firstName || '',
    //                         lastName: user.lastName || '',
    //                         // Add stablecoin data from the API response
    //                         liskId: integrationResult.stablecoinUser.id,
    //                         publicKey: integrationResult.stablecoinUser.publicKey,
    //                         paymentIdentifier: integrationResult.stablecoinUser.paymentIdentifier,
    //                     });
    //                     console.log('Basic profile created successfully with stablecoin integration:', result);
    //                 } else {
    //                     // Fallback: Create basic profile without stablecoin data
    //                     console.warn('Stablecoin integration failed, creating basic profile without stablecoin data');
    //                     const result = await createBasicUserProfile({
    //                         clerkUserId: user.id,
    //                         email: user.emailAddresses[0].emailAddress,
    //                         firstName: user.firstName || '',
    //                         lastName: user.lastName || '',
    //                     });
    //                     console.log('Basic profile created without stablecoin data:', result);
    //                 }
    //             } catch (error: unknown) {
    //                 console.error('Error creating basic profile:', error);

    //                 // Check if it's a 409 error (user already exists) - this is expected
    //                 const errorMessage = error instanceof Error ? error.message : String(error);

    //                 if (errorMessage.includes('User already exists') || errorMessage.includes('409')) {
    //                     console.log('User already exists in stablecoin system, this is expected');
    //                     // For existing users, we should try to get their stablecoin data
    //                     // For now, create basic profile without stablecoin data
    //                     await createBasicUserProfile({
    //                         clerkUserId: user.id,
    //                         email: user.emailAddresses[0].emailAddress,
    //                         firstName: user.firstName || '',
    //                         lastName: user.lastName || '',
    //                     });
    //                 } else {
    //                     // For other errors, still create basic profile without stablecoin data
    //                     console.warn('Unexpected error, creating basic profile without stablecoin data');
    //                     await createBasicUserProfile({
    //                         clerkUserId: user.id,
    //                         email: user.emailAddresses[0].emailAddress,
    //                         firstName: user.firstName || '',
    //                         lastName: user.lastName || '',
    //                     });
    //                 }
    //             }
    //         };

    //         createBasicProfileWithStablecoin();
    //     }
    // }, [user, userProfile, isLoaded, createBasicUserProfile]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
                            <p className="text-gray-600">Please wait while we load your dashboard.</p>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
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
                <Footer />
            </div>
        );
    }

    // Check if user profile is still loading
    if (user && userProfile === undefined) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Loading Profile...</h2>
                            <p className="text-gray-600">Please wait while we load your profile.</p>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    // Check if user has a role assigned
    const hasRole = userProfile && userProfile.role;

    if (!hasRole) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <UserRegistration />
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Dashboard />
            <Footer />
        </div>
    );
} 