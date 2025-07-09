# AI Development Guidelines

## Quick Reference
- **TypeScript**: Type-safe code everywhere
- **Styling**: Tailwind CSS only, shadcn/ui components preferred
- **Architecture**: Feature folder pattern with Repository → Service → Hooks layers
- **Next.js**: App router with server components by default
- **Client Components**: Add `'use client'` directive for React hooks only

## Code Standards

### Type Safety & Quality
- All code must be TypeScript with strict typing
- Use Zod for runtime validation and type inference
- Include meaningful comments for complex logic
- Follow clean code principles

### UI & Styling
- **Tailwind CSS** utility classes only (no custom CSS)
- **shadcn/ui** components for consistent design system
- **Lucide React** for all icons
- **Dark mode compatibility** required for all components
- Responsive design using Tailwind breakpoints

### Component Architecture
- **Pages** (`/app/[route]/page.tsx`): Server components, no `'use client'`
- **Feature Components**: Client components with `'use client'` directive
- **Interactive Logic**: Isolated in client components and custom hooks

## Feature Module Pattern

### Required Structure
```
src/features/[feature-name]/
├── components/        # UI components ('use client' for interactivity)
├── hooks/            # Custom React hooks ('use client' required)
├── repository/       # Data access interfaces + implementations
├── service/          # Business logic layer (server-side safe)
├── types/            # TypeScript interfaces and types
├── utils/            # Pure utility functions
└── index.ts          # Public API exports
```

### Page Structure
```
src/app/[route]/
└── page.tsx          # Server component that imports Feature component
```

**Example page.tsx:**
```tsx
// Server component - NO 'use client'
import { FeatureBoard } from '@/features/feature-name'

export default function FeaturePage() {
  return <FeatureBoard />
}
```

## Next.js App Router Rules

### 'use client' Directive Usage
- **Required for**: Components using React hooks (useState, useEffect, etc.)
- **Required for**: Custom hooks using React hooks
- **Required for**: Event handlers and interactive components
- **Never use on**: Pages, services, repositories, utils (unless they use React hooks)

### Data Flow Pattern
1. **Page** (server): Minimal server component that renders feature
2. **Feature Component** (client): Main interactive component with `'use client'`
3. **Service Layer**: Business logic (server-safe, no React hooks)
4. **Repository Layer**: Data access (server-safe, no React hooks)

## Architecture Layers

### Repository Layer
- **Purpose**: Data access and CRUD operations
- **Implementation**: Interfaces + concrete implementations
- **Testing**: Mock data generation, error handling
- **Location**: `repository/[Entity]Repository.ts`

### Service Layer  
- **Purpose**: Business logic, validation, data transformation
- **Implementation**: Pure functions, Zod validation
- **Testing**: Logic validation, edge cases
- **Location**: `service/[Entity]Service.ts`

### Hooks Layer
- **Purpose**: React state management, component logic
- **Implementation**: Custom hooks with `'use client'`
- **Testing**: State behavior, side effects
- **Location**: `hooks/use[FeatureName].ts`

## Testing Requirements

### Test Structure
- **Repository Tests**: Data operations, error handling
- **Service Tests**: Business logic, validation rules  
- **Hook Tests**: State management, side effects
- **Component Tests**: Rendering, user interactions
- **Integration Tests**: Full feature workflows

### Quality Gates
1. TypeScript compilation passes
2. ESLint rules pass
3. All tests pass with adequate coverage
4. Production build succeeds (`pnpm build`)
5. Manual testing verification

## Mock Data Strategy
- Generate realistic test data with sufficient volume
- Include edge cases and error scenarios
- Place in `repository/mockData.ts` or `utils/mockData.ts`
- Ensure data supports all UI states and user flows

## Common Patterns

### Feature Component Export
```tsx
// src/features/example/components/ExampleBoard.tsx
'use client'

import { useExample } from '../hooks/useExample'

export function ExampleBoard() {
  const { data, actions } = useExample()
  return (
    <div className="p-6 bg-background text-foreground">
      {/* Feature content */}
    </div>
  )
}
```

### Custom Hook Pattern
```tsx
// src/features/example/hooks/useExample.ts
'use client'

import { useState, useEffect } from 'react'
import { ExampleService } from '../service/ExampleService'

export function useExample() {
  const [data, setData] = useState([])
  
  return {
    data,
    actions: {
      create: ExampleService.create,
      update: ExampleService.update,
      delete: ExampleService.delete,
    }
  }
}
```

### Service Pattern
```tsx
// src/features/example/service/ExampleService.ts
// No 'use client' - server-safe

import { ExampleRepository } from '../repository/ExampleRepository'
import { ExampleSchema } from '../types/Example'

export class ExampleService {
  static async create(data: unknown) {
    const validated = ExampleSchema.parse(data)
    return ExampleRepository.create(validated)
  }
}
```

## Key Success Factors
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Type Safety**: Comprehensive TypeScript usage with runtime validation  
- **Testability**: Each layer independently testable with clear interfaces
- **Performance**: Server components by default, client components only when needed
- **Maintainability**: Consistent patterns and clear folder structure