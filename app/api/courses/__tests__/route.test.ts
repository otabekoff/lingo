import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '../route'
import { isAdmin } from '@/lib/admin'
import db from '@/db/drizzle'

// Mock dependencies
vi.mock('@/lib/admin', () => ({
  isAdmin: vi.fn(),
}))

vi.mock('@/db/drizzle', () => ({
  default: {
    query: {
      courses: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}))

describe('Courses API Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 if not an admin (GET)', async () => {
    // @ts-expect-error: mocking server action dependency
    isAdmin.mockResolvedValue(false)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 401 if not an admin (POST)', async () => {
    // @ts-expect-error: mocking server action dependency
    isAdmin.mockResolvedValue(false)
    const req = new Request('http://localhost:3000/api/courses', { method: 'POST', body: '{}' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns data if admin (GET)', async () => {
    // @ts-expect-error: mocking server action dependency
    isAdmin.mockResolvedValue(true)
    // @ts-expect-error: mocking db
    db.query.courses.findMany.mockResolvedValue([{ id: 1, title: 'English' }])
    
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(1)
    expect(res.headers.get('Content-Range')).toBe('courses 0-1/1')
  })
})
