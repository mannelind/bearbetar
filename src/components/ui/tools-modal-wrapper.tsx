'use client'

import { useState } from 'react'
import { Search, Accessibility, Zap, Smartphone } from 'lucide-react'
import { ToolsModal } from './tools-modal'
import { ToolsCard } from './tools-card'

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
        <ToolsCard
          onClick={() => openTool('seo')}
          icon={<Search className="h-8 w-8 text-primary" />}
          title="SEO-check"
          description="Analysera din webbplats SEO-prestanda och få förbättringsförslag för bättre sökresultat."
          className="tools-card-1"
        />

        <ToolsCard
          onClick={() => openTool('accessibility')}
          icon={<Accessibility className="h-8 w-8 text-primary" />}
          title="Tillgänglighet"
          description="WCAG-kompatibilitetstest för bättre användarupplevelse och tillgänglighet."
          className="tools-card-2"
        />

        <ToolsCard
          onClick={() => openTool('speed')}
          icon={<Zap className="h-8 w-8 text-primary" />}
          title="Hastighetstest"
          description="Mät laddningstider och prestanda för optimal användarupplevelse."
          className="tools-card-3"
        />

        <ToolsCard
          onClick={() => openTool('mobile')}
          icon={<Smartphone className="h-8 w-8 text-primary" />}
          title="Mobilvänlighet"
          description="Testa hur väl din webbplats fungerar på mobila enheter."
          className="tools-card-4"
        />
      </div>

      <ToolsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        toolType={selectedTool}
      />
    </>
  )
}