import { useBalanceDisplay } from '../../../hooks/use-balance-display';
import { Button } from '../../ui/button';
import { RefreshCw } from 'lucide-react';

interface EarnerBalanceCardProps {
    role: 'farmer' | 'dispatcher';
}

export function EarnerBalanceCard({ role }: EarnerBalanceCardProps) {
    const {
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
        getWalletBalanceIcon
    } = useBalanceDisplay();

    const roleLabel = role === 'farmer' ? 'Farmer' : 'Dispatcher';

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{roleLabel} Earnings</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshWalletBalance}
                    disabled={isWalletBalanceLoading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${isWalletBalanceLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="flex items-center">
                        <span className="mr-2">{getWalletBalanceIcon()}</span>
                        Available Balance:
                    </span>
                    <span className={`font-bold ${getWalletBalanceColor()}`}>
                        {formatWalletBalance()}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center">
                        <span className="mr-2">{getBalanceIcon('ledger', ledgerBalance, role)}</span>
                        Pending Earnings:
                    </span>
                    <span className={`font-bold ${getBalanceColor('ledger', ledgerBalance, role)}`}>
                        {formatLedgerBalance(ledgerBalance, role)}
                    </span>
                </div>
                {walletBalanceError && (
                    <div className="text-sm text-red-500 mt-2">
                        {walletBalanceError}
                    </div>
                )}
            </div>
        </div>
    );
} 