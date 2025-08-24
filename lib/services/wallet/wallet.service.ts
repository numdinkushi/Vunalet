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

                // Don't show error toasts for expected scenarios
                if (statusCode === 404 || errorMessage.includes('not found') || errorMessage.includes('User not found')) {
                    console.log('User not found in payment system - this is expected for new users');
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                // Only show error toasts for unexpected errors
                if (statusCode >= 500) {
                    console.log('Payment system error:', errorMessage);
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                console.log('Balance fetch error:', errorMessage);
                return { walletBalance: 0, ledgerBalance: 0 };
            }

            const data = await res.json();
            const tokens: Array<{ name: string; balance: string | number; }> = data?.tokens || [];
            const zarToken = tokens.find(t => t.name === LZC_TOKEN_NAME);
            const walletBalance = zarToken ? Number(zarToken.balance) : 0;

            return { walletBalance, ledgerBalance: 0 };
        } catch (error) {
            console.log('Network error fetching balances:', error);
            return { walletBalance: 0, ledgerBalance: 0 };
        }
    }
}

export const walletService = WalletService.getInstance(); 