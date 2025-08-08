# 📊 Custom Table System

This directory contains a reusable table system inspired by the fuse project's CustomTable structure, but simplified for the vunalet project.

## 📁 Directory Structure

```
table/
├── index.ts              # Main exports
├── types.ts              # TypeScript interfaces
├── CustomTable.tsx       # Main table component
├── header/
│   └── index.tsx        # Table header with search and buttons
├── body/
│   └── index.tsx        # Table body with rows and cells
├── footer/
│   └── index.tsx        # Table footer with pagination
├── search/
│   └── index.tsx        # Search component
├── filter/
│   └── index.tsx        # Filter component
└── README.md            # This file
```

## 🎯 **Features**

### **1. CustomTable Component**
- ✅ **Generic TypeScript**: Works with any data type `<T>`
- ✅ **Flexible Props**: Configurable search, pagination, headers
- ✅ **Clickable Rows**: Optional row click handlers
- ✅ **Loading States**: Built-in loading indicator
- ✅ **Empty States**: Customizable empty messages

### **2. Table Header**
- ✅ **Title**: Optional table title
- ✅ **Search**: Integrated search functionality
- ✅ **Action Buttons**: Configurable header buttons
- ✅ **Responsive**: Adapts to screen size

### **3. Table Body**
- ✅ **Dynamic Columns**: Configurable column definitions
- ✅ **Row Clicking**: Optional click handlers
- ✅ **Loading State**: Shows spinner when loading
- ✅ **Empty State**: Shows message when no data

### **4. Table Footer**
- ✅ **Pagination**: Previous/Next with page numbers
- ✅ **Page Size**: Configurable items per page
- ✅ **Smart Pagination**: Shows ellipsis for large page counts
- ✅ **Results Counter**: Shows "Showing X to Y of Z results"

### **5. Search & Filter**
- ✅ **Search Component**: Integrated search input
- ✅ **Filter Component**: Dropdown filters
- ✅ **Customizable**: Configurable placeholders and labels

## 🏗️ **Architecture**

### **Component Hierarchy:**
```
CustomTable
├── TableHeader
│   ├── Title
│   ├── TableSearch
│   └── HeaderButtons
├── TableBody
│   ├── Table Headers
│   ├── Table Rows
│   └── Loading/Empty States
└── TableFooter
    ├── Results Counter
    ├── Page Size Selector
    └── Pagination Controls
```

### **Data Flow:**
```
Props → CustomTable → Header/Body/Footer → User Interactions → Callbacks
```

## 🎯 **Usage Examples**

### **1. Basic Table:**
```typescript
import { CustomTable, TableColumn } from '@/components/ui/table';

const columns: TableColumn<User>[] = [
  {
    key: 'name',
    header: 'Name',
    cell: (user) => <div>{user.name}</div>
  },
  {
    key: 'email',
    header: 'Email',
    cell: (user) => <div>{user.email}</div>
  }
];

<CustomTable
  data={users}
  columns={columns}
  title="Users"
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
/>
```

### **2. Advanced Table with Actions:**
```typescript
import { Button } from '@/components/ui/button';
import { Edit, Delete } from 'lucide-react';

const headerButtons = [
  {
    label: 'Add User',
    icon: <Plus className="w-4 h-4" />,
    onClick: () => handleAddUser(),
    variant: 'default' as const
  }
];

<CustomTable
  data={users}
  columns={columns}
  title="Users"
  headerButtons={headerButtons}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onRowClick={handleRowClick}
  showSearch={true}
  showPagination={true}
  showHeader={true}
/>
```

### **3. Table with Custom Pagination:**
```typescript
const [pagination, setPagination] = useState({
  currentPage: 1,
  pageSize: 10,
  totalPages: 5
});

<CustomTable
  data={users}
  columns={columns}
  pagination={{
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    totalPages: pagination.totalPages,
    onPageChange: (page) => setPagination(prev => ({ ...prev, currentPage: page })),
    onPageSizeChange: (size) => setPagination(prev => ({ ...prev, pageSize: size }))
  }}
/>
```

## 🇿🇦 **South African Context**

### **Currency Formatting:**
```typescript
const currencyColumn: TableColumn<Order> = {
  key: 'total',
  header: 'Total',
  cell: (order) => (
    <div className="font-semibold">
      {formatCurrency(order.totalCost)} // R 1,234.56
    </div>
  )
};
```

### **Date Formatting:**
```typescript
const dateColumn: TableColumn<Order> = {
  key: 'date',
  header: 'Date',
  cell: (order) => (
    <div className="text-sm text-gray-600">
      {formatDate(order.createdAt)} // Mon, Jan 7, 2:30 PM
    </div>
  )
};
```

## 🎨 **UI/UX Features**

### **1. Responsive Design:**
- ✅ **Mobile Friendly**: Adapts to small screens
- ✅ **Flexible Layout**: Header adjusts to content
- ✅ **Touch Friendly**: Large touch targets

### **2. Accessibility:**
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Reader**: Proper ARIA labels
- ✅ **Focus Management**: Clear focus indicators

### **3. Visual Feedback:**
- ✅ **Hover Effects**: Rows highlight on hover
- ✅ **Loading States**: Clear loading indicators
- ✅ **Empty States**: Helpful empty messages

## 🚀 **Benefits**

### **1. Reusability:**
- ✅ **Generic Design**: Works with any data type
- ✅ **Consistent UI**: Same look across all dashboards
- ✅ **Easy Integration**: Simple props interface

### **2. Performance:**
- ✅ **Efficient Rendering**: Only renders visible data
- ✅ **Pagination**: Reduces DOM size
- ✅ **Memoization**: Optimized re-renders

### **3. Developer Experience:**
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Clear API**: Intuitive props interface
- ✅ **Well Documented**: Comprehensive examples

### **4. Maintainability:**
- ✅ **Modular Design**: Each component has one job
- ✅ **Easy to Extend**: Add new features easily
- ✅ **Clean Code**: Well-organized structure

## 📊 **Comparison: Old vs New**

| Feature | Old DataTable | New CustomTable |
|---------|---------------|-----------------|
| **Type Safety** | Basic | Full TypeScript |
| **Flexibility** | Limited | Highly configurable |
| **Reusability** | Specific to orders | Generic for any data |
| **Architecture** | Single file | Modular components |
| **Maintainability** | Hard to extend | Easy to modify |
| **Performance** | Good | Optimized |

## 🎯 **Next Steps**

### **1. Extend to Other Dashboards:**
```typescript
// Farmer Dashboard
const productColumns: TableColumn<Product>[] = [
  { key: 'name', header: 'Product Name', cell: (product) => product.name },
  { key: 'price', header: 'Price', cell: (product) => formatCurrency(product.price) }
];

// Dispatcher Dashboard
const deliveryColumns: TableColumn<Delivery>[] = [
  { key: 'orderId', header: 'Order ID', cell: (delivery) => delivery.orderId },
  { key: 'status', header: 'Status', cell: (delivery) => delivery.status }
];
```

### **2. Add Advanced Features:**
- ✅ **Sorting**: Click column headers to sort
- ✅ **Filtering**: Advanced filter options
- ✅ **Export**: Export to CSV/PDF
- ✅ **Bulk Actions**: Select multiple rows

### **3. Enhance Performance:**
- ✅ **Virtual Scrolling**: For large datasets
- ✅ **Lazy Loading**: Load data on demand
- ✅ **Caching**: Cache table state

The new table system provides a much better developer experience with improved type safety, reusability, and maintainability! 🎉 