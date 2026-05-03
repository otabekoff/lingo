import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExitModal } from '../exit-modal'
import { useExitModal } from '@/store/use-exit-modal'

// Mock the store
vi.mock('@/store/use-exit-modal', () => ({
  useExitModal: vi.fn(),
}))

// Mock useRouter
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('ExitModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when closed', () => {
    // @ts-expect-error: mocking store return value
    useExitModal.mockReturnValue({
      isOpen: false,
      close: vi.fn(),
    })

    const { container } = render(<ExitModal />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders correctly when open', () => {
    // @ts-expect-error: mocking store return value
    useExitModal.mockReturnValue({
      isOpen: true,
      close: vi.fn(),
    })

    render(<ExitModal />)
    expect(screen.getByText(/wait, don't go!/i)).toBeInTheDocument()
    expect(screen.getByText(/you're about to leave the lesson/i)).toBeInTheDocument()
  })

  it('calls close when "Keep learning" is clicked', () => {
    const mockClose = vi.fn()
    // @ts-expect-error: mocking store return value
    useExitModal.mockReturnValue({
      isOpen: true,
      close: mockClose,
    })

    render(<ExitModal />)
    fireEvent.click(screen.getByRole('button', { name: /keep learning/i }))
    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('calls close and redirects when "End session" is clicked', () => {
    const mockClose = vi.fn()
    // @ts-expect-error: mocking store return value
    useExitModal.mockReturnValue({
      isOpen: true,
      close: mockClose,
    })

    render(<ExitModal />)
    fireEvent.click(screen.getByRole('button', { name: /end session/i }))
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/learn')
  })
})
