import { useBalanceDisplay } from '../../../hooks/use-balance-display';
import { BalanceLoading } from '../../ui/balance-loading';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export function BalanceDisplay() {
    const {
        walletBalance,
        ledgerBalance,
        getBalanceColor,
        getBalanceIcon,
        formatLedgerBalance,
        userRole,
        isLoading,
        isRefreshing,
        refreshBalance
    } = useBalanceDisplay();

    if (isLoading) {
        return (
            <BalanceLoading
                showRefreshButton={true}
                onRefresh={refreshBalance}
                isRefreshing={isRefreshing}
            />
        );
    }

    return (
        <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Wallet Balance</h3>
                <motion.button
                    onClick={refreshBalance}
                    disabled={isRefreshing}
                    className={`p-2 rounded-full transition-all duration-300 ${isRefreshing
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                    whileHover={!isRefreshing ? { scale: 1.1 } : {}}
                    whileTap={!isRefreshing ? { scale: 0.9 } : {}}
                    title="Refresh balance"
                >
                    <motion.div
                        animate={isRefreshing ? { rotate: 360 } : {}}
                        transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    >
                        <RefreshCw size={16} />
                    </motion.div>
                </motion.button>
            </div>

            <div className="space-y-3">
                <motion.div
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="flex items-center">
                        <span className="mr-2">{getBalanceIcon('wallet', walletBalance)}</span>
                        Wallet Balance:
                    </span>
                    <span className={`font-bold ${getBalanceColor('wallet', walletBalance)}`}>
                        R{walletBalance.toFixed(2)}
                    </span>
                </motion.div>
                <motion.div
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="flex items-center">
                        <span className="mr-2">{getBalanceIcon('ledger', ledgerBalance, userRole)}</span>
                        {userRole === 'buyer' ? 'Pending Payment:' : 'Pending Earnings:'}
                    </span>
                    <span className={`font-bold ${getBalanceColor('ledger', ledgerBalance, userRole)}`}>
                        {formatLedgerBalance(ledgerBalance, userRole)}
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
} 