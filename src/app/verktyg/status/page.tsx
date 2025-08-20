'use client'

import { useEffect, useState } from 'react'
import { Activity, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface QueueStatus {
  pending: number
  running: number
  completed: number
  failed: number
  total: number
}

interface Job {
  id: string
  type: string
  url: string
  status: string
  createdAt: string
  completedAt?: string
  error?: string
}

interface SystemStatus {
  queue: QueueStatus
  recentJobs: Job[]
  cache: {
    total: number
    valid: number
    expired: number
  }
  systemHealth: {
    uptime: number
    memoryUsage: any
    timestamp: string
  }
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/verktyg/status')
      if (!response.ok) throw new Error('Failed to fetch status')
      const data = await response.json()
      setStatus(data)
      setError('')
    } catch (err) {
      setError('Kunde inte hämta status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'failed': return 'destructive'
      case 'running': return 'default'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Fel vid hämtning av status</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchStatus}>Försök igen</Button>
        </div>
      </Card>
    )
  }

  if (!status) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Systemstatus</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Väntande</span>
          </div>
          <div className="text-2xl font-bold">{status.queue.pending}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Körs nu</span>
          </div>
          <div className="text-2xl font-bold">{status.queue.running}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Klara</span>
          </div>
          <div className="text-2xl font-bold">{status.queue.completed}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Misslyckade</span>
          </div>
          <div className="text-2xl font-bold">{status.queue.failed}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Senaste körningar</h3>
          <div className="space-y-3">
            {status.recentJobs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Inga körningar än
              </p>
            ) : (
              status.recentJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  {getStatusIcon(job.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {job.type.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusColor(job.status)} className="text-xs">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium truncate">{job.url}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(job.createdAt).toLocaleString('sv-SE')}
                    </div>
                    {job.error && (
                      <div className="text-xs text-red-500 mt-1">{job.error}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Systemhälsa</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Uptime:</span>
              <span className="text-sm font-medium">
                {formatUptime(status.systemHealth.uptime)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Minnesanvändning:</span>
              <span className="text-sm font-medium">
                {formatMemory(status.systemHealth.memoryUsage.heapUsed)} / {formatMemory(status.systemHealth.memoryUsage.heapTotal)}
              </span>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Cache</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Totalt:</span>
                  <span>{status.cache.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giltiga:</span>
                  <span className="text-green-600">{status.cache.valid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Utgångna:</span>
                  <span className="text-red-600">{status.cache.expired}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Senast uppdaterad: {new Date(status.systemHealth.timestamp).toLocaleString('sv-SE')}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}