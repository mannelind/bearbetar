interface QueueJob {
  id: string
  type: 'seo' | 'accessibility' | 'performance' | 'mobile'
  url: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: any
  error?: string
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  ip?: string
}

class JobQueue {
  private jobs: Map<string, QueueJob> = new Map()
  private runningJobs: Set<string> = new Set()
  private readonly maxConcurrent: number = 3
  constructor() {
    this.startProcessing()
  }

  addJob(type: QueueJob['type'], url: string, ip?: string): string {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const job: QueueJob = {
      id,
      type,
      url,
      status: 'pending',
      createdAt: new Date(),
      ip
    }

    this.jobs.set(id, job)
    return id
  }

  getJob(id: string): QueueJob | undefined {
    return this.jobs.get(id)
  }

  getQueueStatus() {
    const jobs = Array.from(this.jobs.values())
    return {
      pending: jobs.filter(j => j.status === 'pending').length,
      running: jobs.filter(j => j.status === 'running').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      total: jobs.length
    }
  }

  getRecentJobs(limit = 10): QueueJob[] {
    return Array.from(this.jobs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  private startProcessing() {
    setInterval(() => {
      this.processJobs()
    }, 1000)
  }

  private async processJobs() {
    if (this.runningJobs.size >= this.maxConcurrent) {
      return
    }

    const pendingJobs = Array.from(this.jobs.values())
      .filter(job => job.status === 'pending')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    for (const job of pendingJobs) {
      if (this.runningJobs.size >= this.maxConcurrent) {
        break
      }

      this.runJob(job)
    }
  }

  private async runJob(job: QueueJob) {
    job.status = 'running'
    job.startedAt = new Date()
    this.runningJobs.add(job.id)

    try {
      let result: any

      switch (job.type) {
        case 'seo':
          result = await this.runSEOCheck(job.url)
          break
        case 'accessibility':
          result = await this.runAccessibilityCheck(job.url)
          break
        case 'performance':
          result = await this.runPerformanceCheck(job.url)
          break
        case 'mobile':
          result = await this.runMobileCheck(job.url)
          break
      }

      job.result = result
      job.status = 'completed'
    } catch (error) {
      job.error = error instanceof Error ? error.message : 'Unknown error'
      job.status = 'failed'
    } finally {
      job.completedAt = new Date()
      this.runningJobs.delete(job.id)
    }
  }

  private async runSEOCheck(_url: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
    
    return {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      title: {
        present: true,
        length: 65,
        recommendations: []
      },
      meta: {
        description: true,
        length: 155,
        recommendations: []
      },
      headings: {
        h1Count: 1,
        structure: 'good',
        recommendations: []
      },
      images: {
        withAlt: 8,
        withoutAlt: 2,
        recommendations: ['Lägg till alt-text för 2 bilder']
      },
      recommendations: [
        'Optimera meta-beskrivning för bättre CTR',
        'Förbättra intern länkstruktur',
        'Lägg till structured data'
      ]
    }
  }

  private async runAccessibilityCheck(_url: string) {
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 4000))
    
    return {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      issues: {
        critical: Math.floor(Math.random() * 3),
        serious: Math.floor(Math.random() * 5),
        moderate: Math.floor(Math.random() * 8),
        minor: Math.floor(Math.random() * 10)
      },
      details: [
        {
          level: 'critical',
          rule: 'color-contrast',
          description: 'Otillräcklig färgkontrast upptäckt',
          elements: 2
        },
        {
          level: 'serious', 
          rule: 'image-alt',
          description: 'Bilder saknar alt-text',
          elements: 3
        }
      ],
      recommendations: [
        'Förbättra färgkontrast till minst 4.5:1',
        'Lägg till alt-text för alla bilder',
        'Förbättra tangentbordsnavigation'
      ]
    }
  }

  private async runPerformanceCheck(_url: string) {
    await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 6000))
    
    return {
      score: Math.floor(Math.random() * 40) + 60,
      metrics: {
        fcp: Math.random() * 2 + 1, // 1-3s
        lcp: Math.random() * 3 + 2, // 2-5s  
        cls: Math.random() * 0.2,   // 0-0.2
        fid: Math.random() * 200 + 50 // 50-250ms
      },
      opportunities: [
        'Komprimera bilder (sparar 150KB)',
        'Minifiera CSS (sparar 25KB)',
        'Använd moderne bildformat (sparar 200KB)'
      ],
      recommendations: [
        'Implementera lazy loading för bilder',
        'Optimera kritisk renderingssökväg',
        'Använd CDN för statiska resurser'
      ]
    }
  }

  private async runMobileCheck(_url: string) {
    await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 3000))
    
    return {
      score: Math.floor(Math.random() * 25) + 75,
      viewport: {
        configured: true,
        responsive: true
      },
      touchTargets: {
        appropriate: 8,
        tooSmall: 2
      },
      readability: {
        fontSizeOk: true,
        contrastOk: true
      },
      issues: [
        'Vissa klickbara element är för små (< 48px)',
        'Horisontell scrollning upptäckt på vissa skärmar'
      ],
      recommendations: [
        'Öka storleken på touchmål till minst 48x48px',
        'Förbättra responsiv design för små skärmar',
        'Testa på fler enhetstyper'
      ]
    }
  }

  cleanup() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    for (const [id, job] of this.jobs.entries()) {
      if (job.completedAt && job.completedAt < oneHourAgo) {
        this.jobs.delete(id)
      }
    }
  }
}

export const jobQueue = new JobQueue()

// Cleanup old jobs every hour
setInterval(() => {
  jobQueue.cleanup()
}, 60 * 60 * 1000)