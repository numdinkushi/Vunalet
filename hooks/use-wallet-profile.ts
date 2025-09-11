import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PaymentMethod } from '@/constants';

interface WalletProfileResult {
    // User profile data
    preferredPaymentMethod?: PaymentMethod;
    walletAddress?: string;
    walletConnectedAt?: number;
    walletProvider?: string;
    
    // Actions
    connectWallet: () => Promise<void>;
    setPreferredPaymentMethod: (method: PaymentMethod) => Promise<void>;
    updateWalletData: (data: {
        walletAddress?: string;
        walletConnectedAt?: number;
        walletProvider?: string;
    }) => Promise<void>;
}

export function useWalletProfile(): WalletProfileResult {
    const { user } = useUser();

    // Get user profile
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Mutations
    const updatePreferredPaymentMethod = useMutation(api.users.updatePreferredPaymentMethod);
    const updateWalletData = useMutation(api.users.updateWalletData);

    // Connect wallet (placeholder - actual connection handled by WalletConnect component)
    const connectWallet = async () => {
        // This is a placeholder - actual wallet connection is handled by the WalletConnect component
        // This function can be used to trigger wallet connection prompts
        console.log('Wallet connection should be handled by WalletConnect component');
    };

    // Set preferred payment method
    const setPreferredPaymentMethod = async (method: PaymentMethod) => {
        if (user?.id) {
            try {
                await updatePreferredPaymentMethod({
                    clerkUserId: user.id,
                    preferredPaymentMethod: method,
                });
            } catch (error) {
                console.error('Failed to update preferred payment method:', error);
                throw error;
            }
        }
    };

    // Update wallet data
    const updateWalletDataFunc = async (data: {
        walletAddress?: string;
        celoAddress?: string;
        walletConnectedAt?: number;
        walletProvider?: string;
    }) => {
        if (user?.id) {
            try {
                await updateWalletData({
                    clerkUserId: user.id,
                    ...data,
                });
            } catch (error) {
                console.error('Failed to update wallet data:', error);
                throw error;
            }
        }
    };

    return {
        // User profile data
        preferredPaymentMethod: userProfile?.preferredPaymentMethod as PaymentMethod,
        walletAddress: userProfile?.walletAddress,
        walletConnectedAt: userProfile?.walletConnectedAt,
        walletProvider: userProfile?.walletProvider,
        
        // Actions
        connectWallet,
        setPreferredPaymentMethod,
        updateWalletData: updateWalletDataFunc,
    };
}
