import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ComponentProps } from 'react'
import { Unit } from '../unit'

// Mock sub-components
vi.mock('../unit-banner', () => ({
  UnitBanner: ({ title, description }: { title: string, description: string }) => (
    <div>{title} - {description}</div>
  )
}))

vi.mock('../lesson-button', () => ({
  LessonButton: ({ id, current, locked }: { id: number, current: boolean, locked: boolean }) => (
    <div data-testid={`lesson-${id}`}>
      {current ? 'Current' : locked ? 'Locked' : 'Unlocked'}
    </div>
  )
}))

describe('Unit component', () => {
  const mockLessons = [
    { id: 1, title: 'Lesson 1', order: 1, unitId: 1, completed: true },
    { id: 2, title: 'Lesson 2', order: 2, unitId: 1, completed: false },
    { id: 3, title: 'Lesson 3', order: 3, unitId: 1, completed: false },
  ]

  it('renders unit banner and lessons', () => {
    render(
      <Unit
        id={1}
        order={1}
        title="Unit 1"
        description="Learn basics"
        lessons={mockLessons as unknown as ComponentProps<typeof Unit>['lessons']}
        activeLesson={{ id: 2, unit: { id: 1 } } as unknown as ComponentProps<typeof Unit>['activeLesson']}
        activeLessonPercentage={50}
      />
    )

    expect(screen.getByText('Unit 1 - Learn basics')).toBeInTheDocument()
    expect(screen.getByTestId('lesson-1')).toHaveTextContent('Unlocked')
    expect(screen.getByTestId('lesson-2')).toHaveTextContent('Current')
    expect(screen.getByTestId('lesson-3')).toHaveTextContent('Locked')
  })
})
