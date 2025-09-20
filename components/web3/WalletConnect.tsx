'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CELO_NETWORKS } from '@/constants';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
    const { switchChain, isPending: isSwitching } = useSwitchChain();

    const [showNetworkSwitchDialog, setShowNetworkSwitchDialog] = useState(false);
    const [hasPromptedForSwitch, setHasPromptedForSwitch] = useState(false);

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

    const handleSwitchToCelo = async (chainId: number) => {
        try {
            await switchChain({ chainId });
            toast.success('Successfully switched to Celo network');
            setShowNetworkSwitchDialog(false);
        } catch (error) {
            console.error('Failed to switch network:', error);
            toast.error('Failed to switch network. Please switch manually in your wallet.');
        }
    };

    // Auto-prompt for network switch when wallet connects on wrong network
    useEffect(() => {
        if (isConnected && address && !isCorrectNetwork() && !hasPromptedForSwitch) {
            setShowNetworkSwitchDialog(true);
            setHasPromptedForSwitch(true);
        }

        // Reset the prompt flag when wallet disconnects
        if (!isConnected) {
            setHasPromptedForSwitch(false);
        }
    }, [isConnected, address, chain?.id, hasPromptedForSwitch]);

    if (isConnected && address) {
        return (
            <>
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
                                    Switch to Celo to set your address
                                </div>
                            )}
                        </div>

                        {!isCorrectNetwork() && (
                            <>
                                <DropdownMenuSeparator />
                                <div className="p-2">
                                    <div className="text-xs font-medium mb-2">Switch Network:</div>
                                    <div className="space-y-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs h-7"
                                            onClick={() => handleSwitchToCelo(CELO_NETWORKS.MAINNET.chainId)}
                                            disabled={isSwitching}
                                        >
                                            {isSwitching ? (
                                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                            ) : (
                                                <ArrowRight className="h-3 w-3 mr-1" />
                                            )}
                                            Celo Mainnet
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs h-7"
                                            onClick={() => handleSwitchToCelo(CELO_NETWORKS.ALFAJORES.chainId)}
                                            disabled={isSwitching}
                                        >
                                            {isSwitching ? (
                                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                            ) : (
                                                <ArrowRight className="h-3 w-3 mr-1" />
                                            )}
                                            Alfajores Testnet
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Disconnect
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Network Switch Dialog */}
                <AlertDialog open={showNetworkSwitchDialog} onOpenChange={setShowNetworkSwitchDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                Switch to Celo Network
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Your wallet is connected to <strong>{chain?.name || 'Unknown Network'}</strong>,
                                but Vunalet requires the Celo network to process payments and set your Celo address.
                                <br /><br />
                                Please switch to one of the supported Celo networks:
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                            <div className="space-y-3">
                                <Button
                                    className="w-full justify-between"
                                    onClick={() => handleSwitchToCelo(CELO_NETWORKS.MAINNET.chainId)}
                                    disabled={isSwitching}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Celo Mainnet
                                    </div>
                                    {isSwitching ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ArrowRight className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    onClick={() => handleSwitchToCelo(CELO_NETWORKS.ALFAJORES.chainId)}
                                    disabled={isSwitching}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Alfajores Testnet
                                    </div>
                                    {isSwitching ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ArrowRight className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setShowNetworkSwitchDialog(false)}>
                                Maybe Later
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
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
                    .filter((connector) => connector.id !== 'injected')
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
                                {connector.id === 'metaMask' && (
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