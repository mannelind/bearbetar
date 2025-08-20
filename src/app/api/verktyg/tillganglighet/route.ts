import { NextRequest, NextResponse } from 'next/server'
import { jobQueue } from '@/lib/queue-system'
import { cacheSystem } from '@/lib/cache-system'
import { RateLimiter } from '@/lib/rate-limiter'

const rateLimiter = new RateLimiter(10, 15 * 60 * 1000)

function getClientIP(request: NextRequest): string {
  return request.ip || 
         request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    
    if (!rateLimiter.isAllowed(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: rateLimiter.getRemainingTime(ip)
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const cacheKey = cacheSystem.generateKey('accessibility', url)
    const cachedResult = cacheSystem.get(cacheKey)
    
    if (cachedResult) {
      return NextResponse.json({
        jobId: null,
        cached: true,
        result: cachedResult
      })
    }

    const jobId = jobQueue.addJob('accessibility', url, ip)

    return NextResponse.json({
      jobId,
      cached: false,
      message: 'Accessibility check queued successfully'
    })

  } catch (error) {
    console.error('Accessibility API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    )
  }

  const job = jobQueue.getJob(jobId)

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }

  if (job.status === 'completed' && job.result) {
    const cacheKey = cacheSystem.generateKey('accessibility', job.url)
    cacheSystem.set(cacheKey, job.result)
  }

  return NextResponse.json({
    status: job.status,
    result: job.result,
    error: job.error,
    createdAt: job.createdAt,
    completedAt: job.completedAt
  })
}