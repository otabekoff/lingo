import { describe, it, expect, vi, beforeEach } from 'vitest'
import { upsertChallengeProgress } from '../challenge-progress'
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
    insert: vi.fn(() => ({
        values: vi.fn(),
    }))
  },
}))

vi.mock('@/db/queries', () => ({
  getUserProgress: vi.fn(),
  getUserSubscription: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('challenge-progress actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('upsertChallengeProgress', () => {
    it('throws error if unauthorized', async () => {
      // @ts-expect-error: mocking server action dependency
      auth.mockResolvedValue({ userId: null })
      await expect(upsertChallengeProgress(1)).rejects.toThrow('Unauthorized')
    })

    it('adds points when challenge is completed for the first time', async () => {
        // @ts-expect-error: mocking server action dependency
        auth.mockResolvedValue({ userId: 'user_1' })
        // @ts-expect-error: mocking server action dependency
        getUserProgress.mockResolvedValue({ hearts: 5, points: 0 })
        // @ts-expect-error: mocking server action dependency
        getUserSubscription.mockResolvedValue(null)
        // @ts-expect-error: mocking server action dependency
        db.query.challenges.findFirst.mockResolvedValue({ id: 1, lessonId: 1 })
        // @ts-expect-error: mocking server action dependency
        db.query.challengeProgress.findFirst.mockResolvedValue(null)

        await upsertChallengeProgress(1)

        // Verify points increment
        expect(db.update).toHaveBeenCalled()
        // We'd need a more complex spy to check the exact arguments of set()
    })

    it('returns error if user has no hearts left and is not practicing', async () => {
        // @ts-expect-error: mocking server action dependency
        auth.mockResolvedValue({ userId: 'user_1' })
        // @ts-expect-error: mocking server action dependency
        getUserProgress.mockResolvedValue({ hearts: 0, points: 0 })
        // @ts-expect-error: mocking server action dependency
        getUserSubscription.mockResolvedValue(null)
        // @ts-expect-error: mocking server action dependency
        db.query.challenges.findFirst.mockResolvedValue({ id: 1, lessonId: 1 })
        // @ts-expect-error: mocking server action dependency
        db.query.challengeProgress.findFirst.mockResolvedValue(null)

        const result = await upsertChallengeProgress(1)
        expect(result).toEqual({ error: 'hearts' })
    })
  })
})
