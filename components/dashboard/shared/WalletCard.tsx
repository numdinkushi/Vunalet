import { useBalanceDisplay } from '../../../hooks/use-balance-display';
import { Button } from '../../ui/button';
import { RefreshCw } from 'lucide-react';

interface WalletCardProps {
    className?: string;
}

export function WalletCard({ className = '' }: WalletCardProps) {
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
        <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Wallet Overview</h3>
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
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="flex items-center text-gray-600">
                        <span className="mr-2">{getWalletBalanceIcon()}</span>
                        Available Balance:
                    </span>
                    <span className={`font-bold text-lg ${getWalletBalanceColor()}`}>
                        {formatWalletBalance()}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center text-gray-600">
                        <span className="mr-2">{getBalanceIcon('ledger', ledgerBalance, userRole)}</span>
                        {userRole === 'buyer' ? 'Pending Payment:' : 'Pending Earnings:'}
                    </span>
                    <span className={`font-bold text-lg ${getBalanceColor('ledger', ledgerBalance, userRole)}`}>
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