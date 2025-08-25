'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { VideoBackground } from '../../../components/ui/VideoBackground';
import { useMounted } from '@/hooks/use-mounted';
import { useClearSessions } from '@/hooks/use-clear-sessions';
import { useEffect } from 'react';

export default function SignInPage() {
    useMounted();
    const { clearCurrentSession, clearAllSessions } = useClearSessions();

    // Clear any existing session when user visits sign-in page
    useEffect(() => {
        clearCurrentSession();
        clearAllSessions()
    }, []); // Run once on mount

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