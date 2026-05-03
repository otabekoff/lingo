import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reduceHearts } from '../user-progress'
import db from '@/db/drizzle'
import { auth } from '@clerk/nextjs/server'
import { getUserProgress, getUserSubscription } from '@/db/queries'

// Mock dependencies
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

vi.mock('@/db/drizzle', () => ({
  default: {
    query: {
      challenges: {
        findFirst: vi.fn(),
      },
      challengeProgress: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    })),
  },
}))

vi.mock('@/db/queries', () => ({
  getUserProgress: vi.fn(),
  getUserSubscription: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('user-progress actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('reduceHearts', () => {
    it('throws error if unauthorized', async () => {
      // @ts-expect-error: mocking server action dependency
      auth.mockResolvedValue({ userId: null })
      await expect(reduceHearts(1)).rejects.toThrow('Unauthorized')
    })

    it('returns error if hearts are already 0', async () => {
      // @ts-expect-error: mocking server action dependency
      auth.mockResolvedValue({ userId: 'user_1' })
      // @ts-expect-error: mocking server action dependency
      getUserProgress.mockResolvedValue({ hearts: 0 })
      // @ts-expect-error: mocking server action dependency
      getUserSubscription.mockResolvedValue(null)
      // @ts-expect-error: mocking server action dependency
      db.query.challenges.findFirst.mockResolvedValue({ id: 1, lessonId: 1 })
      // @ts-expect-error: mocking server action dependency
      db.query.challengeProgress.findFirst.mockResolvedValue(null)

      const result = await reduceHearts(1)
      expect(result).toEqual({ error: 'hearts' })
    })

    it('returns error if user has active subscription', async () => {
      // @ts-expect-error: mocking server action dependency
      auth.mockResolvedValue({ userId: 'user_1' })
      // @ts-expect-error: mocking server action dependency
      getUserProgress.mockResolvedValue({ hearts: 5 })
      // @ts-expect-error: mocking server action dependency
      getUserSubscription.mockResolvedValue({ isActive: true })
      // @ts-expect-error: mocking server action dependency
      db.query.challenges.findFirst.mockResolvedValue({ id: 1, lessonId: 1 })
      // @ts-expect-error: mocking server action dependency
      db.query.challengeProgress.findFirst.mockResolvedValue(null)

      const result = await reduceHearts(1)
      expect(result).toEqual({ error: 'subscription' })
    })

    it('returns practice error if challenge is already completed', async () => {
        // @ts-expect-error: mocking server action dependency
        auth.mockResolvedValue({ userId: 'user_1' })
        // @ts-expect-error: mocking server action dependency
        db.query.challenges.findFirst.mockResolvedValue({ id: 1, lessonId: 1 })
        // @ts-expect-error: mocking server action dependency
        db.query.challengeProgress.findFirst.mockResolvedValue({ id: 1 })

        const result = await reduceHearts(1)
        expect(result).toEqual({ error: 'practice' })
    })
  })
})
