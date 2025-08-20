import { useBalanceDisplay } from '../../../hooks/use-balance-display';

interface EarnerBalanceCardProps {
    role: 'farmer' | 'dispatcher';
}

export function EarnerBalanceCard({ role }: EarnerBalanceCardProps) {
    const { walletBalance, ledgerBalance, getBalanceColor, getBalanceIcon, formatLedgerBalance } = useBalanceDisplay();

    const roleLabel = role === 'farmer' ? 'Farmer' : 'Dispatcher';

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">{roleLabel} Earnings</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="flex items-center">
                        <span className="mr-2">{getBalanceIcon('wallet', walletBalance)}</span>
                        Available Balance:
                    </span>
                    <span className={`font-bold ${getBalanceColor('wallet', walletBalance)}`}>
                        R{walletBalance.toFixed(2)}
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
            </div>
        </div>
    );
} 