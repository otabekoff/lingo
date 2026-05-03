import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MobileSidebar } from '../mobile-sidebar'
import { MobileHeader } from '../mobile-header'

// Mock Sidebar
vi.mock('@/components/sidebar', () => ({
  Sidebar: () => <div>Mock Sidebar</div>,
}))

// Mock Sheet (shadcn component)
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Mobile Navigation components', () => {
  it('MobileHeader renders the trigger', () => {
    render(<MobileHeader />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('MobileSidebar renders the sidebar content', () => {
    render(<MobileSidebar />)
    expect(screen.getByText('Mock Sidebar')).toBeInTheDocument()
  })
})
