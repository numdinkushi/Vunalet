import { useBalanceDisplay } from '../../../hooks/use-balance-display';
import { Button } from '../../ui/button';
import { RefreshCw } from 'lucide-react';

export function BalanceDisplay() {
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
        getWalletBalanceIcon,
        userRole
    } = useBalanceDisplay();

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Wallet Balance</h3>
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
                        Wallet Balance:
                    </span>
                    <span className={`font-bold ${getWalletBalanceColor()}`}>
                        {formatWalletBalance()}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center">
                        <span className="mr-2">{getBalanceIcon('ledger', ledgerBalance, userRole)}</span>
                        {userRole === 'buyer' ? 'Pending Payment:' : 'Pending Earnings:'}
                    </span>
                    <span className={`font-bold ${getBalanceColor('ledger', ledgerBalance, userRole)}`}>
                        {formatLedgerBalance(ledgerBalance, userRole)}
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