import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotEnvConfig } from "dotenv";
// import { CELO_NETWORKS } from "../constants/payments";

dotEnvConfig({ path: "../.env" });

const config: HardhatUserConfig = {
    networks: {
        alfajores: {
            accounts: [process.env.CELO_PRIVATE_KEY ?? "0x0000000000000000000000000000000000000000000000000000000000000001"],
            url: "https://alfajores-forno.celo-testnet.org",
        },
        celo: {
            accounts: [process.env.CELO_PRIVATE_KEY ?? "0x0000000000000000000000000000000000000000000000000000000000000001"],
            url: "https://forno.celo.org",
        },
    },
    etherscan: {
        apiKey: {
            alfajores: process.env.CELOSCAN_API_KEY ?? "",
            celo: process.env.CELOSCAN_API_KEY ?? "",
        },
        customChains: [
            {
                chainId: 44787,
                network: "alfajores",
                urls: {
                    apiURL: "https://api-alfajores.celoscan.io/api",
                    browserURL: "https://alfajores.celoscan.io",
                },
            },
            {
                chainId: 42220,
                network: "celo",
                urls: {
                    apiURL: "https://api.celoscan.io/api",
                    browserURL: "https://celoscan.io",
                },
            },
        ],
    },
    sourcify: {
        enabled: false,
    },
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};

export default config; 