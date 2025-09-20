// Contract configuration
export const CELO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CELO_CONTRACT_ADDRESS as `0x${string}`;

// Smart contract ABI for VunaletPayments
export const VUNALET_PAYMENTS_ABI = [
    {
        inputs: [
            { name: "_feeRecipient", type: "address" },
            { name: "_secretHash", type: "bytes32" }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "orderId", type: "string" },
            { indexed: true, name: "buyer", type: "address" },
            { indexed: true, name: "farmer", type: "address" },
            { name: "totalAmount", type: "uint256" }
        ],
        name: "PaymentProcessed",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "orderId", type: "string" },
            { indexed: true, name: "recipient", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "recipientType", type: "string" }
        ],
        name: "PaymentDistributed",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: "oldFee", type: "uint256" },
            { indexed: false, name: "newFee", type: "uint256" }
        ],
        name: "PlatformFeeUpdated",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: "oldRecipient", type: "address" },
            { indexed: false, name: "newRecipient", type: "address" }
        ],
        name: "FeeRecipientUpdated",
        type: "event"
    },
    {
        inputs: [
            { name: "orderId", type: "string" },
            { name: "farmer", type: "address" },
            { name: "dispatcher", type: "address" },
            { name: "farmerAmount", type: "uint256" },
            { name: "dispatcherAmount", type: "uint256" },
            { name: "secret", type: "string" }
        ],
        name: "processOrderPayment",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    {
        inputs: [
            { name: "orderId", type: "string" }
        ],
        name: "getPayment",
        outputs: [
            {
                components: [
                    { name: "buyer", type: "address" },
                    { name: "farmer", type: "address" },
                    { name: "dispatcher", type: "address" },
                    { name: "totalAmount", type: "uint256" },
                    { name: "farmerAmount", type: "uint256" },
                    { name: "dispatcherAmount", type: "uint256" },
                    { name: "orderId", type: "string" },
                    { name: "timestamp", type: "uint256" },
                    { name: "completed", type: "bool" }
                ],
                name: "",
                type: "tuple"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "user", type: "address" }
        ],
        name: "getUserStats",
        outputs: [
            { name: "totalPaid", type: "uint256" },
            { name: "totalEarnedAsFarmer", type: "uint256" },
            { name: "totalEarnedAsDispatcher", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "_feeRate", type: "uint256" }
        ],
        name: "setPlatformFeeRate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "_feeRecipient", type: "address" }
        ],
        name: "setFeeRecipient",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "pause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "unpause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "_secretHash", type: "bytes32" }
        ],
        name: "setSecretHash",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "amount", type: "uint256" }
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        name: "withdrawTo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "emergencyWithdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "getContractBalance",
        outputs: [
            { name: "", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "platformFeeRate",
        outputs: [
            { name: "", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "feeRecipient",
        outputs: [
            { name: "", type: "address" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "secretHash",
        outputs: [
            { name: "", type: "bytes32" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "orderId", type: "string" }
        ],
        name: "payments",
        outputs: [
            { name: "buyer", type: "address" },
            { name: "farmer", type: "address" },
            { name: "dispatcher", type: "address" },
            { name: "totalAmount", type: "uint256" },
            { name: "farmerAmount", type: "uint256" },
            { name: "dispatcherAmount", type: "uint256" },
            { name: "orderId", type: "string" },
            { name: "timestamp", type: "uint256" },
            { name: "completed", type: "bool" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "", type: "address" }
        ],
        name: "userTotalPaid",
        outputs: [
            { name: "", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "", type: "address" }
        ],
        name: "farmerTotalEarned",
        outputs: [
            { name: "", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "", type: "address" }
        ],
        name: "dispatcherTotalEarned",
        outputs: [
            { name: "", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "MAX_FEE_RATE",
        outputs: [
            { name: "", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        stateMutability: "payable",
        type: "receive"
    }
] as const;

// Wallet Connect Project ID
export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

// App metadata for wallet connections
export const WALLET_APP_METADATA = {
    name: 'Vunalet',
    description: 'Fresh produce marketplace connecting farmers and buyers',
    url: process.env.NEXT_PUBLIC_URL || 'https://vunalet.com',
    icons: ['/assets/logo/logo-192x192.png'] as string[]
};

// Divvi referral configuration
export const DIVVI_CONFIG = {
    // Consumer address for Vunalet (you'll need to get this from Divvi)
    consumer: process.env.NEXT_PUBLIC_DIVVI_CONSUMER_ADDRESS || "0x0000000000000000000000000000000000000000",
    // Provider addresses for referral tracking
    providers: [
        "0x0423189886d7966f0dd7e7d256898daeee625dca",
        "0xc95876688026be9d6fa7a7c33328bd013effa2bb",
        "0x5f0a55fad9424ac99429f635dfb9bf20c3360ab8",
    ],
}; 