import { LZC_TOKEN_NAME } from '../../../constants/tokens';
import { toast } from 'sonner';

export interface WalletBalances {
    walletBalance: number;
    ledgerBalance: number;
}

export class WalletService {
    private static instance: WalletService;

    private constructor() { }

    public static getInstance(): WalletService {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }

    async fetchBalances(userId: string): Promise<WalletBalances> {
        try {
            const res = await fetch(`/api/stablecoin/balance/${encodeURIComponent(userId)}`);

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                const errorMessage = errorBody?.message || 'Failed to fetch balances';
                const statusCode = res.status;

                console.log('Balance fetch error:', { errorMessage, statusCode, userId });

                // Handle different error cases gracefully
                if (statusCode === 404 || errorMessage.includes('not found') || errorMessage.includes('User not found')) {
                    // User doesn't exist in stablecoin system yet - this is normal during onboarding
                    console.log('User not found in stablecoin system, returning default balances');
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                if (statusCode === 401 || statusCode === 403) {
                    // Authentication/authorization errors - show toast
                    toast.error('Unable to load wallet balance. Please try again later.');
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                if (statusCode >= 500) {
                    // Server errors - show toast
                    toast.error('Unable to load wallet balance. Please try again later.');
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                // For other errors, just return default values without showing toast
                return { walletBalance: 0, ledgerBalance: 0 };
            }

            const data = await res.json();
            const tokens: Array<{ name: string; balance: string | number; }> = data?.tokens || [];
            const zarToken = tokens.find(t => t.name === LZC_TOKEN_NAME);
            const walletBalance = zarToken ? Number(zarToken.balance) : 0;
            // For now, ledger mirrors wallet until we have pending/holds sourced
            const ledgerBalance = walletBalance;
            return { walletBalance, ledgerBalance };
        } catch (error) {
            console.log('Network error fetching balances:', error);

            // Only show toast for network errors, not for expected cases
            toast.error('Unable to load wallet balance. Please check your connection and try again.');

            // Return default values on error
            return { walletBalance: 0, ledgerBalance: 0 };
        }
    }
}

export const walletService = WalletService.getInstance(); 