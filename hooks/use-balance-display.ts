import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../convex/_generated/api';
import { useState, useEffect } from 'react';

export function useBalanceDisplay() {
    const { user } = useUser();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

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

    const ledgerBalance = balance?.ledgerBalance ?? 0;

    // Fetch wallet balance from stablecoin API
    const fetchWalletBalance = async () => {
        if (!userProfile?.liskId) return;

        try {
            const response = await fetch(`/api/stablecoin/balance/${userProfile.liskId}`);
            if (response.ok) {
                const data = await response.json();
                const tokens = data?.tokens || [];
                const zarToken = tokens.find((t: { name: string; balance: string | number; }) => t.name === 'L ZAR Coin');
                const balance = zarToken ? Number(zarToken.balance) : 0;
                setWalletBalance(balance);
            }
        } catch (error) {
            console.error('Failed to fetch wallet balance:', error);
        }
    };

    // Fetch wallet balance on mount and when userProfile changes
    useEffect(() => {
        fetchWalletBalance();
    }, [userProfile?.liskId]);

    // Check if balance is loading
    const isLoading = balance === undefined;

    const refreshBalance = async () => {
        if (!user?.id || !userProfile?.liskId || isRefreshing) return;

        setIsRefreshing(true);
        try {
            // Fetch fresh wallet balance from stablecoin API
            await fetchWalletBalance();

            // Update Convex with fresh wallet balance
            await upsertBalance({
                clerkUserId: user.id,
                token: 'L ZAR Coin',
                walletBalance: walletBalance, // Use the fresh wallet balance
                ledgerBalance: 0, // Ledger balance is calculated from pending orders
            });
        } catch (error) {
            console.log('Failed to refresh balance:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const getBalanceColor = (type: 'wallet' | 'ledger', amount: number, role?: string) => {
        if (type === 'ledger') {
            if (role === 'buyer') {
                // Buyers: positive ledger balance (money held for pending orders)
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