import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isAdmin } from '../admin'
import { auth } from '@clerk/nextjs/server'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

describe('lib/admin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true for admin user IDs', async () => {
    // @ts-expect-error: mocking server action dependency
    auth.mockResolvedValue({ userId: 'user_3DDlAkAjSTyH2WTTGl1QeayVtRO' })
    const result = await isAdmin()
    expect(result).toBe(true)
  })

  it('returns false for non-admin user IDs', async () => {
    // @ts-expect-error: mocking server action dependency
    auth.mockResolvedValue({ userId: 'user_regular' })
    const result = await isAdmin()
    expect(result).toBe(false)
  })

  it('returns false if no user is authenticated', async () => {
    // @ts-expect-error: mocking server action dependency
    auth.mockResolvedValue({ userId: null })
    const result = await isAdmin()
    expect(result).toBe(false)
  })
})
