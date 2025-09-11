'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAccount } from 'wagmi';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function CeloAddressDebugger() {
    const { user } = useUser();
    const { address, isConnected, chain } = useAccount();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    const updateUserWallet = useMutation(api.users.updateWalletData);

    // Prevent hydration mismatch by only showing wallet data after mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleUpdateCeloAddress = async () => {
        if (!user?.id || !address) {
            alert('Please connect your wallet first');
            return;
        }

        setIsUpdating(true);
        try {
            const isCeloNetwork = chain?.id === 42220 || chain?.id === 44787;

            console.log('Manually updating CELO address:', {
                userId: user.id,
                address,
                chainId: chain?.id,
                isCeloNetwork
            });

            await updateUserWallet({
                clerkUserId: user.id,
                walletAddress: address,
                celoAddress: isCeloNetwork ? address : undefined,
                walletConnectedAt: Date.now(),
                walletProvider: 'manual',
            });

            alert('CELO address updated successfully!');
        } catch (error) {
            console.error('Failed to update CELO address:', error);
            alert('Failed to update CELO address: ' + (error as Error).message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>CELO Address Debugger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                    <p><strong>User ID:</strong> {user?.id || 'Not signed in'}</p>
                    <p><strong>Wallet Address:</strong> {isMounted ? (address || 'Not connected') : 'Loading...'}</p>
                    <p><strong>Chain ID:</strong> {isMounted ? (chain?.id || 'Unknown') : 'Loading...'}</p>
                    <p><strong>Is Connected:</strong> {isMounted ? (isConnected ? 'Yes' : 'No') : 'Loading...'}</p>
                    <p><strong>Current CELO Address:</strong> {userProfile?.celoAddress || 'Not set'}</p>
                    <p><strong>Current Wallet Address:</strong> {userProfile?.walletAddress || 'Not set'}</p>
                </div>

                <Button
                    onClick={handleUpdateCeloAddress}
                    disabled={!isConnected || isUpdating || !isMounted}
                    className="w-full"
                >
                    {isUpdating ? 'Updating...' : 'Update CELO Address'}
                </Button>
            </CardContent>
        </Card>
    );
}
