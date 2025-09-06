// Payment method enums
export enum PaymentMethod {
    LISK_ZAR = 'lisk_zar',
    CELO = 'celo',
    CASH = 'cash'
}

// Payment status enums
export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed'
}

// Order status enums
export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    READY = 'ready',
    IN_TRANSIT = 'in_transit',
    ARRIVED = 'arrived',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

// Currency types
export enum Currency {
    ZAR = 'ZAR',
    CELO = 'CELO',
    USD = 'USD'
}

// Conversion rates (configurable)
export const CONVERSION_RATES = {
    // 1 ZAR = 0.003 CELO (example rate - should be fetched from API in production)
    ZAR_TO_CELO: 0.003,
    // 1 CELO = 333.33 ZAR (inverse of above)
    CELO_TO_ZAR: 333.33,
    // Platform fee rates
    PLATFORM_FEE_RATE_BASIS_POINTS: 250, // 2.5%
    PLATFORM_FEE_RATE_PERCENTAGE: 2.5,
} as const;

// Network configuration
export const CELO_NETWORKS = {
    MAINNET: {
        chainId: 42220,
        name: 'Celo Mainnet',
        rpcUrl: 'https://forno.celo.org',
        blockExplorer: 'https://celoscan.io',
        apiUrl: 'https://api.celoscan.io/api'
    },
    ALFAJORES: {
        chainId: 44787,
        name: 'Celo Alfajores Testnet',
        rpcUrl: 'https://alfajores-forno.celo-testnet.org',
        blockExplorer: 'https://alfajores.celoscan.io',
        apiUrl: 'https://api-alfajores.celoscan.io/api'
    }
} as const;

// Payment method display names
export const PAYMENT_METHOD_LABELS = {
    [PaymentMethod.LISK_ZAR]: 'Lisk ZAR Stablecoin',
    [PaymentMethod.CELO]: 'Celo Blockchain',
    [PaymentMethod.CASH]: 'Cash on Delivery'
} as const;

// Payment method descriptions
export const PAYMENT_METHOD_DESCRIPTIONS = {
    [PaymentMethod.LISK_ZAR]: 'Pay with ZAR stablecoin through our integrated payment system',
    [PaymentMethod.CELO]: 'Pay directly with CELO using your Web3 wallet',
    [PaymentMethod.CASH]: 'Pay with cash when your order is delivered'
} as const;

// Frontend authorization configuration
export const PAYMENT_SECURITY = {
    // Secret for frontend authorization (should match NEXT_PUBLIC_PAYMENT_SECRET)
    SECRET: process.env.NEXT_PUBLIC_PAYMENT_SECRET || 'vunalet_secure_payments',
} as const;

// Helper functions for conversions
export const convertZarToCelo = (zarAmount: number): number => {
    return Number((zarAmount * CONVERSION_RATES.ZAR_TO_CELO).toFixed(6));
};

export const convertCeloToZar = (celoAmount: number): number => {
    return Number((celoAmount * CONVERSION_RATES.CELO_TO_ZAR).toFixed(2));
};

export const calculatePlatformFee = (amount: number): number => {
    return Number((amount * CONVERSION_RATES.PLATFORM_FEE_RATE_PERCENTAGE / 100).toFixed(6));
};

// Type guards
export const isValidPaymentMethod = (method: string): method is PaymentMethod => {
    return Object.values(PaymentMethod).includes(method as PaymentMethod);
};

export const isValidPaymentStatus = (status: string): status is PaymentStatus => {
    return Object.values(PaymentStatus).includes(status as PaymentStatus);
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
    return Object.values(OrderStatus).includes(status as OrderStatus);
}; 