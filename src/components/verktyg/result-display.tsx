'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, ExternalLink } from 'lucide-react'

interface ResultDisplayProps {
  result: any
  type: 'seo' | 'accessibility' | 'performance' | 'mobile'
  url: string
}

export function ResultDisplay({ result, type, url }: ResultDisplayProps) {
  if (!result) return null

  const downloadJson = () => {
    const dataStr = JSON.stringify(result, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${type}-test-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreText = (score: number) => {
    if (score >= 90) return 'Utmärkt'
    if (score >= 70) return 'Bra'
    if (score >= 50) return 'Måttlig'
    return 'Behöver förbättring'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Testresultat</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>URL:</span>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              {url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={downloadJson}>
          <Download className="mr-2 h-4 w-4" />
          Ladda ner JSON
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl font-bold">{result.score}</div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">Totalt betyg</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getScoreColor(result.score)}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <div className="text-sm mt-1">{getScoreText(result.score)}</div>
          </div>
        </div>
      </div>

      {type === 'seo' && <SEOResults result={result} />}
      {type === 'accessibility' && <AccessibilityResults result={result} />}
      {type === 'performance' && <PerformanceResults result={result} />}
      {type === 'mobile' && <MobileResults result={result} />}

      {result.recommendations && result.recommendations.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Rekommendationer</h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

function SEOResults({ result }: { result: any }) {
  return (
    <div className="space-y-4">
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Title Tag</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={result.title.present ? "default" : "destructive"}>
                {result.title.present ? "Finns" : "Saknas"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Längd:</span>
              <span>{result.title.length} tecken</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Meta Description</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={result.meta.description ? "default" : "destructive"}>
                {result.meta.description ? "Finns" : "Saknas"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Längd:</span>
              <span>{result.meta.length} tecken</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Rubriker</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>H1-antal:</span>
              <span>{result.headings.h1Count}</span>
            </div>
            <div className="flex justify-between">
              <span>Struktur:</span>
              <Badge variant={result.headings.structure === 'good' ? "default" : "secondary"}>
                {result.headings.structure === 'good' ? 'Bra' : 'Kan förbättras'}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Bilder</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Med alt-text:</span>
              <span>{result.images.withAlt}</span>
            </div>
            <div className="flex justify-between">
              <span>Utan alt-text:</span>
              <span className={result.images.withoutAlt > 0 ? 'text-red-500' : ''}>
                {result.images.withoutAlt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccessibilityResults({ result }: { result: any }) {
  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive'
      case 'serious': return 'destructive'
      case 'moderate': return 'secondary'
      case 'minor': return 'outline'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-4">
      <Separator />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{result.issues.critical}</div>
          <div className="text-sm text-muted-foreground">Kritiska</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">{result.issues.serious}</div>
          <div className="text-sm text-muted-foreground">Allvarliga</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{result.issues.moderate}</div>
          <div className="text-sm text-muted-foreground">Måttliga</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{result.issues.minor}</div>
          <div className="text-sm text-muted-foreground">Mindre</div>
        </div>
      </div>

      {result.details && result.details.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Detaljerade problem</h4>
          <div className="space-y-2">
            {result.details.map((detail: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Badge variant={getSeverityColor(detail.level)}>
                  {detail.level}
                </Badge>
                <div className="flex-1">
                  <div className="font-medium">{detail.rule}</div>
                  <div className="text-sm text-muted-foreground">{detail.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {detail.elements} element(er) påverkade
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PerformanceResults({ result }: { result: any }) {
  const formatTime = (time: number) => `${time.toFixed(2)}s`
  // const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)}KB`

  return (
    <div className="space-y-4">
      <Separator />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold">{formatTime(result.metrics.fcp)}</div>
          <div className="text-sm text-muted-foreground">First Contentful Paint</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{formatTime(result.metrics.lcp)}</div>
          <div className="text-sm text-muted-foreground">Largest Contentful Paint</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{result.metrics.cls.toFixed(3)}</div>
          <div className="text-sm text-muted-foreground">Cumulative Layout Shift</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{Math.round(result.metrics.fid)}ms</div>
          <div className="text-sm text-muted-foreground">First Input Delay</div>
        </div>
      </div>

      {result.opportunities && result.opportunities.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Optimeringsmöjligheter</h4>
          <div className="space-y-2">
            {result.opportunities.map((opp: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-green-500">⚡</span>
                <span>{opp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileResults({ result }: { result: any }) {
  return (
    <div className="space-y-4">
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Viewport</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Konfigurerad:</span>
              <Badge variant={result.viewport.configured ? "default" : "destructive"}>
                {result.viewport.configured ? "Ja" : "Nej"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Responsiv:</span>
              <Badge variant={result.viewport.responsive ? "default" : "destructive"}>
                {result.viewport.responsive ? "Ja" : "Nej"}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Touch Targets</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Lämplig storlek:</span>
              <span className="text-green-500">{result.touchTargets.appropriate}</span>
            </div>
            <div className="flex justify-between">
              <span>För små:</span>
              <span className={result.touchTargets.tooSmall > 0 ? 'text-red-500' : ''}>
                {result.touchTargets.tooSmall}
              </span>
            </div>
          </div>
        </div>
      </div>

      {result.issues && result.issues.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Mobila problem</h4>
          <ul className="space-y-1">
            {result.issues.map((issue: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-orange-500">⚠</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}