'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { VideoBackground } from '../../../components/ui/VideoBackground';
import { useMounted } from '@/hooks/use-mounted';
import { useClearSessions } from '@/hooks/use-clear-sessions';
import { useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SignInPage() {
    const { mounted } = useMounted();
    const { clearCurrentSession, clearAllSessions, hasActiveSession } = useClearSessions();
    const { session } = useClerk();

    // Check for active session and clear it every time user visits sign-in page
    useEffect(() => {
        if (mounted && session) {
            console.log('Active session detected, clearing sessions...');
            clearCurrentSession();
            clearAllSessions();
        }
    }, [mounted, session, clearCurrentSession, clearAllSessions]);

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
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