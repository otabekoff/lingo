import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStripeUrl } from '../user-subscription'
import { auth, currentUser } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { getUserSubscription } from '@/db/queries'

// Mock dependencies
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

vi.mock('@/lib/stripe', () => ({
  stripe: {
    billingPortal: {
      sessions: {
        create: vi.fn(),
      },
    },
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}))

vi.mock('@/db/queries', () => ({
  getUserSubscription: vi.fn(),
}))

vi.mock('@/lib/utils', () => ({
  absoluteUrl: (path: string) => `http://localhost:3000${path}`,
}))

describe('user-subscription actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createStripeUrl', () => {
    it('throws error if unauthorized', async () => {
      // @ts-expect-error: mocking server action dependency
      auth.mockResolvedValue({ userId: null })
      // @ts-expect-error: mocking server action dependency
      currentUser.mockResolvedValue(null)
      await expect(createStripeUrl()).rejects.toThrow('Unauthorized')
    })

    it('creates a billing portal session if user has a stripeCustomerId', async () => {
      // @ts-expect-error: mocking server action dependency
      auth.mockResolvedValue({ userId: 'user_1' })
      // @ts-expect-error: mocking server action dependency
      currentUser.mockResolvedValue({ id: 'user_1', emailAddresses: [{ emailAddress: 'test@test.com' }] })
      // @ts-expect-error: mocking server action dependency
      getUserSubscription.mockResolvedValue({ stripeCustomerId: 'cus_123' })
      // @ts-expect-error: mocking server action dependency
      stripe.billingPortal.sessions.create.mockResolvedValue({ url: 'http://stripe.com/portal' })

      const result = await createStripeUrl()
      expect(result).toEqual({ data: 'http://stripe.com/portal' })
      expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: 'cus_123',
        return_url: 'http://localhost:3000/shop',
      })
    })

    it('creates a checkout session if user has no stripeCustomerId', async () => {
      // @ts-expect-error: mocking server action dependency
      auth.mockResolvedValue({ userId: 'user_1' })
      // @ts-expect-error: mocking server action dependency
      currentUser.mockResolvedValue({ id: 'user_1', emailAddresses: [{ emailAddress: 'test@test.com' }] })
      // @ts-expect-error: mocking server action dependency
      getUserSubscription.mockResolvedValue(null)
      // @ts-expect-error: mocking server action dependency
      stripe.checkout.sessions.create.mockResolvedValue({ url: 'http://stripe.com/checkout' })

      const result = await createStripeUrl()
      expect(result).toEqual({ data: 'http://stripe.com/checkout' })
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(expect.objectContaining({
        mode: 'subscription',
        customer_email: 'test@test.com',
        metadata: { userId: 'user_1' },
      }))
    })
  })
})
