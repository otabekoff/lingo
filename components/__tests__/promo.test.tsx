import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Promo } from '../promo'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt: string } & Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}))

describe('Promo component', () => {
  it('renders correctly', () => {
    render(<Promo />)
    expect(screen.getByText(/upgrade to pro/i)).toBeInTheDocument()
    expect(screen.getByText(/get unlimited hearts and more/i)).toBeInTheDocument()
  })

  it('has a link to the shop', () => {
    render(<Promo />)
    const link = screen.getByRole('link', { name: /upgrade today/i })
    expect(link).toHaveAttribute('href', '/shop')
  })
})
