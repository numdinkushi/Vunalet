# API Call Flow - Clean Architecture

## Complete Flow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │    │   Integration    │    │   API Layer     │
│   Component     │    │   Service        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. User Registration │                       │
         │─────────────────────▶│                       │
         │                       │                       │
         │                       │ 2. Create User       │
         │                       │─────────────────────▶│
         │                       │                       │
         │                       │                       │ 3. HTTP Request
         │                       │                       │─────────────────┐
         │                       │                       │                 │
         │                       │                       │                 ▼
         │                       │                       │    ┌─────────────────┐
         │                       │                       │    │   Next.js API   │
         │                       │                       │    │   Route          │
         │                       │                       │    └─────────────────┘
         │                       │                       │                 │
         │                       │                       │                 │ 4. Validate
         │                       │                       │                 │ & Forward
         │                       │                       │                 ▼
         │                       │                       │    ┌─────────────────┐
         │                       │                       │    │   External      │
         │                       │                       │    │   Stablecoin API│
         │                       │                       │    └─────────────────┘
         │                       │                       │                 │
         │                       │                       │                 │ 5. Response
         │                       │                       │                 │
         │                       │                       │◀─────────────────│
         │                       │                       │                 │
         │                       │                       │ 6. Format        │
         │                       │                       │    Response      │
         │                       │                       │                 │
         │                       │◀──────────────────────│                 │
         │                       │                       │                 │
         │                       │ 7. Process Result     │                 │
         │                       │    & Return Data      │                 │
         │                       │                       │                 │
         │◀──────────────────────│                       │                 │
         │                       │                       │                 │
         │ 8. Update Convex      │                       │                 │
         │    Database           │                       │                 │
         │                       │                       │                 │
```

## Detailed Step-by-Step Flow

### 1. **Client Component** (`UserRegistration.tsx`)
```typescript
// User clicks "Register" button
const handleSubmit = async (e: React.FormEvent) => {
    const integrationResult = await userIntegrationService.completeUserIntegration({
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: formData.firstName,
        lastName: formData.lastName,
    });
};
```

### 2. **Integration Service** (`user-integration.service.ts`)
```typescript
// Orchestrates the entire flow
async completeUserIntegration(userData: UserIntegrationData): Promise<IntegrationResult> {
    // Step 1: Create user in stablecoin system
    const result = await this.createStablecoinUser(userData);
    
    // Step 2: Return data for Convex update
    return {
        success: true,
        stablecoinUser: result.stablecoinUser,
    };
}
```

### 3. **API Service** (`stablecoin-api.ts`)
```typescript
// Makes HTTP request using base client
async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await this.httpClient.post<CreateUserResponse>('/users', userData);
    return response;
}
```

### 4. **HTTP Client** (`http-client.ts`)
```typescript
// Handles all HTTP communication with error handling
async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>('POST', url, data, config);
}
```

### 5. **Next.js API Route** (`/api/stablecoin/users.ts`)
```typescript
// Validates and forwards to external API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Validate request
    const validation = validateRequest(req.body);
    
    // Create user in external API
    const userData = await createUserInExternalApi({ email, firstName, lastName });
    
    // Return response
    return res.status(200).json(userData);
}
```

### 6. **External Stablecoin API**
- **URL**: `https://seal-app-qp9cc.ondigitalocean.app/api/v1/users`
- **Method**: POST
- **Headers**: Authorization, Content-Type
- **Body**: `{ email, firstName, lastName }`

### 7. **Response Flow Back**
```
External API → Next.js API → HTTP Client → API Service → Integration Service → Client
```

### 8. **Convex Database Update**
```typescript
// Update user profile with stablecoin data
const convexResult = await createUserWithStablecoinIntegration({
    clerkUserId: user.id,
    // ... other user data
    liskId: integrationResult.stablecoinUser?.id,
    publicKey: integrationResult.stablecoinUser?.publicKey,
    paymentIdentifier: integrationResult.stablecoinUser?.paymentIdentifier,
});
```

## Error Handling Flow

```
Error occurs → HTTP Client → API Service → Integration Service → Client
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
Standardized → Formatted → Business → User-friendly → Toast
ApiError     → Error     → Logic     → Message     → Display
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Error Handling**: Consistent error handling at every level
3. **Type Safety**: Full TypeScript support throughout the flow
4. **Testability**: Each layer can be tested independently
5. **Maintainability**: Clear interfaces and documentation
6. **Reusability**: Services can be reused across different components
7. **Scalability**: Easy to add new API endpoints or services 