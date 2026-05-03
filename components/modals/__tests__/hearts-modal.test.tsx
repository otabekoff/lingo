import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HeartsModal } from '../hearts-modal'
import { useHeartsModal } from '@/store/use-hearts-modal'

// Mock the store
vi.mock('@/store/use-hearts-modal', () => ({
  useHeartsModal: vi.fn(),
}))

// Mock useRouter
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('HeartsModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when closed', () => {
    // @ts-expect-error: mocking store return value
    useHeartsModal.mockReturnValue({
      isOpen: false,
      close: vi.fn(),
    })

    const { container } = render(<HeartsModal />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders correctly when open', () => {
    // @ts-expect-error: mocking store return value
    useHeartsModal.mockReturnValue({
      isOpen: true,
      close: vi.fn(),
    })

    render(<HeartsModal />)
    expect(screen.getByText(/you ran out of hearts!/i)).toBeInTheDocument()
    expect(screen.getByText(/get pro for unlimited hearts/i)).toBeInTheDocument()
  })

  it('redirects to shop when "Get unlimited hearts" is clicked', () => {
    const mockClose = vi.fn()
    // @ts-expect-error: mocking store return value
    useHeartsModal.mockReturnValue({
      isOpen: true,
      close: mockClose,
    })

    render(<HeartsModal />)
    fireEvent.click(screen.getByRole('button', { name: /get unlimited hearts/i }))
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/shop')
  })

  it('calls close when "No thanks" is clicked', () => {
    const mockClose = vi.fn()
    // @ts-expect-error: mocking store return value
    useHeartsModal.mockReturnValue({
      isOpen: true,
      close: mockClose,
    })

    render(<HeartsModal />)
    fireEvent.click(screen.getByRole('button', { name: /no thanks/i }))
    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
