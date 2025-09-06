'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CELO_NETWORKS } from '@/constants';

interface WalletConnectProps {
    size?: 'sm' | 'default' | 'lg';
    variant?: 'default' | 'outline' | 'secondary' | 'ghost';
    showFullAddress?: boolean;
}

export function WalletConnect({
    size = 'sm',
    variant = 'outline',
    showFullAddress = false
}: WalletConnectProps) {
    const { address, isConnected, chain } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    const formatAddress = (addr: string) => {
        if (showFullAddress) return addr;
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const getNetworkBadge = () => {
        if (!chain) return null;

        const isMainnet = chain.id === CELO_NETWORKS.MAINNET.chainId;
        const isTestnet = chain.id === CELO_NETWORKS.ALFAJORES.chainId;

        if (isMainnet) {
            return <Badge variant="default" className="text-xs">Celo</Badge>;
        } else if (isTestnet) {
            return <Badge variant="secondary" className="text-xs">Alfajores</Badge>;
        } else {
            return <Badge variant="destructive" className="text-xs">Wrong Network</Badge>;
        }
    };

    const isCorrectNetwork = () => {
        if (!chain) return false;
        return chain.id === CELO_NETWORKS.MAINNET.chainId || chain.id === CELO_NETWORKS.ALFAJORES.chainId;
    };

    if (isConnected && address) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={variant} size={size} className="gap-2">
                        <Wallet className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            {formatAddress(address)}
                        </span>
                        {!isCorrectNetwork() && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <div className="p-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Connected Wallet</span>
                            {getNetworkBadge()}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                            {formatAddress(address)}
                        </div>
                        {!isCorrectNetwork() && (
                            <div className="text-xs text-red-500 mb-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Please switch to Celo network
                            </div>
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} disabled={isPending}>
                    <Wallet className="mr-2 h-4 w-4" />
                    {isPending ? 'Connecting...' : 'Connect Wallet'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 mb-2">
                    <div className="text-sm font-medium mb-1">Connect Wallet</div>
                    <div className="text-xs text-muted-foreground">
                        Choose your preferred wallet to connect
                    </div>
                </div>
                <DropdownMenuSeparator />
                {connectors
                    .filter((connector) => connector.id !== 'injected') // Filter out generic injected connector
                    .map((connector) => (
                        <DropdownMenuItem
                            key={connector.id}
                            onClick={() => connect({ connector })}
                            className="cursor-pointer"
                            disabled={isPending}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Wallet className="h-3 w-3" />
                                </div>
                                <span>{connector.name}</span>
                                {connector.id === 'coinbaseWalletSDK' && (
                                    <Badge variant="secondary" className="text-xs ml-auto">
                                        Recommended
                                    </Badge>
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}
                <DropdownMenuSeparator />
                <div className="p-2 text-xs text-muted-foreground">
                    By connecting, you agree to our terms of service
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 