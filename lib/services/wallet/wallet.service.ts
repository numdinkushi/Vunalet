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

                if (statusCode === 404 || errorMessage.includes('not found') || errorMessage.includes('User not found')) {
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                if (statusCode === 401 || statusCode === 403) {
                    toast.error('Unable to load wallet balance. Please try again later.');
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                if (statusCode >= 500) {
                    toast.error('Unable to load wallet balance. Please try again later.');
                    return { walletBalance: 0, ledgerBalance: 0 };
                }

                return { walletBalance: 0, ledgerBalance: 0 };
            }

            const data = await res.json();
            const tokens: Array<{ name: string; balance: string | number; }> = data?.tokens || [];
            const zarToken = tokens.find(t => t.name === LZC_TOKEN_NAME);
            const walletBalance = zarToken ? Number(zarToken.balance) : 0;
            const ledgerBalance = walletBalance;
            return { walletBalance, ledgerBalance };
        } catch (error) {
            toast.error('Unable to load wallet balance. Please check your connection and try again.');
            return { walletBalance: 0, ledgerBalance: 0 };
        }
    }
}

export const walletService = WalletService.getInstance(); 