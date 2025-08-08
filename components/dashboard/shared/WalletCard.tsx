import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Wallet, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../buyer/utils';

interface WalletCardProps {
    walletBalance: number;
    ledgerBalance: number;
    className?: string;
}

export function WalletCard({ walletBalance, ledgerBalance, className = '' }: WalletCardProps) {
    const difference = ledgerBalance - walletBalance;
    const isPositive = difference >= 0;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
            {/* Wallet Balance */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-800">Wallet Balance</CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Wallet className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatCurrency(walletBalance)}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Available balance</span>
                    </div>
                </CardContent>
            </Card>

            {/* Ledger Balance */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-800">Ledger Balance</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatCurrency(ledgerBalance)}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Including pending</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            <span>{isPositive ? '+' : ''}{formatCurrency(difference)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 