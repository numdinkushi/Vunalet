'use client';

import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Link from 'next/link';

export function CallToAction() {
    const { user } = useUser();

    // Get user profile to check if they have completed onboarding
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Check if user has completed profile setup (has a role)
    const hasCompletedProfile = userProfile?.role && userProfile?.liskId;

    // Only show CTA for users who haven't completed their profile
    if (hasCompletedProfile) {
        return null;
    }

    return (
        <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Network</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Are you a South African farmer looking to connect directly with consumers?
                Join our platform and start selling your fresh produce today.
            </p>
            <Link href="/dashboard">
                <motion.button
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Become a Farmer
                </motion.button>
            </Link>
        </motion.div>
    );
} 