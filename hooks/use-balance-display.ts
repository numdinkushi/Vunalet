import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../convex/_generated/api';
import { useState } from 'react';

export function useBalanceDisplay() {
    const { user } = useUser();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Get user profile to determine role
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    const balance = useQuery(api.balances.getUserBalanceWithLedger, {
        clerkUserId: user?.id || '',
        token: 'L ZAR Coin',
        role: userProfile?.role || 'buyer',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertBalance = useMutation((api as unknown as any).balances.upsertUserBalance);

    const walletBalance = balance?.walletBalance ?? 0;
    const ledgerBalance = balance?.ledgerBalance ?? 0;

    // Check if balance is loading
    const isLoading = balance === undefined;

    const refreshBalance = async () => {
        if (!user?.id || !userProfile?.liskId || isRefreshing) return;

        setIsRefreshing(true);
        try {
            const { walletService } = await import('../lib/services/wallet/wallet.service');
            const balances = await walletService.fetchBalances(userProfile.liskId!);

            // Only update wallet balance, preserve existing ledger balance
            const currentBalance = await getCurrentBalance();

            await upsertBalance({
                clerkUserId: user.id,
                token: 'L ZAR Coin',
                walletBalance: balances.walletBalance, // Update from Lisk
                ledgerBalance: currentBalance?.ledgerBalance || 0, // Keep existing ledger balance
            });
        } catch (error) {
            console.log('Failed to refresh balance:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Helper function to get current balance
    const getCurrentBalance = async () => {
        try {
            const balance = await fetch(`/api/balances/${user?.id}`).then(r => r.json());
            return balance;
        } catch (error) {
            return null;
        }
    };

    const getBalanceColor = (type: 'wallet' | 'ledger', amount: number, role?: string) => {
        if (type === 'ledger') {
            if (role === 'buyer') {
                // Buyers: negative ledger balance (money held for pending orders)
                return amount > 0 ? 'text-red-500' : 'text-gray-500';
            } else if (role === 'farmer' || role === 'dispatcher') {
                // Farmers/Dispatchers: positive ledger balance (money to be earned)
                return amount > 0 ? 'text-green-500' : 'text-gray-500';
            }
            return amount > 0 ? 'text-green-500' : amount < 0 ? 'text-red-500' : 'text-gray-500';
        }
        return 'text-blue-500';
    };

    const getBalanceIcon = (type: 'wallet' | 'ledger', amount: number, role?: string) => {
        if (type === 'ledger') {
            if (role === 'buyer') {
                return amount > 0 ? '↘️' : '➖'; // Down arrow for buyers (money held)
            } else if (role === 'farmer' || role === 'dispatcher') {
                return amount > 0 ? '↗️' : '➖'; // Up arrow for earners (money to be received)
            }
            return amount > 0 ? '↗️' : amount < 0 ? '↘️' : '➖';
        }
        return '💰';
    };

    const formatLedgerBalance = (amount: number, role?: string) => {
        if (role === 'buyer') {
            return amount > 0 ? `-R${amount.toFixed(2)}` : `R${amount.toFixed(2)}`;
        } else if (role === 'farmer' || role === 'dispatcher') {
            return amount > 0 ? `+R${amount.toFixed(2)}` : `R${amount.toFixed(2)}`;
        }
        return `R${amount.toFixed(2)}`;
    };

    return {
        walletBalance,
        ledgerBalance,
        isLoading,
        isRefreshing,
        refreshBalance,
        getBalanceColor,
        getBalanceIcon,
        formatLedgerBalance,
        userRole: userProfile?.role,
    };
} 