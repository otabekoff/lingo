import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from '../sidebar'

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  ClerkLoading: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ClerkLoaded: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  UserButton: () => <button>UserButton</button>,
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt: string } & Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>,
}))

describe('Sidebar component', () => {
  it('renders the branding logo and name', () => {
    render(<Sidebar />)
    expect(screen.getByAltText('Mascot')).toBeInTheDocument()
    expect(screen.getByText('Lingo')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(<Sidebar />)
    expect(screen.getByText(/learn/i)).toBeInTheDocument()
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument()
    expect(screen.getByText(/quests/i)).toBeInTheDocument()
    expect(screen.getByText(/shop/i)).toBeInTheDocument()
  })

  it('renders the UserButton when loaded', async () => {
    render(<Sidebar />)
    expect(await screen.findByRole('button', { name: /userbutton/i })).toBeInTheDocument()
  })
})
