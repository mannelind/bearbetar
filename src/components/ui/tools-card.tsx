'use client'

import { ReactNode } from 'react'

interface ToolsCardProps {
  onClick: () => void
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function ToolsCard({ onClick, icon, title, description, className = '' }: ToolsCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`tools-card ${className} h-full cursor-pointer p-6`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="tools-card-icon">
          {icon}
        </div>
        <h3 className="tools-card-title">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}