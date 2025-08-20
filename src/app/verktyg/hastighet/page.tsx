'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { TestForm } from '@/components/verktyg/test-form'
import { ResultDisplay } from '@/components/verktyg/result-display'

export default function PerformanceTestPage() {
  const [result, setResult] = useState(null)
  const [testedUrl, setTestedUrl] = useState('')

  const handleResult = (newResult: any) => {
    setResult(newResult)
    if (newResult) {
      const urlInput = document.querySelector('input[type="url"]') as HTMLInputElement
      setTestedUrl(urlInput?.value || '')
    }
  }

  return (
    <div className="space-y-6">
      <TestForm
        title="Hastighetstest"
        description="Mät laddningstider och prestanda för optimal användarupplevelse"
        endpoint="/api/verktyg/hastighet"
        onResult={handleResult}
        icon={<Zap className="h-6 w-6 text-primary" />}
      />

      {result && (
        <ResultDisplay
          result={result}
          type="performance"
          url={testedUrl}
        />
      )}

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Vad testas?</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• First Contentful Paint (FCP)</li>
          <li>• Largest Contentful Paint (LCP)</li>
          <li>• Cumulative Layout Shift (CLS)</li>
          <li>• First Input Delay (FID)</li>
          <li>• Bildoptimering</li>
          <li>• Resurskomprimering</li>
        </ul>
      </div>
    </div>
  )
}