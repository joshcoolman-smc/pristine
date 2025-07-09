# [Feature Name] Feature

## Overview
[2-3 sentence description of the feature, its purpose, and primary use case. Include the technical approach in brief (e.g., "using Next.js 14 best practices with Test-Driven Development")]

## Core Requirements

### [Primary Functional Area]
- [Specific requirement with clear acceptance criteria]
- [File/data structure requirements with examples]
- [User interaction requirements]
- [Performance/technical constraints]

### [Secondary Functional Area]
- [Additional requirements organized by logical grouping]

### [UI/UX Requirements]
1. **[Page/Component Name]** - [Description of what it displays]:
   - [Specific UI element requirement]
   - [Data display requirement]
   - [Interaction requirement]

2. **[Another Page/Component]** - [Description]:
   - [Specific requirements for this component]

## Technical Implementation

### Dependencies (Best-in-Class [Current Year])
```json
{
  "[primary-library]": "^[version]",
  "[secondary-library]": "^[version]",
  "[utility-library]": "^[version]"
}
```

### Testing Dependencies
```json
{
  "vitest": "^[version]",
  "@vitejs/plugin-react": "^[version]",
  "@testing-library/react": "^[version]",
  "@testing-library/jest-dom": "^[version]",
  "jsdom": "^[version]"
}
```

### ⚠️ CRITICAL: [Technology-Specific Setup Notes]

**Important**: [Any critical gotchas, version conflicts, or setup requirements that commonly cause issues]

#### Required Configuration
[Include any necessary config files, CSS setup, or environment variables]

```[language]
// Example configuration that must be implemented
[required config code]
```

#### [Key Component/Service Name]
```[language]
// Critical implementation example
[key code example]
```

### Feature Module Structure
```
src/features/[feature-name]/
├── components/
│   ├── [PrimaryComponent].tsx
│   ├── [SecondaryComponent].tsx
│   └── [UtilityComponent].tsx
├── repository/
│   ├── [Feature]Repository.ts          # [Data access layer description]
│   └── [Feature]Repository.test.ts
├── service/
│   ├── [Feature]Service.ts             # [Business logic description]
│   └── [Feature]Service.test.ts
├── types/
│   └── [Feature]Types.ts               # [Main interface descriptions]
└── utils/
    ├── [utilityName].ts               # [Utility purpose]
    └── [anotherUtility].ts            # [Another utility purpose]

src/app/[route]/
├── page.tsx                           # [Page description]
└── [dynamic-route]/
    └── page.tsx                       # [Dynamic page description]
```

### File Structure
```
/[data-directory]/                     # [Description of data files]
├── [example-file-1].[extension]
├── [example-file-2].[extension]
└── [example-file-3].[extension]
```

### [Data Format Name] Format
```[language]
// Expected data structure
{
  "[field1]": "[description]",
  "[field2]": "[description]",
  "[field3]": ["[array element description]"]
}
```

## Test-Driven Development Implementation

### TDD Workflow (Red-Green-Refactor)
1. **Define Types First**: [Primary interface], [Secondary interface], [Repository interface] interfaces
2. **Write Repository Tests**: [Primary data operations], error handling
3. **Write Service Tests**: [Business logic operations], [validation requirements]
4. **Write Component Tests**: Rendering behavior, [theme/styling] compatibility
5. **Write Integration Tests**: Full [primary workflow] pipeline
6. **Implement Code**: Minimal code to pass tests at each layer
7. **Refactor**: Improve code quality while maintaining test coverage

### ⚠️ Testing Configuration

#### Vitest Setup (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
```

#### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom'
```

#### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### Testing Requirements

#### Repository Layer Tests
- ✅ [primaryMethod()] [expected behavior]
- ✅ [secondaryMethod()] [expected behavior]
- ✅ Error handling for [common error case]
- ✅ Error handling for [another error case]
- ✅ [Data access pattern] validation
- ✅ [Sorting/filtering] functionality

#### Service Layer Tests  
- ✅ [Primary business logic] processing
- ✅ [Validation logic] (required fields)
- ✅ [Data transformation] and sanitization
- ✅ [Secondary business logic] validation

#### Component Tests
- ✅ [PrimaryComponent] renders content correctly
- ✅ [SecondaryComponent] displays [data type] properly
- ✅ [Theme/styling] compatibility
- ✅ [Interactive feature] works
- ✅ [Navigation/routing] function
- ✅ [SEO/accessibility] requirements

### Quality Gates (Must Pass Before PR)
1. **Lint**: ESLint rules pass
2. **Type-check**: TypeScript compilation succeeds
3. **Test Suite**: All tests pass with adequate coverage
4. **Production Build**: `pnpm build` succeeds (critical for [deployment type])
5. **Manual Testing**: Verify [primary user workflow]

## Implementation Order (CRITICAL FOR SUCCESS)

Follow this exact sequence to avoid dependency issues:

### Phase 1: Setup & Dependencies
```bash
# 1. Install [primary functionality] dependencies
pnpm add [dependency-list]

# 2. Install testing dependencies
pnpm add -D [testing-dependency-list]

# 3. Update package.json scripts
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### Phase 2: Configuration Files
1. Create `vitest.config.ts`
2. Create `src/test/setup.ts`
3. [Add any CSS, config, or environment setup requirements]

### Phase 3: TDD Implementation
1. **Types First**: Create `[Feature]Types.ts` interfaces
2. **Service Layer**: `[Feature]Service.ts` ([primary business logic])
3. **Repository Layer**: `[Feature]Repository.ts` ([data access logic])
4. **Components**: `[Component1].tsx`, `[Component2].tsx`, `[Component3].tsx`
5. **Routes**: `/[route]/page.tsx` and `/[route]/[dynamic]/page.tsx`

### Phase 4: Content & Testing
1. Create `/[data-directory]/` directory [location description]
2. Add sample [data files]
3. Test production build: `pnpm build`
4. Manual testing

## Common Pitfalls & Solutions

### 1. [Common Issue Category]
**Problem**: [Specific problem description]
**Solution**: [Specific solution with code example if needed]

### 2. [Build/Deployment Issues]
**Problem**: [Specific build error or deployment issue]
**Solution**: [Step-by-step solution]

### 3. [Missing Functionality]
**Problem**: [Feature not working as expected]
**Solution**: [Configuration or implementation fix]

### 4. [Data/State Issues]
**Problem**: [Data not loading/displaying correctly]
**Solution**: [Debugging steps and fix]

### 5. [Test/Development Issues]
**Problem**: [Testing or development workflow problem]
**Solution**: [Solution approach]

## Technical Approach
- **[Architecture Pattern]**: [Description of technical approach]
- **[Performance Strategy]**: [Performance considerations]
- **[Data Strategy]**: [How data is handled]
- **[SEO/Accessibility]**: [Requirements and approach]
- **[Type Safety]**: [TypeScript usage strategy]

### [Styling/UI] Requirements
- [Theme requirements]
- [Design system constraints]
- [Accessibility requirements]
- [Performance requirements]
- [Responsive design requirements]

## Definition of Done
- ✅ All tests pass (repository, service, component, integration)
- ✅ Production build succeeds (`pnpm build`)
- ✅ Lint and type-check pass
- ✅ [Number] demo [items] created and [functioning correctly]
- ✅ [Primary pages/features] functional
- ✅ [Technical requirement] working
- ✅ [UI/styling requirement] properly implemented
- ✅ [Performance requirement] validated
- ✅ Manual testing completed

## Troubleshooting

### [Primary Issue Category]
```bash
# [Command to fix common issue]
[specific commands]
```

### [Secondary Issue Category]
1. [First troubleshooting step]
2. [Second troubleshooting step]
3. [Third troubleshooting step]

### [Third Issue Category]
1. [Check this first]
2. [Verify this configuration]
3. [Confirm this setup]

### [Fourth Issue Category]
1. [Diagnostic step]
2. [Fix implementation]
3. [Verification step]

## Out of Scope
- [Feature that might be requested but isn't included]
- [Related functionality that's explicitly excluded]
- [Advanced features for future iterations]
- [Complex integrations not needed for MVP]
- [Performance optimizations beyond basic requirements]
- [Features that would significantly increase complexity]

---

## Template Usage Instructions

### How to Use This Template

1. **Replace all bracketed placeholders** `[like-this]` with your specific feature details
2. **Customize the sections** based on your feature type:
   - For UI-heavy features: Expand the UI/UX section
   - For API features: Add API specification section
   - For data-heavy features: Expand the data structure sections
3. **Adjust the TDD approach** based on complexity:
   - Simple features: Fewer test layers
   - Complex features: More comprehensive testing strategy
4. **Tailor the pitfalls section** based on your technology stack's common issues
5. **Modify the implementation phases** to match your feature's dependency chain

### Success Factors from Original Template
- **Be specific about versions and dependencies** - prevents "works on my machine" issues
- **Document the failure modes upfront** - saves debugging time later
- **Provide exact implementation order** - prevents dependency conflicts
- **Include troubleshooting for likely issues** - reduces support burden
- **Define concrete completion criteria** - prevents scope creep and ensures quality