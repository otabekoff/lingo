import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Quests } from '../quests'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt: string } & Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}))

// Mock constants
vi.mock('@/constants', () => ({
  quests: [
    { title: 'Earn 100 XP', value: 100 },
    { title: 'Earn 500 XP', value: 500 },
  ],
}))

describe('Quests component', () => {
  it('renders correctly with title and links', () => {
    render(<Quests points={50} />)
    expect(screen.getByText('Quests')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute('href', '/quests')
  })

  it('calculates and displays progress correctly', () => {
    render(<Quests points={50} />)
    expect(screen.getByText('Earn 100 XP')).toBeInTheDocument()
    
    // Check progress bars - we can check the value attribute if the Progress component exposes it
    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '50')
    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '10')
  })
})
