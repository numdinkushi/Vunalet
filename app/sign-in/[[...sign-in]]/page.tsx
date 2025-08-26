'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { VideoBackground } from '../../../components/ui/VideoBackground';
import { useMounted } from '@/hooks/use-mounted';
import { useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SignInPage() {
    const mounted = useMounted();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Only access Clerk after mounting to prevent hydration mismatch
    const clerk = useClerk();

    console.log('SignInPage - mounted:', mounted);
    console.log('SignInPage - clerk.isSignedIn:', clerk.isSignedIn);
    console.log('SignInPage - shouldRedirect:', shouldRedirect);

    // Check if user is already signed in after mounting
    useEffect(() => {
        if (mounted && clerk.isSignedIn) {
            console.log('SignInPage - User already signed in, redirecting to dashboard...');
            setShouldRedirect(true);
        }
    }, [mounted, clerk.isSignedIn]);

    // Redirect if needed
    useEffect(() => {
        if (shouldRedirect) {
            console.log('SignInPage - Redirecting to dashboard...');
            window.location.href = '/dashboard';
        }
    }, [shouldRedirect]);

    // Show loading state until mounted
    if (!mounted) {
        console.log('SignInPage - Not mounted yet, showing loading...');
        return (
            <div className="min-h-screen relative">
                <div className="absolute inset-0 z-0">
                    <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="w-full max-w-md">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                                <p className="text-gray-600">Sign in to your Vunalet account</p>
                            </div>
                            <div className="animate-pulse">
                                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Don't render SignIn if redirecting
    if (shouldRedirect) {
        console.log('SignInPage - Redirecting, showing redirect message...');
        return (
            <div className="min-h-screen relative">
                <div className="absolute inset-0 z-0">
                    <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="w-full max-w-md">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Redirecting...</h1>
                                <p className="text-gray-600">Taking you to your dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.log('SignInPage - Rendering SignIn component...');
    return (
        <div className="min-h-screen relative">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <VideoBackground videoUrl="/assets/video/falling_leaves.mp4" fallbackImage="/assets/background_images/image4.jpg" />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                            <p className="text-gray-600">Sign in to your Vunalet account</p>
                        </div>

                        <SignIn
                            appearance={{
                                variables: {
                                    colorPrimary: '#147A4E',
                                    colorBackground: 'transparent',
                                    colorText: '#1a1a1a',
                                },
                                elements: {
                                    formButtonPrimary: {
                                        backgroundColor: '#147A4E',
                                        '&:hover': {
                                            backgroundColor: '#0f5a3a',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 