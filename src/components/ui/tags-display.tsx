'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TagsDisplayProps {
  tags: string[]
  maxVisible?: number
  size?: 'sm' | 'default'
  variant?: 'default' | 'secondary' | 'outline'
  className?: string
}

export function TagsDisplay({ 
  tags, 
  maxVisible = 3, 
  size = 'sm', 
  variant = 'secondary',
  className = '' 
}: TagsDisplayProps) {
  const [showAll, setShowAll] = useState(false)
  
  if (!tags || tags.length === 0) {
    return null
  }

  const visibleTags = showAll ? tags : tags.slice(0, maxVisible)
  const hiddenCount = tags.length - maxVisible

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {visibleTags.map((tag, index) => (
        <Badge 
          key={index} 
          variant={variant}
          className={`
            ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''}
            transition-all duration-200 hover:scale-105
          `}
        >
          {tag}
        </Badge>
      ))}
      
      {hiddenCount > 0 && !showAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(true)}
          className={`
            ${size === 'sm' ? 'text-xs px-2 py-0.5 h-5' : ''}
            text-muted-foreground hover:text-foreground
            transition-colors duration-200
          `}
        >
          +{hiddenCount} fler
        </Button>
      )}
      
      {showAll && tags.length > maxVisible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(false)}
          className={`
            ${size === 'sm' ? 'text-xs px-2 py-0.5 h-5' : ''}
            text-muted-foreground hover:text-foreground
            transition-colors duration-200
          `}
        >
          visa färre
        </Button>
      )}
    </div>
  )
}