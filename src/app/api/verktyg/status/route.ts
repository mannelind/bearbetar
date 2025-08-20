import { NextResponse } from 'next/server'
import { jobQueue } from '@/lib/queue-system'
import { cacheSystem } from '@/lib/cache-system'

export async function GET() {
  try {
    const queueStatus = jobQueue.getQueueStatus()
    const recentJobs = jobQueue.getRecentJobs(20)
    const cacheStats = cacheSystem.getStats()

    return NextResponse.json({
      queue: queueStatus,
      recentJobs: recentJobs.map(job => ({
        id: job.id,
        type: job.type,
        url: job.url,
        status: job.status,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        error: job.error
      })),
      cache: cacheStats,
      systemHealth: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}