'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
  disabled?: boolean
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 500,
  className,
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [tooltipId] = useState(() => `tooltip-${Math.random().toString(36).slice(2)}`)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return { x: 0, y: 0 }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current?.getBoundingClientRect()
    
    if (!tooltipRect) return { x: 0, y: 0 }

    let x = 0
    let y = 0

    // Calculate base position based on side
    switch (side) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2
        y = triggerRect.top - 8
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2
        y = triggerRect.bottom + 8
        break
      case 'left':
        x = triggerRect.left - 8
        y = triggerRect.top + triggerRect.height / 2
        break
      case 'right':
        x = triggerRect.right + 8
        y = triggerRect.top + triggerRect.height / 2
        break
    }

    // Adjust based on alignment
    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          x = triggerRect.left
          break
        case 'end':
          x = triggerRect.right
          break
        case 'center':
        default:
          x = x - tooltipRect.width / 2
          break
      }
    } else {
      switch (align) {
        case 'start':
          y = triggerRect.top
          break
        case 'end':
          y = triggerRect.bottom
          break
        case 'center':
        default:
          y = y - tooltipRect.height / 2
          break
      }
    }

    // Keep tooltip within viewport
    const padding = 8
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding))
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding))

    return { x, y }
  }, [side, align])

  const showTooltip = () => {
    if (disabled) return
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delayDuration)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      const pos = calculatePosition()
      setPosition(pos)
    }
  }, [isVisible, calculatePosition])

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        const pos = calculatePosition()
        setPosition(pos)
      }
    }

    const handleResize = () => {
      if (isVisible) {
        hideTooltip()
      }
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible, calculatePosition])

  const tooltipElement = (
    <div
      id={tooltipId}
      ref={tooltipRef}
      role="tooltip"
      className={cn(
        'fixed z-50 px-3 py-2 text-sm text-popover-foreground bg-popover border rounded-md shadow-lg max-w-xs',
        'animate-in fade-in-0 zoom-in-95',
        side === 'top' && 'slide-in-from-bottom-2',
        side === 'bottom' && 'slide-in-from-top-2',
        side === 'left' && 'slide-in-from-right-2',
        side === 'right' && 'slide-in-from-left-2',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {content}
      {/* Arrow */}
      <div
        className={cn(
          'absolute w-2 h-2 bg-popover border rotate-45',
          side === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2 border-l-0 border-t-0',
          side === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2 border-r-0 border-b-0',
          side === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2 border-l-0 border-b-0',
          side === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-t-0'
        )}
      />
    </div>
  )

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-describedby={isVisible ? tooltipId : undefined}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && typeof window !== 'undefined' && createPortal(tooltipElement, document.body)}
    </>
  )
}

// Convenience wrapper for simple text tooltips
export function SimpleTooltip({
  children,
  text,
  ...props
}: Omit<TooltipProps, 'content'> & { text: string }) {
  return (
    <Tooltip content={<span>{text}</span>} {...props}>
      {children}
    </Tooltip>
  )
}