// Lisk ZAR API service for user management and payments

interface LiskUserResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        publicKey: string;
        paymentIdentifier: string;
    };
}

interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
}

interface PaymentRequest {
    amount: number;
    currency: string;
    paymentIdentifier: string;
    description?: string;
}

interface PaymentResponse {
    id: string;
    status: string;
    amount: number;
    currency: string;
    paymentIdentifier: string;
    createdAt: string;
}

class LiskZarApiService {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = process.env.LISK_ZAR_API_URL || 'https://stablecoin-api-docs.vercel.app';
        this.apiKey = process.env.LISK_ZAR_API_KEY || '';
    }

    private async makeRequest<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        body?: any
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        const config: RequestInit = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.log('Lisk ZAR API request failed:', error);
            throw error;
        }
    }

    // Create a new user in Lisk ZAR system
    async createUser(userData: CreateUserRequest): Promise<LiskUserResponse> {
        return this.makeRequest<LiskUserResponse>('/users', 'POST', userData);
    }

    // Get user by ID
    async getUser(userId: string): Promise<LiskUserResponse> {
        return this.makeRequest<LiskUserResponse>(`/users/${userId}`);
    }

    // Create a payment
    async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
        return this.makeRequest<PaymentResponse>('/payments', 'POST', paymentData);
    }

    // Get payment by ID
    async getPayment(paymentId: string): Promise<PaymentResponse> {
        return this.makeRequest<PaymentResponse>(`/payments/${paymentId}`);
    }

    // Get user's payment history
    async getUserPayments(userId: string): Promise<PaymentResponse[]> {
        return this.makeRequest<PaymentResponse[]>(`/users/${userId}/payments`);
    }

    // Get account balance
    async getBalance(paymentIdentifier: string): Promise<{ balance: number; currency: string; }> {
        return this.makeRequest<{ balance: number; currency: string; }>(`/accounts/${paymentIdentifier}/balance`);
    }

    // Transfer funds between users
    async transferFunds(
        fromPaymentIdentifier: string,
        toPaymentIdentifier: string,
        amount: number,
        description?: string
    ): Promise<PaymentResponse> {
        return this.makeRequest<PaymentResponse>('/transfers', 'POST', {
            fromPaymentIdentifier,
            toPaymentIdentifier,
            amount,
            currency: 'ZAR',
            description,
        });
    }
}

// Export singleton instance
export const liskZarApi = new LiskZarApiService();

// Helper function to create user and update Convex profile
export async function createLiskUserAndUpdateProfile(
    userData: {
        clerkUserId: string;
        email: string;
        firstName: string;
        lastName: string;
    },
    updateProfileFunction: (data: {
        clerkUserId: string;
        liskId: string;
        publicKey: string;
        paymentIdentifier: string;
    }) => Promise<void>
) {
    try {
        // Create user in Lisk ZAR system
        const liskUser = await liskZarApi.createUser({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
        });

        // Update Convex profile with Lisk ZAR data
        await updateProfileFunction({
            clerkUserId: userData.clerkUserId,
            liskId: liskUser.user.id,
            publicKey: liskUser.user.publicKey,
            paymentIdentifier: liskUser.user.paymentIdentifier,
        });

        return liskUser;
    } catch (error) {
        console.log('Failed to create Lisk ZAR user:', error);
        throw error;
    }
}

// Helper function to process payment
export async function processPayment(
    amount: number,
    paymentIdentifier: string,
    description?: string
) {
    try {
        const payment = await liskZarApi.createPayment({
            amount,
            currency: 'ZAR',
            paymentIdentifier,
            description,
        });

        return payment;
    } catch (error) {
        console.log('Failed to process payment:', error);
        throw error;
    }
} 