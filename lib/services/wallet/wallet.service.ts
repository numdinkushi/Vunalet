import { LZC_TOKEN_NAME } from '../../../constants/tokens';

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
                throw new Error(errorBody?.message || 'Failed to fetch balances');
            }
            const data = await res.json();
            const tokens: Array<{ name: string; balance: string | number; }> = data?.tokens || [];
            const zarToken = tokens.find(t => t.name === LZC_TOKEN_NAME);
            const walletBalance = zarToken ? Number(zarToken.balance) : 0;
            // For now, ledger mirrors wallet until we have pending/holds sourced
            const ledgerBalance = walletBalance;
            return { walletBalance, ledgerBalance };
        } catch (error) {
            console.error('Error fetching balances:', error);
            // Return default values on error
            return { walletBalance: 0, ledgerBalance: 0 };
        }
    }
}

export const walletService = WalletService.getInstance(); 