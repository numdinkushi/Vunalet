# 📊 Reusable Data Table & Modal System

This document describes the new paginated table system with modal functionality for the buyer dashboard.

## 🎯 **New Features**

### **1. Reusable Data Table (`/components/ui/data-table.tsx`)**
- ✅ **Generic TypeScript**: Works with any data type
- ✅ **Pagination**: Built-in pagination with configurable items per page
- ✅ **Search**: Integrated search functionality
- ✅ **Clickable Rows**: Optional row click handlers
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Customizable**: Configurable columns and search placeholder

### **2. Order Modal (`/components/dashboard/buyer/components/OrderModal.tsx`)**
- ✅ **Detailed View**: Complete order information
- ✅ **South African Context**: Local currency and formatting
- ✅ **Action Buttons**: Track, cancel, rate orders
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Accessible**: Proper ARIA labels and keyboard navigation

### **3. Table Columns (`/components/dashboard/buyer/components/tableColumns.ts`)**
- ✅ **Order ID**: Shortened order identifier
- ✅ **Date**: Formatted creation date
- ✅ **Farm**: Farm name
- ✅ **Products**: Number of items
- ✅ **Total**: South African Rand formatting
- ✅ **Status**: Color-coded status badges
- ✅ **Payment**: Payment status badges
- ✅ **Delivery**: Estimated delivery time

## 🏗️ **Architecture**

### **Data Flow:**
```
BuyerDashboard → OrderList → DataTable → OrderModal
     ↓              ↓           ↓           ↓
  State        Props       Row Click    Order Details
```

### **Component Structure:**
```
buyer/
├── components/
│   ├── OrderList.tsx          # Wrapper for DataTable
│   ├── OrderModal.tsx         # Modal for order details
│   ├── tableColumns.ts        # Column definitions
│   └── index.ts              # Exports
├── BuyerDashboard.tsx         # Main orchestrator
└── TABLE_README.md           # This file
```

## 🎯 **Usage Examples**

### **1. Using the Reusable DataTable:**
```typescript
import { DataTable } from '@/components/ui/data-table';

// Define columns
const columns = [
  {
    key: 'id',
    header: 'ID',
    cell: (item) => <div>{item.id}</div>
  }
];

// Use the table
<DataTable
  data={orders}
  columns={columns}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onRowClick={handleRowClick}
  searchPlaceholder="Search orders..."
/>
```

### **2. Using the Order Modal:**
```typescript
import { OrderModal } from './components/OrderModal';

// State management
const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// Handle row click
const handleRowClick = (order: Order) => {
  setSelectedOrder(order);
  setIsModalOpen(true);
};

// Render modal
<OrderModal
  order={selectedOrder}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

## 🇿🇦 **South African Features**

### **Currency Formatting:**
```typescript
// R 1,234.56 format
export const formatCurrency = (amount: number) => {
  return `R ${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};
```

### **Date Formatting:**
```typescript
// South African date format
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

### **Local Data:**
- **Farm Names**: Highveld Fresh Produce, Western Cape Organics
- **Cities**: Johannesburg, Cape Town, Durban, Pretoria
- **Rider Names**: John Mokoena, Sarah Ndlovu, David Zulu

## 🎨 **UI/UX Features**

### **1. Table Features:**
- ✅ **Hover Effects**: Rows highlight on hover
- ✅ **Clickable Rows**: Cursor changes to pointer
- ✅ **Status Badges**: Color-coded status indicators
- ✅ **Pagination**: Previous/Next with page numbers
- ✅ **Items Per Page**: 5, 10, 20, 50 options
- ✅ **Search**: Real-time search functionality

### **2. Modal Features:**
- ✅ **Responsive**: Adapts to screen size
- ✅ **Scrollable**: Handles long content
- ✅ **Close Button**: X button in header
- ✅ **Action Buttons**: Context-aware actions
- ✅ **Separators**: Clear section divisions

### **3. Status Colors:**
- 🟡 **Pending**: Amber
- 🔵 **Confirmed**: Blue
- 🟠 **Preparing**: Orange
- 🟣 **Ready**: Purple
- 🔵 **In Transit**: Indigo
- 🟢 **Delivered**: Emerald
- 🔴 **Cancelled**: Red

## 🚀 **Benefits**

### **1. Reusability:**
- ✅ **Generic Table**: Can be used for any data type
- ✅ **Consistent UI**: Same look across all dashboards
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Easy Integration**: Simple props interface

### **2. Performance:**
- ✅ **Pagination**: Only loads visible data
- ✅ **Efficient Rendering**: Optimized for large datasets
- ✅ **Smooth Interactions**: Fast search and navigation

### **3. User Experience:**
- ✅ **Intuitive**: Click rows to see details
- ✅ **Searchable**: Find orders quickly
- ✅ **Responsive**: Works on all devices
- ✅ **Accessible**: Keyboard navigation support

### **4. Maintainability:**
- ✅ **Separation of Concerns**: Each component has one job
- ✅ **Easy to Extend**: Add new columns or features
- ✅ **Well Documented**: Clear usage examples
- ✅ **Type Safe**: Catch errors at compile time

## 📊 **Comparison: Cards vs Table**

| Feature | Cards (Before) | Table (After) |
|---------|----------------|---------------|
| **Data Density** | Low | High |
| **Sorting** | ❌ | ✅ |
| **Search** | Basic | Advanced |
| **Pagination** | ❌ | ✅ |
| **Mobile Friendly** | ✅ | ✅ |
| **Reusability** | ❌ | ✅ |
| **Performance** | Good | Better |

## 🎯 **Next Steps**

### **1. Extend to Other Dashboards:**
```typescript
// Farmer Dashboard
const productColumns = [
  { key: 'name', header: 'Product Name', cell: (product) => product.name },
  { key: 'price', header: 'Price', cell: (product) => formatCurrency(product.price) }
];

// Dispatcher Dashboard
const deliveryColumns = [
  { key: 'orderId', header: 'Order ID', cell: (delivery) => delivery.orderId },
  { key: 'status', header: 'Status', cell: (delivery) => delivery.status }
];
```

### **2. Add Advanced Features:**
- ✅ **Sorting**: Click column headers to sort
- ✅ **Filtering**: Filter by status, date range, etc.
- ✅ **Export**: Export to CSV/PDF
- ✅ **Bulk Actions**: Select multiple rows for actions

### **3. Enhance Modal:**
- ✅ **Real-time Updates**: Live order status
- ✅ **Map Integration**: Show delivery location
- ✅ **Chat Support**: Contact rider/farm
- ✅ **Order Tracking**: Real-time tracking

The new table system provides a much better user experience with improved performance, reusability, and South African context! 🎉 