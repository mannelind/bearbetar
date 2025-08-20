'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { TestForm } from '@/components/verktyg/test-form'
import { ResultDisplay } from '@/components/verktyg/result-display'

export default function SEOTestPage() {
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
        title="SEO-check"
        description="Analysera din webbplats SEO-prestanda och få förbättringsförslag"
        endpoint="/api/verktyg/seo"
        onResult={handleResult}
        icon={<Search className="h-6 w-6 text-primary" />}
      />

      {result && (
        <ResultDisplay
          result={result}
          type="seo"
          url={testedUrl}
        />
      )}

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Vad testas?</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Title tag - närvaro och längd</li>
          <li>• Meta description - optimering</li>
          <li>• Rubrikstruktur (H1-H6)</li>
          <li>• Alt-text för bilder</li>
          <li>• Intern länkstruktur</li>
          <li>• Tekniska SEO-faktorer</li>
        </ul>
      </div>
    </div>
  )
}