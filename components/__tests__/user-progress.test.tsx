import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UserProgress } from '../user-progress'

const mockCourse = {
  id: 1,
  title: 'Spanish',
  imageSrc: '/es.svg',
}

describe('UserProgress component', () => {
  it('renders points correctly', () => {
    render(
      <UserProgress
        activeCourse={mockCourse}
        hearts={5}
        points={100}
        hasActiveSubscription={false}
      />
    )
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders hearts correctly when no subscription', () => {
    render(
      <UserProgress
        activeCourse={mockCourse}
        hearts={3}
        points={100}
        hasActiveSubscription={false}
      />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders infinity icon when subscription is active', () => {
    const { container } = render(
      <UserProgress
        activeCourse={mockCourse}
        hearts={3}
        points={100}
        hasActiveSubscription={true}
      />
    )
    // Check for InfinityIcon (lucide-react)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
    // It shouldn't show the number 3
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })

  it('renders the active course image', () => {
    render(
      <UserProgress
        activeCourse={mockCourse}
        hearts={5}
        points={100}
        hasActiveSubscription={false}
      />
    )
    const image = screen.getByAltText('Spanish')
    expect(image).toBeInTheDocument()
    // Next/Image renders src with optimization, but we check if it contains the path
    expect(image.getAttribute('src')).toContain('es.svg')
  })
})
