import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FeedWrapper } from '../feed-wrapper'
import { StickyWrapper } from '../sticky-wrapper'

describe('Wrapper components', () => {
  it('FeedWrapper renders children', () => {
    render(<FeedWrapper><div>Test Child</div></FeedWrapper>)
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('StickyWrapper renders children', () => {
    render(<StickyWrapper><div>Sticky Child</div></StickyWrapper>)
    expect(screen.getByText('Sticky Child')).toBeInTheDocument()
  })
})
