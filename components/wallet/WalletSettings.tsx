'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, Settings, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useWalletBalance } from '@/hooks/use-wallet-balance';
import { useWalletProfile } from '@/hooks/use-wallet-profile';
import { WalletConnect } from '@/components/web3/WalletConnect';
import { BalanceDisplay } from './BalanceDisplay';
import { PaymentMethod } from '@/constants';

export function WalletSettings() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const {
        isWalletConnected,
        walletAddress,
        chainId,
        refreshBalances,
    } = useWalletBalance();
    
    const {
        preferredPaymentMethod,
        walletProvider,
        walletConnectedAt,
        setPreferredPaymentMethod,
    } = useWalletProfile();

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshBalances();
        } catch (error) {
            console.error('Failed to refresh balances:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handlePaymentMethodChange = async (method: PaymentMethod) => {
        try {
            await setPreferredPaymentMethod(method);
        } catch (error) {
            console.error('Failed to update payment method:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Wallet Connection Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Wallet Connection
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isWalletConnected ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">Wallet Connected</span>
                                </div>
                                <Badge variant="default" className="text-xs">
                                    Active
                                </Badge>
                            </div>
                            
                            {walletAddress && (
                                <div className="text-sm text-muted-foreground">
                                    Address: {formatAddress(walletAddress)}
                                </div>
                            )}
                            
                            {walletProvider && (
                                <div className="text-sm text-muted-foreground">
                                    Provider: {walletProvider}
                                </div>
                            )}
                            
                            {walletConnectedAt && (
                                <div className="text-sm text-muted-foreground">
                                    Connected: {formatDate(walletConnectedAt)}
                                </div>
                            )}
                            
                            {chainId && (
                                <div className="text-sm text-muted-foreground">
                                    Network: {chainId === 42220 ? 'Celo Mainnet' : chainId === 44787 ? 'Alfajores Testnet' : `Chain ${chainId}`}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                            <div className="text-muted-foreground mb-4">
                                No wallet connected
                            </div>
                            <WalletConnect size="default" variant="default" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Balance Display */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Account Balances
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <BalanceDisplay showActions={false} />
                </CardContent>
            </Card>

            {/* Payment Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Payment Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Preferred Payment Method
                        </label>
                        <div className="grid gap-2">
                            {Object.values(PaymentMethod).map((method) => (
                                <Button
                                    key={method}
                                    variant={preferredPaymentMethod === method ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePaymentMethodChange(method)}
                                    className="justify-start"
                                >
                                    {method === PaymentMethod.LISK_ZAR && "💚"}
                                    {method === PaymentMethod.CELO && "🔵"}
                                    {method === PaymentMethod.CASH && "💵"}
                                    <span className="ml-2 capitalize">
                                        {method.replace('_', ' ')}
                                    </span>
                                    {preferredPaymentMethod === method && (
                                        <CheckCircle className="h-4 w-4 ml-auto" />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-sm text-muted-foreground">
                        <p>
                            Your preferred payment method will be automatically selected 
                            when making purchases, but you can always change it during checkout.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
