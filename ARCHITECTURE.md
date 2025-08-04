# Vunalet POS Application Architecture

## Overview

Vunalet is a comprehensive Point of Sale (POS) application designed for the South African community, specifically for the Lisk ZAR Stablecoin Payments Hackathon. The application connects farmers, dispatchers, and buyers in a seamless ecosystem for fresh produce transactions.

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Authentication**: Clerk
- **Database**: Convex (Real-time database)
- **UI Components**: Radix UI + Tailwind CSS
- **Payments**: Lisk ZAR Stablecoin API
- **File Storage**: Cloudinary (for product images)
- **Maps**: Google Maps API (for delivery tracking)

## User Registration & Role Management Architecture

### 1. **Hybrid Authentication Approach**

We use a **hybrid approach** combining Clerk's built-in role management with Convex for extended user data:

```typescript
// Clerk User Metadata
{
  role: 'farmer' | 'dispatcher' | 'buyer',
  isProfileComplete: boolean
}

// Convex User Profile (extends Clerk data)
{
  clerkUserId: string,
  email: string,
  role: 'farmer' | 'dispatcher' | 'buyer',
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
  location: string,
  coordinates: { lat: number, lng: number },
  businessName?: string,
  businessLicense?: string,
  // Lisk ZAR API integration
  liskId?: string,
  publicKey?: string,
  paymentIdentifier?: string,
  isVerified: boolean
}
```

### 2. **User Registration Flow**

1. **Initial Sign Up**: User signs up with Clerk (email/password)
2. **Role Selection**: User chooses their role (Farmer/Dispatcher/Buyer)
3. **Profile Completion**: User fills additional profile information
4. **Verification**: Admin can verify users (optional)
5. **Dashboard Access**: User gets access to role-specific dashboard

### 3. **Database Schema**

#### User Profiles Table
```typescript
userProfiles: {
  clerkUserId: string,
  email: string,
  role: 'farmer' | 'dispatcher' | 'buyer',
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
  location: string,
  coordinates: { lat: number, lng: number },
  businessName?: string,
  businessLicense?: string,
  // Lisk ZAR API integration
  liskId?: string,
  publicKey?: string,
  paymentIdentifier?: string,
  isVerified: boolean,
  createdAt: number,
  updatedAt: number
}
```

#### Products Table
```typescript
products: {
  farmerId: string,
  name: string,
  category: string,
  price: number,
  unit: string,
  quantity: number,
  description?: string,
  images: string[],
  harvestDate: string,
  expiryDate?: string,
  isOrganic?: boolean,
  isFeatured: boolean,
  location: string,
  coordinates?: { lat: number, lng: number },
  status: 'active' | 'inactive' | 'out_of_stock',
  createdAt: number,
  updatedAt: number
}
```

#### Orders Table
```typescript
orders: {
  buyerId: string,
  farmerId: string,
  dispatcherId?: string,
  products: Array<{
    productId: string,
    name: string,
    price: number,
    quantity: number,
    unit: string
  }>,
  totalAmount: number,
  deliveryAddress: string,
  deliveryCoordinates?: { lat: number, lng: number },
  deliveryDistance: number,
  deliveryCost: number,
  totalCost: number,
  paymentMethod: 'lisk_zar' | 'cash',
  paymentStatus: 'pending' | 'paid' | 'failed',
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled',
  specialInstructions?: string,
  estimatedDeliveryTime?: string,
  actualDeliveryTime?: string,
  createdAt: number,
  updatedAt: number
}
```

### 4. **Role-Based Dashboards**

#### Farmer Dashboard
- **Overview**: Revenue stats, recent orders, product count
- **Products**: Add/edit products, manage inventory
- **Orders**: View and manage incoming orders
- **Analytics**: Sales performance, popular products

#### Dispatcher Dashboard
- **Overview**: Delivery stats, active deliveries
- **Active Deliveries**: Current assignments with navigation
- **Completed**: Delivery history and earnings
- **Tracking**: Real-time delivery status updates

#### Buyer Dashboard
- **Overview**: Order history, total spent
- **Active Orders**: Track current orders
- **Order History**: Completed and cancelled orders
- **Favorites**: Saved products and farmers

### 5. **Integration with Lisk ZAR API**

The application integrates with the Lisk ZAR Stablecoin API for payments and user management:

#### User Registration Flow
```typescript
1. User signs up with Clerk
2. User completes profile with role selection
3. System creates user in Lisk ZAR API
4. Lisk ZAR returns: { id, publicKey, paymentIdentifier }
5. System stores Lisk data in Convex user profile
6. User can now make payments using their payment identifier
```

#### Payment Flow
```typescript
1. Buyer selects products and checkout
2. System calculates total (products + delivery)
3. Payment request sent to Lisk ZAR API using user's paymentIdentifier
4. Payment confirmation updates order status
5. Dispatcher assigned for delivery
```

#### Lisk ZAR API Integration
- **User Creation**: Automatically creates Lisk ZAR user during registration
- **Payment Processing**: Uses paymentIdentifier for secure transactions
- **Balance Tracking**: Real-time balance updates
- **Transaction History**: Complete payment history tracking

### 6. **Key Features by Role**

#### Farmers
- Product catalog management
- Order fulfillment
- Revenue tracking
- Customer communication
- Inventory management

#### Dispatchers
- Delivery assignment
- Route optimization
- Real-time tracking
- Delivery confirmation
- Earnings tracking

#### Buyers
- Product browsing
- Order placement
- Payment processing
- Order tracking
- Review system

### 7. **Security & Permissions**

- **Clerk Authentication**: Handles user authentication and session management
- **Role-Based Access**: Different dashboards and permissions based on user role
- **Data Validation**: Convex schema validation for all data operations
- **API Security**: Secure integration with Lisk ZAR API

### 8. **Real-time Features**

- **Live Order Updates**: Real-time order status changes
- **Inventory Sync**: Live product availability updates
- **Delivery Tracking**: Real-time delivery location updates
- **Notifications**: Push notifications for order updates

### 9. **Mobile-First Design**

- **PWA Support**: Installable as mobile app
- **Responsive Design**: Works on all device sizes
- **Offline Capability**: Basic functionality when offline
- **Touch-Optimized**: Mobile-friendly interface

### 10. **Deployment Architecture**

```
Frontend (Next.js) → Vercel
Database (Convex) → Convex Cloud
Authentication (Clerk) → Clerk Cloud
File Storage (Cloudinary) → Cloudinary
Payments (Lisk ZAR) → Lisk API
```

## Getting Started

1. **Setup Environment Variables**:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   LISK_ZAR_API_KEY=your_lisk_api_key
   LISK_ZAR_API_URL=https://stablecoin-api-docs.vercel.app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Convex**:
   ```bash
   npx convex dev
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Future Enhancements

- **AI-Powered Recommendations**: Product suggestions based on user behavior
- **Advanced Analytics**: Detailed business insights for farmers
- **Multi-language Support**: Support for South African languages
- **Blockchain Integration**: Enhanced transparency with blockchain
- **IoT Integration**: Smart farming equipment integration
- **Advanced Logistics**: Route optimization and fleet management

This architecture provides a scalable, secure, and user-friendly platform for the South African agricultural community while leveraging modern web technologies and blockchain payments. 