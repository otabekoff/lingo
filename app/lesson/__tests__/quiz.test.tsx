import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Quiz } from '../quiz'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

vi.mock('react-use', () => ({
  useAudio: () => [null, null, { play: vi.fn() }],
  useWindowSize: () => ({ width: 1000, height: 1000 }),
  useMount: (fn: () => void) => fn(),
  useKey: vi.fn(),
  useMedia: vi.fn(),
}))

vi.mock('@/store/use-hearts-modal', () => ({
  useHeartsModal: vi.fn(() => ({ open: vi.fn() })),
}))

vi.mock('@/store/use-practice-modal', () => ({
  usePracticeModal: vi.fn(() => ({ open: vi.fn() })),
}))

vi.mock('@/store/use-exit-modal', () => ({
  useExitModal: vi.fn(() => ({ open: vi.fn() })),
}))

vi.mock('@/actions/user-progress', () => ({
  reduceHearts: vi.fn(),
}))

vi.mock('@/actions/challenge-progress', () => ({
  upsertChallengeProgress: vi.fn(),
}))

const mockChallenges = [
  {
    id: 1,
    lessonId: 1,
    type: 'SELECT' as const,
    question: 'Which one is "the dog"?',
    order: 1,
    completed: false,
    challengeOptions: [
      { id: 1, challengeId: 1, text: 'the dog', correct: true, imageSrc: '/dog.svg', audioSrc: '/dog.mp3' },
      { id: 2, challengeId: 1, text: 'the cat', correct: false, imageSrc: '/cat.svg', audioSrc: '/cat.mp3' },
    ],
  },
]

describe('Quiz component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the first challenge', () => {
    render(
      <Quiz
        initialPercentage={0}
        initialHearts={5}
        initialLessonId={1}
        initialLessonChallenges={mockChallenges}
        userSubscription={null}
      />
    )

    expect(screen.getByText('Which one is "the dog"?')).toBeInTheDocument()
    expect(screen.getByText('the dog')).toBeInTheDocument()
    expect(screen.getByText('the cat')).toBeInTheDocument()
  })

  it('allows selecting an option', () => {
    render(
      <Quiz
        initialPercentage={0}
        initialHearts={5}
        initialLessonId={1}
        initialLessonChallenges={mockChallenges}
        userSubscription={null}
      />
    )

    const dogOption = screen.getByText('the dog').closest('div')
    fireEvent.click(dogOption!)
    
    // Check if the button in the footer is enabled (Continue)
    const checkButton = screen.getByRole('button', { name: /check/i })
    expect(checkButton).not.toBeDisabled()
  })
})
