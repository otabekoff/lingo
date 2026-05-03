import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SidebarItem } from '../sidebar-item'
import { usePathname } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt: string } & Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}))

describe('SidebarItem component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with label and icon', () => {
    // @ts-expect-error: mocking hook return value
    usePathname.mockReturnValue('/other')
    render(<SidebarItem label="Test" iconSrc="/test.svg" href="/test" />)
    
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByAltText('Test')).toHaveAttribute('src', '/test.svg')
  })

  it('applies active styles when current path matches href', () => {
    // @ts-expect-error: mocking hook return value
    usePathname.mockReturnValue('/test')
    render(<SidebarItem label="Test" iconSrc="/test.svg" href="/test" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('border-sky-300')
  })
})
