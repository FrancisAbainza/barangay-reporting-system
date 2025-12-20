# Project Structure & Modularity Documentation

This document describes the modular architecture of the Barangay Reporting System.

## Directory Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Generic UI components
│   │   ├── Button.tsx
│   │   ├── FormField.tsx
│   │   ├── IconButton.tsx
│   │   ├── ScreenContainer.tsx
│   │   ├── ScreenHeader.tsx
│   │   └── index.ts
│   ├── auth/           # Authentication-specific components
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── index.ts
│   └── index.ts
├── schemas/            # Validation schemas
│   └── auth/
│       ├── loginSchema.ts
│       ├── signupSchema.ts
│       └── index.ts
├── screens/            # Screen components (composition only)
│   ├── WelcomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── ComplaintsScreen.tsx
│   ├── CreateScreen.tsx
│   ├── ForumScreen.tsx
│   ├── TransparencyScreen.tsx
│   └── AccountScreen.tsx
├── constants/
├── contexts/
├── hooks/
├── navigation/
├── services/
├── types/
└── utils/
```

## Component Architecture

### UI Components (`src/components/ui/`)

Generic, reusable UI components with no business logic:

- **Button**: Primary, secondary, and danger button variants with loading states
- **IconButton**: Buttons with icons (e.g., logout button)
- **FormField**: Controlled form inputs with validation error display
- **ScreenContainer**: Wrapper for screens with keyboard avoidance and scroll support
- **ScreenHeader**: Consistent header component with title and optional subtitle

### Feature Components (`src/components/auth/`)

Feature-specific components that encapsulate domain logic:

- **LoginForm**: Complete login form with validation and submission logic
- **SignupForm**: Complete signup form with validation and submission logic

### Schemas (`src/schemas/`)

Centralized validation schemas using Zod:

- **loginSchema**: Email and password validation
- **signupSchema**: User registration validation

### Screens (`src/screens/`)

Screens are **composition-only** - they import and compose components without containing complex logic:

```tsx
// ✅ Good: Screen only composes components
export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, loading } = useAuth();
  
  const handleSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <ScreenContainer>
      <LoginForm onSubmit={handleSubmit} loading={loading} />
    </ScreenContainer>
  );
}
```

```tsx
// ❌ Bad: Screen contains UI logic and form handling
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      {/* More complex UI logic here */}
    </View>
  );
}
```

## Modularity Principles

### 1. Single Responsibility
Each component has one clear purpose:
- `Button`: Render a button
- `FormField`: Render a form input with label and error
- `LoginForm`: Handle login form state and validation

### 2. Reusability
Components are designed to be reused across the app:
- UI components (`Button`, `FormField`) can be used anywhere
- Form components (`LoginForm`, `SignupForm`) are self-contained and portable

### 3. Separation of Concerns
- **UI Components**: Pure presentation, no business logic
- **Form Components**: Form state and validation logic
- **Screens**: Composition and navigation logic only
- **Hooks**: Reusable stateful logic (future implementation)
- **Services**: API calls and data fetching (future implementation)

### 4. Prop-Based Communication
Components communicate through props, making data flow explicit:
```tsx
<LoginForm 
  onSubmit={handleSubmit}
  onNavigateToSignup={handleNavigate}
  loading={loading}
/>
```

### 5. No Embedded Business Logic
Screens don't contain:
- Form state management (delegated to form components)
- Validation logic (delegated to schemas)
- Complex UI rendering (delegated to UI components)

## Benefits

1. **Maintainability**: Small, focused components are easier to understand and modify
2. **Testability**: Each component can be tested in isolation
3. **Reusability**: Components can be used in multiple screens
4. **Scalability**: Easy to add new features without affecting existing code
5. **Consistency**: Shared UI components ensure consistent design
6. **Developer Experience**: Clear structure makes it easy to find and modify code

## Usage Examples

### Creating a New Screen

```tsx
// 1. Import necessary components
import { ScreenContainer, ScreenHeader } from '../components/ui';

// 2. Compose screen using reusable components
export default function MyScreen() {
  return (
    <ScreenContainer scrollable={false}>
      <ScreenHeader title="My Screen" bordered />
      {/* Screen content */}
    </ScreenContainer>
  );
}
```

### Creating a New Form

```tsx
// 1. Create schema in src/schemas/
export const myFormSchema = z.object({
  field1: z.string().min(1, 'Required'),
});

// 2. Create form component in src/components/
export function MyForm({ onSubmit, loading }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(myFormSchema),
  });

  return (
    <View>
      <FormField control={control} name="field1" label="Field 1" />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

// 3. Use in screen
export default function MyScreen() {
  const handleSubmit = async (data) => {
    // Handle submission
  };

  return (
    <ScreenContainer>
      <MyForm onSubmit={handleSubmit} />
    </ScreenContainer>
  );
}
```

## Next Steps

As the project grows, consider:
1. Creating custom hooks in `src/hooks/` for shared stateful logic
2. Building service modules in `src/services/` for API calls
3. Adding more feature-specific component directories
4. Implementing a design system with theme tokens
5. Creating Storybook for component documentation
