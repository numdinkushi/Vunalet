# Services Architecture

This directory contains a clean, well-structured service layer following SOLID and DRY principles.

## Directory Structure

```
services/
├── api/                    # API-related services
│   ├── types.ts           # Shared types and interfaces
│   ├── http-client.ts     # Base HTTP client
│   └── stablecoin-api.ts  # Stablecoin API service
├── integration/            # Integration services
│   └── user-integration.service.ts
├── payment/               # Payment services
│   └── payment.service.ts
├── index.ts               # Main exports
└── README.md             # This file
```

## Architecture Principles

### 1. **Single Responsibility Principle (SRP)**
Each service has one clear responsibility:
- `HttpClient`: Handles HTTP communication
- `StablecoinApiService`: Manages stablecoin API calls
- `UserIntegrationService`: Orchestrates user creation across systems
- `PaymentService`: Handles payment processing

### 2. **Dependency Inversion Principle (DIP)**
Services depend on abstractions, not concrete implementations:
- All services use the base `HttpClient`
- Services are injected where needed

### 3. **Open/Closed Principle (OCP)**
Easy to extend without modifying existing code:
- New API services can extend `HttpClient`
- New payment methods can extend `PaymentService`

### 4. **DRY (Don't Repeat Yourself)**
Common functionality is shared:
- Error handling in `HttpClient`
- Type definitions in `types.ts`
- Validation logic in services

## Service Usage

### API Services

```typescript
import { stablecoinApi } from '@/lib/services/api/stablecoin-api';

// Create user
const user = await stablecoinApi.createUser({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
});

// Create payment
const payment = await stablecoinApi.createPayment({
    amount: 100,
    currency: 'ZAR',
    paymentIdentifier: 'user-payment-id',
    description: 'Order payment'
});
```

### Integration Services

```typescript
import { userIntegrationService } from '@/lib/services/integration/user-integration.service';

// Complete user integration
const result = await userIntegrationService.completeUserIntegration({
    clerkUserId: 'clerk-user-id',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
});

if (result.success) {
    // Use result.stablecoinUser for Convex update
    console.log('User created:', result.stablecoinUser);
}
```

### Payment Services

```typescript
import { paymentService } from '@/lib/services/payment/payment.service';

// Process payment
const payment = await paymentService.processPayment(
    100.50,
    'user-payment-id',
    'Order #123'
);

// Validate payment data
const isValid = paymentService.validatePaymentData(100, 'payment-id');

// Format amount
const formatted = paymentService.formatAmount(100.50); // "R 100.50"
```

## Error Handling

All services use standardized error handling:

```typescript
try {
    const result = await stablecoinApi.createUser(userData);
} catch (error) {
    // Error is already formatted as ApiError
    console.error(error.message);
    toast.error(error.message);
}
```

## Configuration

Services are configured through environment variables:

```env
NEXT_PUBLIC_BASE_URL=https://api.example.com
NEXT_PRIVATE_API_KEY=your-api-key
```

## Testing

Each service can be tested independently:

```typescript
// Test HTTP client
const httpClient = new HttpClient(config);
const response = await httpClient.get('/test');

// Test API service
const apiService = new StablecoinApiService();
const user = await apiService.createUser(userData);

// Test integration service
const integrationService = new UserIntegrationService();
const result = await integrationService.completeUserIntegration(userData);
```

## Migration from Old Services

The old services are still available for backward compatibility:

```typescript
// Old way (still works)
import { userIntegrationService } from '@/lib/services/userIntegrationService';

// New way (recommended)
import { userIntegrationService } from '@/lib/services/integration/user-integration.service';
```

## Benefits

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Each service can be tested independently
3. **Reusability**: Services can be reused across components
4. **Type Safety**: Full TypeScript support with shared types
5. **Error Handling**: Consistent error handling across all services
6. **Documentation**: Clear interfaces and documentation 