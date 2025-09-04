// API Response Types
export interface CreateUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    publicKey: string;
    paymentIdentifier: string;
}

export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
}

export interface PaymentRequest {
    amount: number;
    currency: string;
    paymentIdentifier: string;
    description?: string;
}

export interface PaymentResponse {
    id: string;
    amount: number;
    currency: string;
    status: string;
    paymentIdentifier: string;
    description?: string;
    createdAt: string;
}

// Error Types
export interface ApiError {
    message: string;
    status?: number;
    error?: string;
}

// Integration Types
export interface UserIntegrationData {
    clerkUserId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface IntegrationResult {
    success: boolean;
    stablecoinUser?: CreateUserResponse;
    mintedAmount?: number;
    error?: string;
}

// API Configuration
export interface ApiConfig {
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Response Wrapper
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

// Add balance-related types
export interface TokenBalance {
    name: string;
    balance: string | number;
}

export interface UserBalancesResponse {
    tokens: TokenBalance[];
}

// Mint transaction types
export interface MintTransactionResponse {
    message: string;
    transaction: {
        _type: string;
        accessList: unknown[];
        blockNumber: string | null;
        blockHash: string | null;
        blobVersionedHashes: string | null;
        chainId: string;
        data: string;
        from: string;
        gasLimit: string;
        gasPrice: string | null;
        hash: string;
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
        maxFeePerBlobGas: string | null;
        nonce: number;
        signature: unknown;
    };
}

// Transfer transaction types
export interface TransferRequest {
    transactionAmount: number;
    transactionRecipient: string;
    transactionNotes?: string;
}

export interface TransferTransactionResponse {
    message: string;
    transaction: {
        _type: string;
        accessList: unknown[];
        blockNumber: string | null;
        blockHash: string | null;
        blobVersionedHashes: string | null;
        chainId: string;
        data: string;
        from: string;
        gasLimit: string;
        gasPrice: string | null;
        hash: string;
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
        maxFeePerBlobGas: string | null;
        nonce: number;
        signature: {
            _type: string;
            networkV: string | null;
            r: string;
            s: string;
            v: number;
        };
    };
}

// Bulk transfer types
export interface BulkTransferPayment {
    recipient: string; // paymentIdentifier
    amount: number;
}

export interface BulkTransferRequest {
    payments: BulkTransferPayment[];
    transactionNotes?: string;
}

export interface BulkTransferResponse {
    message: string;
    transaction: {
        _type: string;
        accessList: unknown[];
        blockNumber: string | null;
        blockHash: string | null;
        blobVersionedHashes: string | null;
        chainId: string;
        data: string;
        from: string;
        gasLimit: string;
        gasPrice: string | null;
        hash: string;
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
        maxFeePerBlobGas: string | null;
        nonce: number;
        signature: {
            _type: string;
            networkV: string | null;
            r: string;
            s: string;
            v: number;
        };
        to: string;
        type: number;
        value: string;
    };
    receipt?: {
        _type: string;
        blockHash: string;
        blockNumber: number;
        contractAddress: string | null;
        cumulativeGasUsed: string;
        from: string;
        gasPrice: string;
        blobGasUsed: string | null;
        blobGasPrice: string | null;
        gasUsed: string;
        hash: string;
        index: number;
        logs: unknown[];
        logsBloom: string;
        status: number;
        to: string;
    };
}

// Clerk Webhook Types
export interface ClerkWebhookEvent {
    data: {
        id: string;
        object: string;
        email_addresses: Array<{
            id: string;
            email_address: string;
            verification?: {
                status: string;
                strategy: string;
            };
        }>;
        first_name: string | null;
        last_name: string | null;
        image_url: string | null;
        primary_email_address_id: string | null;
        public_metadata: Record<string, unknown>;
        private_metadata: Record<string, unknown>;
        unsafe_metadata: Record<string, unknown>;
        created_at: number;
        updated_at: number;
        last_sign_in_at: number | null;
        profile_image_url: string | null;
        banned: boolean;
        locked: boolean;
    };
    event_type: 'user.created' | 'user.updated' | 'user.deleted' | 'session.created' | 'session.ended' | 'session.removed' | 'session.revoked';
    object: string;
    type: string;
}

export interface WebhookResponse {
    success: boolean;
    message: string;
    error?: string;
}

export interface BasicUserProfileData {
    clerkUserId: string;
    email: string;
    firstName: string;
    lastName: string;
} 