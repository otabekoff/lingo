import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
}))

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  auth: () => ({
    userId: 'test-user',
  }),
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'test-user',
      fullName: 'Test User',
    },
  }),
  useAuth: () => ({
    userId: 'test-user',
    isSignedIn: true,
  }),
}))
