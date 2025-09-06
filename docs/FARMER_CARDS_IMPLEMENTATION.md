# Farmer Cards Implementation Guide

This guide explains how to implement farmer cards with comprehensive information using the updated Convex schema and queries.

## Overview

The farmer cards now display rich information including:
- **Profile Information**: Name, location, profile picture, bio
- **Farm Details**: Farm size, experience, specialties, organic certification
- **System-Generated Stats**: Products count, customer count, average rating
- **Interactive Features**: Rating system, product viewing

## Schema Updates

### User Profiles Table
The `userProfiles` table now includes farmer-specific fields:

```typescript
// New farmer-specific fields added to userProfiles
bio: v.optional(v.string()),
farmSize: v.optional(v.string()),
experience: v.optional(v.string()),
specialties: v.optional(v.array(v.string())),
isOrganicCertified: v.optional(v.boolean()),
profilePicture: v.optional(v.string()),
```

### Ratings Table
A new `ratings` table tracks customer reviews:

```typescript
ratings: defineTable({
    farmerId: v.string(),
    buyerId: v.string(),
    orderId: v.string(),
    rating: v.number(), // 1-5 stars
    review: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
})
```

## Key Queries

### 1. Get Farmers with Statistics
```typescript
// Query: api.users.getFarmersWithStats
// Returns farmers with calculated stats from the system
const farmersWithStats = useQuery(api.users.getFarmersWithStats);
```

This query automatically calculates:
- **Total Products**: Count of active products for each farmer
- **Total Customers**: Unique buyers who have completed orders
- **Average Rating**: Calculated from all ratings
- **Total Ratings**: Number of reviews received

### 2. Rating System Queries
```typescript
// Create a rating
const createRating = useMutation(api.ratings.createRating);

// Get farmer's average rating
const averageRating = useQuery(api.ratings.getFarmerAverageRating, { 
    farmerId: "farmer_clerk_id" 
});

// Get all ratings for a farmer
const ratings = useQuery(api.ratings.getFarmerRatings, { 
    farmerId: "farmer_clerk_id" 
});
```

## Components

### 1. FarmerCard Component
Located at: `components/app/cards/farmer-card.tsx`

**Features:**
- Displays all farmer information in a card format
- Shows system-generated statistics
- Handles missing data gracefully
- Includes organic certification badges
- Interactive "View Products" button

**Usage:**
```tsx
import { FarmerCard } from '../components/app/cards/farmer-card';

<FarmerCard
    farmer={farmerData}
    onViewProducts={(farmerId) => {
        // Navigate to farmer's products
        window.location.href = `/products?farmer=${farmerId}`;
    }}
/>
```

### 2. RatingForm Component
Located at: `components/app/cards/rating-form.tsx`

**Features:**
- 5-star rating system with hover effects
- Optional review text (500 character limit)
- Form validation
- Success/error notifications

**Usage:**
```tsx
import { RatingForm } from '../components/app/cards/rating-form';

<RatingForm
    farmerId="farmer_clerk_id"
    buyerId="buyer_clerk_id"
    orderId="order_id"
    farmerName="John Farmer"
    onRatingSubmitted={() => {
        // Handle rating submission
    }}
/>
```

### 3. FarmersPageWithStats Component
Located at: `components/pages/FarmersPageWithStats.tsx`

**Features:**
- Displays all farmers in a grid layout
- Shows loading states
- Empty state handling
- Summary statistics
- Animated transitions

## Registration Flow Updates

### Updated Registration Types
The `RegistrationFormData` interface now includes farmer fields:

```typescript
export interface RegistrationFormData {
    // ... existing fields
    bio?: string;
    farmSize?: string;
    experience?: string;
    specialties?: string[];
    isOrganicCertified?: boolean;
    profilePicture?: string;
}
```

### Updated Registration Hook
The `useRegistration` hook now handles the new fields:

```typescript
const [formData, setFormData] = useState<RegistrationFormData>({
    // ... existing fields
    bio: '',
    farmSize: '',
    experience: '',
    specialties: [],
    isOrganicCertified: false,
    profilePicture: '',
});
```

## Implementation Steps

### 1. Update Registration Forms
Add form fields for the new farmer information:

```tsx
// Example form fields for farmer registration
{formData.role === 'farmer' && (
    <>
        <Input
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
        />
        <Input
            placeholder="Farm Size (e.g., 5 hectares)"
            value={formData.farmSize}
            onChange={(e) => handleInputChange('farmSize', e.target.value)}
        />
        <Input
            placeholder="Experience (e.g., 10+ years)"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
        />
        <Select
            value={formData.specialties?.join(', ')}
            onValueChange={(value) => handleInputChange('specialties', value.split(', '))}
        >
            <option value="">Select Specialties</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains</option>
            {/* Add more options */}
        </Select>
        <Checkbox
            checked={formData.isOrganicCertified}
            onCheckedChange={(checked) => 
                handleInputChange('isOrganicCertified', checked as boolean)
            }
        >
            Organic Certified
        </Checkbox>
    </>
)}
```

### 2. Add Rating System to Order Completion
After an order is delivered, show the rating form:

```tsx
// In order completion flow
{orderStatus === 'delivered' && !hasRated && (
    <RatingForm
        farmerId={order.farmerId}
        buyerId={currentUser.id}
        orderId={order._id}
        farmerName={farmerName}
        onRatingSubmitted={() => setHasRated(true)}
    />
)}
```

### 3. Update Farmer Dashboard
Show farmer their own statistics:

```tsx
// In farmer dashboard
const farmerStats = useQuery(api.users.getFarmersWithStats);
const myStats = farmerStats?.find(f => f.clerkUserId === currentUser.id);

// Display stats in dashboard
<div className="stats-grid">
    <StatCard title="Products" value={myStats?.stats.totalProducts} />
    <StatCard title="Customers" value={myStats?.stats.totalCustomers} />
    <StatCard title="Rating" value={myStats?.stats.averageRating} />
</div>
```

## Data Flow

1. **Registration**: Farmers provide their information during registration
2. **Product Creation**: Farmers create products, which count toward their stats
3. **Order Processing**: Orders are created and processed
4. **Rating Collection**: Customers rate farmers after order completion
5. **Statistics Calculation**: System automatically calculates and updates stats
6. **Display**: Farmer cards show real-time statistics

## Best Practices

1. **Graceful Degradation**: Handle missing data with fallbacks
2. **Real-time Updates**: Use Convex queries for live data
3. **Validation**: Validate farmer information during registration
4. **Performance**: Use indexes for efficient queries
5. **User Experience**: Show loading states and error handling

## Example Usage

```tsx
// Complete example of using the farmer card system
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FarmerCard } from '../components/app/cards/farmer-card';

function FarmersPage() {
    const farmersWithStats = useQuery(api.users.getFarmersWithStats);

    if (!farmersWithStats) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmersWithStats.map((farmer) => (
                <FarmerCard
                    key={farmer.clerkUserId}
                    farmer={farmer}
                    onViewProducts={(farmerId) => {
                        // Navigate to products
                        router.push(`/products?farmer=${farmerId}`);
                    }}
                />
            ))}
        </div>
    );
}
```

This implementation provides a comprehensive farmer card system with real-time statistics, rating functionality, and a smooth user experience. 