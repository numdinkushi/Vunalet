'use client';

import { createConfig, http, WagmiProvider } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask, walletConnect } from "wagmi/connectors";
import React from "react";
import { CELO_NETWORKS, WALLET_CONNECT_PROJECT_ID, WALLET_APP_METADATA } from "@/constants";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Create Wagmi configuration with Celo networks
export const wagmiConfig = createConfig({
    chains: [celo, celoAlfajores],
    transports: {
        [celo.id]: http(CELO_NETWORKS.MAINNET.rpcUrl),
        [celoAlfajores.id]: http(CELO_NETWORKS.ALFAJORES.rpcUrl),
    },
    connectors: [
        metaMask({
            dappMetadata: {
                name: WALLET_APP_METADATA.name,
                url: WALLET_APP_METADATA.url,
            },
        }),
        ...(WALLET_CONNECT_PROJECT_ID ? [walletConnect({
            projectId: WALLET_CONNECT_PROJECT_ID,
            metadata: {
                name: WALLET_APP_METADATA.name,
                description: WALLET_APP_METADATA.description,
                url: WALLET_APP_METADATA.url,
                icons: WALLET_APP_METADATA.icons,
            },
        })] : []),
    ],
});

interface Web3ProviderProps {
    children: React.ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
} 