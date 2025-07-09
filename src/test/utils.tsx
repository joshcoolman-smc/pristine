import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

// Custom render function that includes providers if needed
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    // Add any providers here in the future (theme, router, etc.)
    // wrapper: ({ children }) => <AllTheProviders>{children}</AllTheProviders>,
    ...options,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Utility functions for common test patterns
export const createMockComponent = (name: string) => {
  const MockComponent = ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
    <div data-testid={`mock-${name.toLowerCase()}`} {...props}>
      {children}
    </div>
  )
  MockComponent.displayName = `Mock${name}`
  return MockComponent
}

export const mockNextRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
})

// Mock Next.js Image component for tests
export const MockImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
  <img src={src} alt={alt} {...props} />
)

// Mock Next.js Link component for tests  
export const MockLink = ({ href, children, ...props }: { href: string; children: ReactNode; [key: string]: unknown }) => (
  <a href={href} {...props}>
    {children}
  </a>
)