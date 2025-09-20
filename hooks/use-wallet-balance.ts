import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { formatEther } from 'viem';
import { celo, celoAlfajores } from 'wagmi/chains';

interface WalletBalanceResult {
    // CELO balance
    celoBalance: number;
    celoBalanceFormatted: string;
    celoBalanceLoading: boolean;

    // Lisk ZAR balance
    liskZarBalance: number;
    liskZarBalanceLoading: boolean;

    // Wallet connection status
    isWalletConnected: boolean;
    walletAddress?: string;
    chainId?: number;

    // Actions
    refreshBalances: () => Promise<void>;
    updateCeloBalance: (balance: number) => Promise<void>;
}

export function useWalletBalance(): WalletBalanceResult {
    const { user } = useUser();
    const { address, isConnected, chain } = useAccount();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const lastUpdatedAddress = useRef<string | undefined>(undefined);
    const lastUpdatedChainId = useRef<number | undefined>(undefined);

    // Get user profile with wallet data
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Get CELO balance from blockchain
    const { data: celoBalanceData, isLoading: celoBalanceLoading, refetch: refetchCeloBalance } = useBalance({
        address: address,
        chainId: chain?.id || celo.id,
    });

    // Get CELO balance from database
    const celoBalanceDataDb = useQuery(api.balances.getUserBalanceWithLedger, {
        clerkUserId: user?.id || '',
        token: 'CELO',
        role: userProfile?.role || 'buyer',
    });

    // Get Lisk ZAR balance from database
    const liskZarBalanceData = useQuery(api.balances.getUserBalanceWithLedger, {
        clerkUserId: user?.id || '',
        token: 'L ZAR Coin',
        role: userProfile?.role || 'buyer',
    });

    // Mutations for updating wallet data
    const updateUserWallet = useMutation(api.users.updateWalletData);
    const upsertBalance = useMutation(api.balances.upsertUserBalance);

    // Calculate CELO balance (prefer blockchain data, fallback to DB)
    const celoBalance = celoBalanceData ? parseFloat(formatEther(celoBalanceData.value)) : (celoBalanceDataDb?.walletBalance ?? 0);
    const celoBalanceFormatted = celoBalance.toFixed(6);

    // Calculate Lisk ZAR balance
    const liskZarBalance = liskZarBalanceData?.walletBalance ?? 0;

    // Update CELO balance in database when blockchain balance changes
    useEffect(() => {
        if (user?.id && address && celoBalanceData && celoBalance !== celoBalanceDataDb?.walletBalance) {
            upsertBalance({
                clerkUserId: user.id,
                token: 'CELO',
                walletBalance: celoBalance,
                ledgerBalance: celoBalance, // For CELO, wallet and ledger are the same
            }).catch(console.error);
        }
    }, [user?.id, address, celoBalance, celoBalanceData, celoBalanceDataDb?.walletBalance, chain?.id, upsertBalance]);

    // Update wallet connection data when wallet connects/disconnects
    useEffect(() => {
        // Prevent infinite loop by checking if we've already updated for this address/chain combination
        const hasAddressChanged = address !== lastUpdatedAddress.current;
        const hasChainChanged = chain?.id !== lastUpdatedChainId.current;
        const shouldUpdate = hasAddressChanged || hasChainChanged;

        console.log('Wallet connection effect triggered:', {
            userId: user?.id,
            address,
            isConnected,
            chainId: chain?.id,
            currentWalletAddress: userProfile?.walletAddress,
            hasAddressChanged,
            hasChainChanged,
            shouldUpdate,
            lastUpdatedAddress: lastUpdatedAddress.current,
            lastUpdatedChainId: lastUpdatedChainId.current
        });

        if (user?.id && address && isConnected && shouldUpdate) {
            // Check if connected to CELO network (mainnet: 42220, testnet: 44787)
            const isCeloNetwork = chain?.id === 42220 || chain?.id === 44787;

            console.log('CELO network check:', {
                chainId: chain?.id,
                isCeloNetwork,
                celoAddress: isCeloNetwork ? address : undefined
            });

            // Update wallet data
            updateUserWallet({
                clerkUserId: user.id,
                walletAddress: address,
                celoAddress: isCeloNetwork ? address : undefined, // Only set CELO address on CELO network
                walletConnectedAt: Date.now(),
                walletProvider: 'unknown', // Will be updated by wallet provider detection
            }).then(() => {
                console.log('Wallet data updated successfully');
                // Update the refs to prevent infinite loop
                lastUpdatedAddress.current = address;
                lastUpdatedChainId.current = chain?.id;
            }).catch((error) => {
                console.error('Failed to update wallet data:', error);
            });
        }

        // Reset refs when wallet disconnects
        if (!isConnected) {
            lastUpdatedAddress.current = undefined;
            lastUpdatedChainId.current = undefined;
        }
    }, [user?.id, address, isConnected, updateUserWallet, chain?.id]);

    // Refresh all balances
    const refreshBalances = useCallback(async () => {
        setIsRefreshing(true);
        try {
            // Refetch CELO balance from blockchain
            await refetchCeloBalance();

            // Note: Database balances will be refetched automatically by Convex reactivity
        } catch (error) {
            console.error('Failed to refresh balances:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [refetchCeloBalance]);

    // Update CELO balance manually (for post-transaction updates)
    const updateCeloBalance = useCallback(async (balance: number) => {
        if (user?.id && address) {
            try {
                await upsertBalance({
                    clerkUserId: user.id,
                    token: 'CELO',
                    walletBalance: balance,
                    ledgerBalance: balance,
                });
                // Also trigger a blockchain refresh
                await refetchCeloBalance();
            } catch (error) {
                console.error('Failed to update CELO balance:', error);
            }
        }
    }, [user?.id, address, chain?.id, upsertBalance, refetchCeloBalance]);

    return {
        // CELO balance
        celoBalance,
        celoBalanceFormatted,
        celoBalanceLoading: celoBalanceLoading || isRefreshing,

        // Lisk ZAR balance
        liskZarBalance,
        liskZarBalanceLoading: !liskZarBalanceData && !!user?.id,

        // Wallet connection status
        isWalletConnected: isConnected,
        walletAddress: address,
        chainId: chain?.id,

        // Actions
        refreshBalances,
        updateCeloBalance,
    };
}