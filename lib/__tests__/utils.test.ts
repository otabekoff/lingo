import { describe, it, expect } from 'vitest'
import { cn, absoluteUrl } from '../utils'

describe('lib/utils', () => {
  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
      expect(cn('flex items-center', 'block')).toBe('items-center block')
    })
  })

  describe('absoluteUrl', () => {
    it('returns correct absolute URL', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
      expect(absoluteUrl('/shop')).toBe('http://localhost:3000/shop')
    })
  })
})
