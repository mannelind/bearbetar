'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface TestFormProps {
  title: string
  description: string
  endpoint: string
  onResult: (result: any) => void
  icon: React.ReactNode
}

export function TestForm({ title, description, endpoint, onResult, icon }: TestFormProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const pollJob = async (jobId: string) => {
    const maxAttempts = 120 // 2 minutes max
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`${endpoint}?jobId=${jobId}`)
        const data = await response.json()

        if (data.status === 'completed') {
          setLoading(false)
          setStatus('')
          onResult(data.result)
          return
        }

        if (data.status === 'failed') {
          setLoading(false)
          setError(data.error || 'Test failed')
          setStatus('')
          return
        }

        if (data.status === 'running') {
          setStatus('Kör test...')
        } else if (data.status === 'pending') {
          setStatus('I kö...')
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000)
        } else {
          setLoading(false)
          setError('Timeout - testet tog för lång tid')
          setStatus('')
        }
      } catch (error) {
        setLoading(false)
        setError('Fel vid polling av jobstatus')
        setStatus('')
      }
    }

    poll()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('')
    setLoading(true)
    onResult(null)

    if (!url.trim()) {
      setError('URL krävs')
      setLoading(false)
      return
    }

    if (!validateUrl(url)) {
      setError('Ogiltig URL-format')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setError(`Rate limit nådd. Försök igen om ${data.retryAfter} sekunder.`)
        } else {
          setError(data.error || 'Fel vid start av test')
        }
        setLoading(false)
        return
      }

      if (data.cached) {
        setLoading(false)
        onResult(data.result)
      } else {
        setJobId(data.jobId)
        setStatus('Startar test...')
        pollJob(data.jobId)
      }
    } catch (error) {
      setError('Nätverksfel - försök igen')
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {status || 'Laddar...'}
              </>
            ) : (
              'Kör test'
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && status && (
          <Alert>
            <AlertDescription>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {status}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </form>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Tips: Använd en fullständig URL inklusive https://</p>
        <p>Resultat sparas i 24 timmar för snabbare återkommande tester.</p>
      </div>
    </Card>
  )
}