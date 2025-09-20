'use client';

import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function WalletConnectionTracker() {
    const { user } = useUser();
    const { address, isConnected, chain } = useAccount();
    const updateUserWallet = useMutation(api.users.updateWalletData);
    
    const lastUpdatedAddress = useRef<string | undefined>(undefined);
    const lastUpdatedChainId = useRef<number | undefined>(undefined);

    useEffect(() => {
        // Prevent infinite loop by checking if we've already updated for this address/chain combination
        const hasAddressChanged = address !== lastUpdatedAddress.current;
        const hasChainChanged = chain?.id !== lastUpdatedChainId.current;
        const shouldUpdate = hasAddressChanged || hasChainChanged;

        console.log('WalletConnectionTracker: Wallet connection effect triggered:', {
            userId: user?.id,
            address,
            isConnected,
            chainId: chain?.id,
            hasAddressChanged,
            hasChainChanged,
            shouldUpdate,
            lastUpdatedAddress: lastUpdatedAddress.current,
            lastUpdatedChainId: lastUpdatedChainId.current
        });

        if (user?.id && address && isConnected && shouldUpdate) {
            // Check if connected to CELO network (mainnet: 42220, testnet: 44787)
            const isCeloNetwork = chain?.id === 42220 || chain?.id === 44787;

            console.log('WalletConnectionTracker: Updating wallet data:', {
                chainId: chain?.id,
                isCeloNetwork,
                celoAddress: isCeloNetwork ? address : undefined
            });

            // Update wallet data immediately
            updateUserWallet({
                clerkUserId: user.id,
                walletAddress: address,
                celoAddress: isCeloNetwork ? address : undefined,
                walletConnectedAt: Date.now(),
                walletProvider: 'unknown', // Will be updated by wallet provider detection
            }).then(() => {
                console.log('WalletConnectionTracker: Wallet data updated successfully');
                // Update the refs to prevent infinite loop
                lastUpdatedAddress.current = address;
                lastUpdatedChainId.current = chain?.id;
            }).catch((error) => {
                console.error('WalletConnectionTracker: Failed to update wallet data:', error);
            });
        }

        // Reset refs when wallet disconnects
        if (!isConnected) {
            lastUpdatedAddress.current = undefined;
            lastUpdatedChainId.current = undefined;
        }
    }, [user?.id, address, isConnected, updateUserWallet, chain?.id]);

    // This component doesn't render anything
    return null;
}
