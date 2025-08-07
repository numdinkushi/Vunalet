# Auth Components - Clean Architecture

This directory contains a clean, well-structured authentication system following separation of concerns and SOLID principles.

## 📁 Directory Structure

```
auth/
├── components/                    # UI Components
│   ├── RoleSelectionStep.tsx     # Step 1: Role selection
│   ├── ProfileFormStep.tsx       # Step 2: Profile form
│   └── index.ts                  # Component exports
├── hooks/                        # Custom hooks
│   └── use-registration.ts       # Registration logic & state
├── types.ts                      # Shared types & interfaces
├── constants.ts                  # Static data & configurations
├── UserRegistration.tsx          # Main orchestration component
└── README.md                     # This file
```

## 🏗️ Architecture Principles

### **1. Single Responsibility Principle (SRP)**
- `RoleSelectionStep`: Only handles role selection UI
- `ProfileFormStep`: Only handles profile form UI
- `useRegistration`: Only handles registration logic
- `UserRegistration`: Only orchestrates the flow

### **2. Separation of Concerns**
- **UI Components**: Pure presentation components
- **Custom Hooks**: Business logic and state management
- **Types**: Shared interfaces and type definitions
- **Constants**: Static data and configurations

### **3. DRY (Don't Repeat Yourself)**
- Shared types in `types.ts`
- Common constants in `constants.ts`
- Reusable hook logic in `use-registration.ts`

## 📋 Component Breakdown

### **1. UserRegistration.tsx** (Main Orchestrator)
```typescript
// Clean, focused on orchestration only
export function UserRegistration() {
    const {
        formData,
        isSubmitting,
        step,
        handleInputChange,
        handleRoleSelect,
        handleSubmit,
    } = useRegistration();

    // Simple conditional rendering
    if (step === 1) {
        return <RoleSelectionStep {...props} />;
    }

    return <ProfileFormStep {...props} />;
}
```

**Responsibilities:**
- Orchestrates the registration flow
- Manages step transitions
- Passes props to child components

### **2. useRegistration Hook** (Business Logic)
```typescript
export function useRegistration() {
    // State management
    const [formData, setFormData] = useState<RegistrationFormData>({...});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    // Business logic
    const handleSubmit = async (e?: React.FormEvent) => {
        // 1. Create user in stablecoin system
        // 2. Create user profile in Convex
        // 3. Handle success/error
    };

    return { formData, isSubmitting, handleSubmit, ... };
}
```

**Responsibilities:**
- State management
- Business logic
- API integration
- Error handling

### **3. RoleSelectionStep.tsx** (UI Component)
```typescript
export function RoleSelectionStep({ formData, onRoleSelect, onNext }: RegistrationStepProps) {
    return (
        <div className="...">
            {/* Role selection cards */}
            {/* Continue button */}
        </div>
    );
}
```

**Responsibilities:**
- Display role selection UI
- Handle role selection
- Navigation to next step

### **4. ProfileFormStep.tsx** (UI Component)
```typescript
export function ProfileFormStep({ formData, onInputChange, onNext, isSubmitting }: RegistrationStepProps) {
    return (
        <form onSubmit={onNext}>
            {/* Form fields */}
            {/* Submit button */}
        </form>
    );
}
```

**Responsibilities:**
- Display profile form
- Handle form inputs
- Form submission

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
- Hooks can be shared across components
- Types are reusable

### **4. Readability**
- Small, focused files
- Clear component names
- Well-documented structure

### **5. Scalability**
- Easy to add new steps
- Easy to modify existing steps
- Easy to add new features

## 🔄 Data Flow

```
UserRegistration (Orchestrator)
    ↓
useRegistration Hook (Business Logic)
    ↓
RoleSelectionStep / ProfileFormStep (UI Components)
    ↓
User clicks / submits
    ↓
Hook handles API calls
    ↓
Success / Error handling
```

## 📝 Usage Example

```typescript
// Simple usage in a page
import { UserRegistration } from '@/components/auth/UserRegistration';

export default function RegistrationPage() {
    return (
        <div>
            <UserRegistration />
        </div>
    );
}
```

## 🧪 Testing

Each component can be tested independently:

```typescript
// Test the hook
const { result } = renderHook(() => useRegistration());

// Test the UI components
render(<RoleSelectionStep {...props} />);

// Test the main component
render(<UserRegistration />);
```

## 🚀 Migration from Old Structure

The old `UserRegistration.tsx` was:
- ❌ 422 lines long
- ❌ Mixed concerns (UI + logic)
- ❌ Too many console logs
- ❌ Hard to maintain

The new structure is:
- ✅ Small, focused files
- ✅ Clear separation of concerns
- ✅ Clean, minimal logging
- ✅ Easy to maintain and extend

This architecture makes the code much more maintainable, testable, and scalable! 🎉 