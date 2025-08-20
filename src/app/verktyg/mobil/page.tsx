'use client'

import { useState } from 'react'
import { Smartphone } from 'lucide-react'
import { TestForm } from '@/components/verktyg/test-form'
import { ResultDisplay } from '@/components/verktyg/result-display'

export default function MobileTestPage() {
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
        title="Mobilvänlighetstest"
        description="Testa hur väl din webbplats fungerar på mobila enheter"
        endpoint="/api/verktyg/mobil"
        onResult={handleResult}
        icon={<Smartphone className="h-6 w-6 text-primary" />}
      />

      {result && (
        <ResultDisplay
          result={result}
          type="mobile"
          url={testedUrl}
        />
      )}

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Vad testas?</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Viewport-konfiguration</li>
          <li>• Responsiv design</li>
          <li>• Touch target-storlekar</li>
          <li>• Textläsbarhet på små skärmar</li>
          <li>• Horisontell scrollning</li>
          <li>• Mobil användbarhet</li>
        </ul>
      </div>
    </div>
  )
}