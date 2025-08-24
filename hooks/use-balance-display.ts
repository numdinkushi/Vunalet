import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { api } from '../convex/_generated/api';
import { LZC_TOKEN_NAME } from '../constants/tokens';

export function useBalanceDisplay() {
    const { user } = useUser();
    const [isWalletBalanceLoading, setIsWalletBalanceLoading] = useState(false);
    const [walletBalanceError, setWalletBalanceError] = useState<string | null>(null);

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

    // Refresh wallet balance from stablecoin API
    const refreshWalletBalance = async () => {
        if (!user?.id || !userProfile?.liskId) return;

        setIsWalletBalanceLoading(true);
        setWalletBalanceError(null);

        try {
            const { walletService } = await import('../lib/services/wallet/wallet.service');
            const balances = await walletService.fetchBalances(userProfile.liskId);

            await upsertBalance({
                clerkUserId: user.id,
                token: LZC_TOKEN_NAME,
                walletBalance: balances.walletBalance,
                ledgerBalance: ledgerBalance, // Preserve existing ledger balance
            });
        } catch (error) {
            console.log('Failed to refresh wallet balance:', error);
            setWalletBalanceError('Failed to refresh wallet balance');
        } finally {
            setIsWalletBalanceLoading(false);
        }
    };

    // Auto-refresh wallet balance when component mounts and user profile is loaded
    useEffect(() => {
        if (user?.id && userProfile?.liskId && !isWalletBalanceLoading) {
            refreshWalletBalance();
        }
    }, [user?.id, userProfile?.liskId]);

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

    // Format wallet balance with loading state
    const formatWalletBalance = () => {
        if (isWalletBalanceLoading) {
            return 'Loading...';
        }
        if (walletBalanceError) {
            return 'Error';
        }
        return `R${walletBalance.toFixed(2)}`;
    };

    // Get wallet balance display color
    const getWalletBalanceColor = () => {
        if (isWalletBalanceLoading) {
            return 'text-gray-500';
        }
        if (walletBalanceError) {
            return 'text-red-500';
        }
        return getBalanceColor('wallet', walletBalance);
    };

    // Get wallet balance icon
    const getWalletBalanceIcon = () => {
        if (isWalletBalanceLoading) {
            return '⏳';
        }
        if (walletBalanceError) {
            return '⚠️';
        }
        return getBalanceIcon('wallet', walletBalance);
    };

    return {
        walletBalance,
        ledgerBalance,
        isWalletBalanceLoading,
        walletBalanceError,
        refreshWalletBalance,
        getBalanceColor,
        getBalanceIcon,
        formatLedgerBalance,
        formatWalletBalance,
        getWalletBalanceColor,
        getWalletBalanceIcon,
        userRole: userProfile?.role,
    };
} 