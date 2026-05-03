import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('returns false when window width is greater than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when window width is less than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 500,
    })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
})
