'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Wallet, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWalletBalance } from '@/hooks/use-wallet-balance';
import { Currency } from '@/constants';

interface BalanceDisplayProps {
    showActions?: boolean;
    compact?: boolean;
}

export function BalanceDisplay({ showActions = true, compact = false }: BalanceDisplayProps) {
    const {
        celoBalance,
        celoBalanceFormatted,
        celoBalanceLoading,
        liskZarBalance,
        liskZarBalanceLoading,
        isWalletConnected,
        walletAddress,
        refreshBalances,
    } = useWalletBalance();

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (compact) {
        return (
            <div className="flex items-center gap-4">
                {/* Lisk ZAR Balance */}
                <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                        R {liskZarBalance.toFixed(2)}
                    </span>
                    {liskZarBalanceLoading && (
                        <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                    )}
                </div>

                {/* CELO Balance */}
                {isWalletConnected && (
                    <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                            {celoBalanceFormatted} {Currency.CELO}
                        </span>
                        {celoBalanceLoading && (
                            <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Lisk ZAR Balance Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-green-600" />
                            Lisk ZAR Balance
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            Instant
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                R {liskZarBalance.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Available for payments
                            </div>
                        </div>
                        {liskZarBalanceLoading && (
                            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* CELO Balance Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-blue-600" />
                            CELO Balance
                        </div>
                        <div className="flex items-center gap-2">
                            {isWalletConnected ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                            )}
                            <Badge variant={isWalletConnected ? "default" : "secondary"} className="text-xs">
                                {isWalletConnected ? "Connected" : "Not Connected"}
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    {isWalletConnected ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                        {celoBalanceFormatted} {Currency.CELO}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Available for payments
                                    </div>
                                </div>
                                {celoBalanceLoading && (
                                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                                )}
                            </div>
                            
                            {walletAddress && (
                                <div className="text-xs text-muted-foreground">
                                    Wallet: {formatAddress(walletAddress)}
                                </div>
                            )}

                            {showActions && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refreshBalances()}
                                    disabled={celoBalanceLoading}
                                    className="w-full"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh Balance
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="text-muted-foreground mb-2">
                                Connect your wallet to see CELO balance
                            </div>
                            <Badge variant="outline" className="text-xs">
                                Wallet Not Connected
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
