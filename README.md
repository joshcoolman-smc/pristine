# Pristine - AI-First Next.js Starter

A modern Next.js starter template designed for AI-assisted development with Claude Code. This repository includes comprehensive guidelines, testing setup, and a feature-based architecture optimized for building applications with AI pair programming.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/joshcoolman-smc/pristine.git
cd pristine

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Development Workflow with Claude Code

This starter is designed to work seamlessly with [Claude Code](https://claude.ai/code). Here's the recommended workflow:

### 1. Exploring Existing Issues

Start by asking Claude to show you existing issues:

```
"Can you list all the GitHub issues for this repository?"
```

You'll see we have one sample issue ready: **Feature: Markdown Blog System** (#1)

### 2. Developing an Existing Feature

To get started and see the workflow in action, try developing the sample blog feature:

```
"Let's work on issue #1 - the Markdown Blog feature. Can you create a feature branch and start developing this feature?"
```

Claude will:
- Create a feature branch
- Follow the TDD approach outlined in the issue
- Implement the feature according to our development guidelines
- Run tests and ensure everything passes

### 3. Creating New Features

For new features, follow this collaborative process:

#### Step 1: Research and Planning
```
"I want to add a [feature name] to this app. Can you check our guidelines and do some research on the best approach?"
```

Claude will:
- Review the development guidelines
- Research best practices for your feature
- Suggest an implementation approach

#### Step 2: Refine the Approach
Have a back-and-forth discussion:
```
"What do you think about [specific approach]? Should we handle [specific aspect] differently?"
```

#### Step 3: Create the Issue
Once you're satisfied with the plan:
```
"Great, we have enough information. Can you create a GitHub issue for this feature that conforms to our guidelines?"
```

#### Step 4: Start Development
```
"Let's start development on issue #[number]. Create a feature branch and begin implementation."
```

## Feature Development Process

1. **Issue Creation**: All features start as GitHub issues following our template
2. **Feature Branch**: Create a branch from the issue (e.g., `feature/blog-system`)
3. **TDD Implementation**: Write tests first, then code
4. **Quality Gates**: Ensure all tests, linting, and builds pass
5. **Manual Testing**: Verify the feature works as expected
6. **Pull Request**: Create a PR linking back to the issue

## Architecture Overview

```
src/
├── app/                    # Next.js App Router pages
├── features/              # Feature modules (the heart of the app)
│   └── [feature-name]/
│       ├── components/    # UI components
│       ├── hooks/        # React hooks
│       ├── repository/   # Data access
│       ├── service/      # Business logic
│       ├── types/        # TypeScript types
│       └── utils/        # Utilities
├── shared/
│   ├── components/ui/    # Reusable UI components (shadcn/ui)
│   └── hooks/           # Shared hooks
└── lib/
    └── utils.ts         # Shared utilities
```

## Testing

We follow Test-Driven Development (TDD):

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build for production (catches all issues)
pnpm build
```

## Key Resources

- **CLAUDE.md**: Specific guidance for Claude Code when working in this repo
- **ai-guidelines/development-guidelines.md**: Comprehensive development standards
- **ai-guidelines/feature-development-template.md**: Template for new features
- **ai-feature-requests/**: Detailed specifications for planned features

## Try It Out!

1. **Quick Test**: Ask Claude to develop the existing Markdown Blog feature (issue #1)
2. **Create Your Own**: Think of a feature and go through the full workflow
3. **Explore**: Ask Claude about the codebase architecture and best practices

## Example Prompts for Claude Code

### Getting Started
- "Show me all GitHub issues for this repository"
- "What's the architecture of this codebase?"
- "Explain the feature module pattern used here"

### Working on Issues
- "Let's work on issue #1 - create a feature branch and start development"
- "Show me the progress on the current feature"
- "Run the tests and fix any failures"

### Creating New Features
- "I want to add user authentication. Research the best approach for this app"
- "Create a GitHub issue for a dashboard feature with charts and analytics"
- "Let's implement a dark/light theme toggle"

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 beta
- **Components**: shadcn/ui
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm

## Important Notes

- All features must follow the Feature Module Pattern
- Use `'use client'` only for interactive components
- Server components are the default
- Follow TDD: tests first, then implementation
- No custom CSS - use Tailwind utilities only
- Dark mode support is required

---

Built with love for AI-assisted development. Happy coding with Claude Code!