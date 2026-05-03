import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { stripe } from '@/lib/stripe'
import db from '@/db/drizzle'
import { headers } from 'next/headers'

// Mock dependencies
vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
    subscriptions: {
      retrieve: vi.fn(),
    },
  },
}))

vi.mock('@/db/drizzle', () => ({
  default: {
    insert: vi.fn(() => ({
      values: vi.fn(),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

describe('Stripe Webhook Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = 'test_secret'
  })

  it('returns 400 if signature is missing', async () => {
    // @ts-expect-error: mocking headers
    headers.mockResolvedValue({ get: () => null })
    // @ts-expect-error: mocking stripe
    stripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Missing signature')
    })
    
    const req = new Request('http://localhost:3000/api/webhooks/stripe', { method: 'POST', body: '{}' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('Webhook error: Missing signature')
  })

  it('handles checkout.session.completed correctly', async () => {
    // @ts-expect-error: mocking headers
    headers.mockResolvedValue({ get: () => 'valid_sig' })
    
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          subscription: 'sub_123',
          metadata: { userId: 'user_1' },
          customer: 'cus_123',
        }
      }
    }
    
    // @ts-expect-error: mocking stripe
    stripe.webhooks.constructEvent.mockReturnValue(mockEvent)
    // @ts-expect-error: mocking stripe
    stripe.subscriptions.retrieve.mockResolvedValue({
      id: 'sub_123',
      customer: 'cus_123',
      items: { data: [{ price: { id: 'price_123' } }] },
      current_period_end: Math.floor(Date.now() / 1000) + 3600,
    })

    const req = new Request('http://localhost:3000/api/webhooks/stripe', { method: 'POST', body: '{}' })
    const res = await POST(req)
    
    expect(res.status).toBe(200)
    expect(db.insert).toHaveBeenCalled()
  })
})
