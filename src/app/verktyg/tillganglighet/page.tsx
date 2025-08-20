'use client'

import { useState } from 'react'
import { Accessibility } from 'lucide-react'
import { TestForm } from '@/components/verktyg/test-form'
import { ResultDisplay } from '@/components/verktyg/result-display'

export default function AccessibilityTestPage() {
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
        title="Tillgänglighetstest"
        description="WCAG-kompatibilitetstest för bättre användarupplevelse"
        endpoint="/api/verktyg/tillganglighet"
        onResult={handleResult}
        icon={<Accessibility className="h-6 w-6 text-primary" />}
      />

      {result && (
        <ResultDisplay
          result={result}
          type="accessibility"
          url={testedUrl}
        />
      )}

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Vad testas?</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Färgkontrast enligt WCAG-riktlinjer</li>
          <li>• Alt-text för bilder och media</li>
          <li>• Tangentbordsnavigation</li>
          <li>• Skärmläsarkompatibilitet</li>
          <li>• Semantisk HTML-struktur</li>
          <li>• Focus-hantering</li>
        </ul>
      </div>
    </div>
  )
}