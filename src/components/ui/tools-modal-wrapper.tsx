'use client'

import { useState } from 'react'
import { Search, Accessibility, Zap, Smartphone } from 'lucide-react'
import { ToolsModal } from './tools-modal'

type ToolType = 'seo' | 'accessibility' | 'speed' | 'mobile'

export function ToolsModalWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null)

  const openTool = (tool: ToolType) => {
    setSelectedTool(tool)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTool(null)
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <button 
          onClick={() => openTool('seo')}
          className="tools-card-button block w-full text-left border-none bg-transparent p-0 cursor-pointer"
        >
          <div className="tools-card tools-card-1 h-full cursor-pointer p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="tools-card-icon">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="tools-card-title">SEO-check</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Analysera din webbplats SEO-prestanda och få förbättringsförslag för bättre sökresultat.
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => openTool('accessibility')}
          className="tools-card-button block w-full text-left border-none bg-transparent p-0 cursor-pointer"
        >
          <div className="tools-card tools-card-2 h-full cursor-pointer p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="tools-card-icon">
                <Accessibility className="h-8 w-8 text-primary" />
              </div>
              <h3 className="tools-card-title">Tillgänglighet</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                WCAG-kompatibilitetstest för bättre användarupplevelse och tillgänglighet.
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => openTool('speed')}
          className="tools-card-button block w-full text-left border-none bg-transparent p-0 cursor-pointer"
        >
          <div className="tools-card tools-card-3 h-full cursor-pointer p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="tools-card-icon">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="tools-card-title">Hastighetstest</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Mät laddningstider och prestanda för optimal användarupplevelse.
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => openTool('mobile')}
          className="tools-card-button block w-full text-left border-none bg-transparent p-0 cursor-pointer"
        >
          <div className="tools-card tools-card-4 h-full cursor-pointer p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="tools-card-icon">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="tools-card-title">Mobilvänlighet</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Testa hur väl din webbplats fungerar på mobila enheter.
              </p>
            </div>
          </div>
        </button>
      </div>

      <ToolsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        toolType={selectedTool}
      />
    </>
  )
}