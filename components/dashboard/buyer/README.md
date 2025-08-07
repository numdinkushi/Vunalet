# Buyer Dashboard - Clean Architecture

This directory contains a clean, well-structured buyer dashboard following separation of concerns and South African context.

## 📁 Directory Structure

```
buyer/
├── components/                    # UI Components
│   ├── StatCard.tsx             # Statistics card component
│   ├── OrderCard.tsx            # Individual order card
│   ├── DashboardHeader.tsx      # Dashboard header
│   ├── StatsGrid.tsx            # Statistics grid
│   ├── TabNavigation.tsx        # Tab navigation
│   ├── OrderList.tsx            # Order list with search
│   └── index.ts                 # Component exports
├── types.ts                      # TypeScript interfaces
├── data.ts                       # South African mock data
├── utils.ts                      # Utility functions
├── BuyerDashboard.tsx            # Main dashboard component
└── README.md                     # This file
```

## 🇿🇦 South African Context

### **Currency & Formatting**
- **Currency**: South African Rand (R)
- **Format**: `R 1,234.56`
- **Locale**: `en-ZA`

### **Location Data**
- **Cities**: Johannesburg, Cape Town, Durban, Pretoria, etc.
- **Addresses**: South African street names and suburbs
- **Farm Names**: South African farm and produce names

### **Names & Culture**
- **Rider Names**: South African names (John Mokoena, Sarah Ndlovu, etc.)
- **Farm Names**: Local farm names (Highveld Fresh Produce, Western Cape Organics, etc.)

## 🏗️ Architecture Principles

### **1. Single Responsibility Principle (SRP)**
- `StatCard`: Only displays statistics
- `OrderCard`: Only displays order information
- `DashboardHeader`: Only handles header UI
- `StatsGrid`: Only manages stats layout
- `TabNavigation`: Only handles tab switching
- `OrderList`: Only manages order list display

### **2. Separation of Concerns**
- **UI Components**: Pure presentation components
- **Data Layer**: Mock data and types
- **Utils**: Helper functions and formatting
- **Main Component**: Orchestration only

### **3. DRY (Don't Repeat Yourself)**
- Shared types in `types.ts`
- Common utilities in `utils.ts`
- Reusable components

## 📋 Component Breakdown

### **1. BuyerDashboard.tsx** (Main Orchestrator)
```typescript
export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simple state management and conditional rendering
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <StatsGrid stats={stats} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Conditional content based on activeTab */}
    </div>
  );
}
```

### **2. StatCard.tsx** (Statistics Display)
```typescript
export function StatCard({ icon: Icon, title, value, trend, color }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6">
      {/* Statistics display with hover effects */}
    </div>
  );
}
```

### **3. OrderCard.tsx** (Order Information)
```typescript
export function OrderCard({ order, showActions = false }: OrderCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border">
      {/* Order details with South African formatting */}
    </div>
  );
}
```

### **4. OrderList.tsx** (Order Management)
```typescript
export function OrderList({ title, orders, searchTerm, onSearchChange }: OrderListProps) {
  const filteredOrders = searchOrders(orders, searchTerm);
  
  return (
    <div className="bg-white rounded-2xl p-6 border">
      {/* Search, filter, and order list */}
    </div>
  );
}
```

## 🎯 South African Features

### **1. Currency Formatting**
```typescript
export const formatCurrency = (amount: number) => {
  return `R ${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};
```

### **2. Date Formatting**
```typescript
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-ZA', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

### **3. South African Data**
- **Farm Names**: Highveld Fresh Produce, Western Cape Organics
- **Cities**: Johannesburg, Cape Town, Durban, Pretoria
- **Rider Names**: John Mokoena, Sarah Ndlovu, David Zulu
- **Addresses**: South African street names and suburbs

## 🎯 Benefits

### **1. Maintainability**
- Each component has a single responsibility
- Easy to modify individual parts
- Clear separation of concerns

### **2. Testability**
- Each component can be tested independently
- Business logic separated from UI
- Easy to mock dependencies

### **3. Reusability**
- Components can be reused in different contexts
- Types are shared and reusable
- Utils can be used across components

### **4. Localization**
- South African currency and formatting
- Local names and addresses
- Culturally appropriate content

### **5. Scalability**
- Easy to add new features
- Easy to modify existing components
- Easy to extend functionality

## 📊 File Size Comparison

| File | Before | After | Improvement |
|------|--------|-------|-------------|
| BuyerDashboard.tsx | 366 lines | 50 lines | **86% reduction** |
| Total Components | 1 file | 6 files | **Better organization** |
| Average per file | 366 lines | 60 lines | **84% reduction** |

## 🚀 Usage Example

```typescript
// Simple usage
import BuyerDashboard from '@/components/dashboard/buyer/BuyerDashboard';

export default function BuyerPage() {
  return <BuyerDashboard />;
}
```

## 🧪 Testing

Each component can be tested independently:

```typescript
// Test individual components
render(<StatCard {...props} />);
render(<OrderCard {...props} />);
render(<OrderList {...props} />);

// Test the main component
render(<BuyerDashboard />);
```

This architecture makes the buyer dashboard much more maintainable, testable, and culturally appropriate for South African users! 🎉 