# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Project Architecture

This is a Next.js 15 application using App Router with TypeScript, Tailwind CSS v4, and shadcn/ui components.

### Key Technologies
- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 beta (pure utility classes, no custom CSS)
- **Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React exclusively
- **Validation**: Zod for runtime validation and type inference
- **Testing**: Vitest with React Testing Library for component testing
- **Package Manager**: pnpm

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages (server components by default)
├── features/              # Feature modules following strict architecture pattern
├── shared/
│   ├── components/ui/     # shadcn/ui components
│   └── hooks/            # Shared React hooks
├── lib/
│   └── utils.ts          # Utility functions (cn for classnames)
└── test/                  # Test utilities and setup files
    ├── setup.ts          # Global test setup and mocks
    └── utils.tsx         # Custom render functions and test utilities
```

### Feature Module Pattern

All features MUST follow this structure:

```
src/features/[feature-name]/
├── components/        # UI components ('use client' for interactivity)
├── hooks/            # Custom React hooks ('use client' required)
├── repository/       # Data access layer
├── service/          # Business logic layer (server-safe)
├── types/            # TypeScript interfaces and types
├── utils/            # Pure utility functions
└── index.ts          # Public API exports
```

## Critical Development Rules

### 'use client' Directive
- **Required for**: Components/hooks using React hooks (useState, useEffect, etc.)
- **Never use on**: Pages, services, repositories, or utilities
- **Default**: Server components (no directive needed)

### Component Hierarchy
1. **Pages** (`app/*/page.tsx`): Server components that import feature components
2. **Feature Components**: Client components with `'use client'` for interactivity
3. **Services**: Server-safe business logic (no React hooks)
4. **Repositories**: Data access layer (server-safe)

### Styling Rules
- Use Tailwind CSS utility classes exclusively
- No custom CSS files or inline styles
- Use shadcn/ui components for consistency
- Dark mode compatibility required (use variables from globals.css)
- Responsive design using Tailwind breakpoints

### TypeScript Standards
- Strict mode enabled - all code must be fully typed
- Use Zod schemas for runtime validation
- Define interfaces in `types/` directories
- No `any` types allowed

## Testing Requirements

### Test Strategy
- **Unit Tests**: Utility functions and business logic
- **Component Tests**: UI components with React Testing Library
- **Integration Tests**: Feature modules and user workflows
- **End-to-End Tests**: Critical user journeys (future consideration)

### Testing Standards
- Write tests alongside feature development
- Follow the Arrange-Act-Assert pattern
- Use descriptive test names that explain behavior
- Mock external dependencies and API calls
- Test both happy path and error scenarios
- Maintain test coverage for critical business logic

### Test File Patterns
```
# Component tests
src/features/[feature]/components/Component.test.tsx

# Hook tests  
src/features/[feature]/hooks/useHook.test.ts

# Service tests
src/features/[feature]/service/Service.test.ts

# Utility tests
src/lib/utils.test.ts

# UI component tests
src/shared/components/ui/Component.test.tsx
```

### Before Marking Tasks Complete
1. Run `pnpm build` to ensure TypeScript compilation passes
2. Run `pnpm lint` to check code style
3. Run `pnpm test` to ensure all tests pass
4. Test all interactive features manually
5. Verify dark mode compatibility
6. Check responsive design on different screen sizes

## Common Patterns

### Creating a New Feature Page

```tsx
// src/app/example/page.tsx (NO 'use client')
import { ExampleFeature } from '@/features/example'

export default function ExamplePage() {
  return <ExampleFeature />
}
```

### Feature Component Pattern

```tsx
// src/features/example/components/ExampleFeature.tsx
'use client'

import { useExample } from '../hooks/useExample'

export function ExampleFeature() {
  const { data, actions } = useExample()
  // Component implementation
}
```

### Service Layer Pattern

```tsx
// src/features/example/service/ExampleService.ts (NO 'use client')
import { ExampleRepository } from '../repository/ExampleRepository'
import { ExampleSchema } from '../types/Example'

export class ExampleService {
  static async create(data: unknown) {
    const validated = ExampleSchema.parse(data)
    return ExampleRepository.create(validated)
  }
}
```

## Environment Configuration

- Using ES modules (`"type": "module"` in package.json)
- PostCSS configured for Tailwind CSS v4
- Path alias `@/*` maps to project root

## Important Notes

- This is a clean starter template with comprehensive AI development guidelines
- Follow the feature development template in `ai-guidelines/feature-development-template.md`
- Detailed development guidelines available in `ai-guidelines/development-guidelines.md`
- A markdown blog feature is planned (see `ai-feature-requests/markdown-blog.md`)