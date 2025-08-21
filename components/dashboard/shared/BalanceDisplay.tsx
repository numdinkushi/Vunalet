import { useBalanceDisplay } from '../../../hooks/use-balance-display';

export function BalanceDisplay() {
    const { 
        walletBalance, 
        ledgerBalance, 
        getBalanceColor, 
        getBalanceIcon, 
        formatLedgerBalance,
        userRole 
    } = useBalanceDisplay();

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Wallet Balance</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="flex items-center">
                        <span className="mr-2">{getBalanceIcon('wallet', walletBalance)}</span>
                        Wallet Balance:
                    </span>
                    <span className={`font-bold ${getBalanceColor('wallet', walletBalance)}`}>
                        R{walletBalance.toFixed(2)}
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
            </div>
        </div>
    );
} 