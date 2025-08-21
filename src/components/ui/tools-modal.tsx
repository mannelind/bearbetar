'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Accessibility, Zap, Smartphone, ExternalLink } from 'lucide-react'

export interface ToolModalProps {
  isOpen: boolean
  onClose: () => void
  toolType: 'seo' | 'accessibility' | 'speed' | 'mobile' | null
}

const toolConfigs = {
  seo: {
    title: 'SEO-check',
    icon: Search,
    description: 'Analysera din webbplats SEO-prestanda och få förbättringsförslag för bättre sökresultat.',
    placeholder: 'Ange URL (t.ex. https://example.com)',
  },
  accessibility: {
    title: 'Tillgänglighetstest',
    icon: Accessibility,
    description: 'WCAG-kompatibilitetstest för bättre användarupplevelse och tillgänglighet.',
    placeholder: 'Ange URL (t.ex. https://example.com)',
  },
  speed: {
    title: 'Hastighetstest',
    icon: Zap,
    description: 'Mät laddningstider och prestanda för optimal användarupplevelse.',
    placeholder: 'Ange URL (t.ex. https://example.com)',
  },
  mobile: {
    title: 'Mobilvänlighetstest',
    icon: Smartphone,
    description: 'Testa hur väl din webbplats fungerar på mobila enheter.',
    placeholder: 'Ange URL (t.ex. https://example.com)',
  },
}

export function ToolsModal({ isOpen, onClose, toolType }: ToolModalProps) {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  if (!toolType || !toolConfigs[toolType]) return null

  const config = toolConfigs[toolType]
  const Icon = config.icon

  const handleAnalyze = async () => {
    if (!url.trim()) return
    
    setIsAnalyzing(true)
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Open the actual tool page in a new tab
    const toolUrls = {
      seo: '/verktyg/seo',
      accessibility: '/verktyg/tillganglighet', 
      speed: '/verktyg/hastighet',
      mobile: '/verktyg/mobil'
    }
    
    window.open(`${toolUrls[toolType]}?url=${encodeURIComponent(url)}`, '_blank')
    
    setIsAnalyzing(false)
    onClose()
    setUrl('')
  }

  const handleClose = () => {
    onClose()
    setUrl('')
    setIsAnalyzing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="tools-card-icon p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            {config.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-muted-foreground leading-relaxed">
            {config.description}
          </p>
          
          <div className="space-y-3">
            <Label htmlFor="url" className="text-sm font-medium">
              Webbplats URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder={config.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAnalyze}
              disabled={!url.trim() || isAnalyzing}
              className="flex-1 gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-spinner h-4 w-4" />
                  Analyserar...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Starta analys
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Avbryt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}