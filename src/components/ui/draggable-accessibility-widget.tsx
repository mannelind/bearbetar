'use client'

import { useState, useEffect, useRef } from 'react'
import { Eye, Type, Palette, Highlighter, RotateCcw, X } from 'lucide-react'
import { useMobileWidgetState } from '@/hooks/use-mobile-widget-state'

type ColorBlindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome'
type Position = { x: number; y: number }
type Edge = 'left' | 'right' | 'bottom' | 'top' | 'header-left' | 'header-center' | 'header-right'

interface AccessibilitySettings {
  highContrast: boolean
  textSize: 'normal' | 'large' | 'extra-large'
  colorBlindMode: ColorBlindMode
  lineHighlight: boolean
}

const BUTTON_SIZE = 44 // Reduced from 54px

export function DraggableAccessibilityWidget() {
  const { activeWidget, setActiveWidget } = useMobileWidgetState()
  const isOpen = activeWidget === 'accessibility'
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 100 })
  const [edge, setEdge] = useState<Edge>('right')
  const [previewEdge, setPreviewEdge] = useState<Edge | null>(null)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    textSize: 'normal',
    colorBlindMode: 'normal',
    lineHighlight: false
  })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const initialPositionRef = useRef<Position>({ x: 0, y: 0 })

  // Load saved position and settings
  useEffect(() => {
    const setInitialPosition = () => {
      const viewportHeight = document.documentElement.clientHeight
      const viewportWidth = document.documentElement.clientWidth
      const isDesktopOrTablet = viewportWidth >= 768
      
      // Check for saved position
      const savedPosition = localStorage.getItem('accessibility-position')
      const savedEdge = localStorage.getItem('accessibility-edge')
      
      if (savedPosition && savedEdge) {
        const parsed = JSON.parse(savedPosition)
        // Use snapToEdge to ensure correct edge detection for saved position
        const snappedPosition = snapToEdge(parsed.x, parsed.y)
        setPosition(snappedPosition)
        return
      }
      
      if (isDesktopOrTablet) {
        // Tablet/Desktop - bottom edge, positioned at bottom right
        const bottomY = viewportHeight - BUTTON_SIZE // Exactly at bottom edge
        const rightX = viewportWidth - BUTTON_SIZE - 20 // 20px from right edge
        setEdge('bottom')
        setPosition({ x: rightX, y: bottomY })
      } else {
        // Mobile - right edge, centered vertically but avoid bottom nav
        const bottomNavHeight = 80 // Bottom nav + padding
        const maxY = viewportHeight - BUTTON_SIZE - bottomNavHeight
        const centerY = viewportHeight / 2 - 25
        const defaultY = Math.min(Math.max(100, centerY), maxY)
        setEdge('right')
        setPosition({ x: viewportWidth - BUTTON_SIZE, y: defaultY })
      }
      
      const savedSettings = localStorage.getItem('accessibility-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
        applySettings(parsed)
      }
    }

    if (typeof window !== 'undefined') {
      setInitialPosition()
    }
  }, [])

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement
    
    // Högkontrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Textstorlek
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-extra-large')
    root.classList.add(`text-size-${newSettings.textSize}`)
    
    // Färgblindhetsfilter
    root.setAttribute('data-color-blind-mode', newSettings.colorBlindMode)
    
    // Line highlighting
    if (newSettings.lineHighlight) {
      root.classList.add('line-highlight')
    } else {
      root.classList.remove('line-highlight')
    }
    
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings))
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    applySettings(newSettings)
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      textSize: 'normal',
      colorBlindMode: 'normal',
      lineHighlight: false
    }
    setSettings(defaultSettings)
    applySettings(defaultSettings)
  }

  const determineEdge = (x: number, y: number): Edge => {
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight
    const buttonWidth = BUTTON_SIZE
    const buttonHeight = BUTTON_SIZE
    
    // Check if we're on desktop/tablet (sidebar exists)
    const isDesktopOrTablet = window.innerWidth >= 768 // md breakpoint
    
    console.log('Determining edge:', { x, y, viewportWidth, viewportHeight, isDesktopOrTablet })
    
    // On desktop/tablet, allow top, right and bottom edges (not left due to sidebar)
    if (isDesktopOrTablet) {
      const distanceToTop = y
      const distanceToRight = viewportWidth - (x + buttonWidth)
      const distanceToBottom = viewportHeight - (y + buttonHeight)
      
      const minDistance = Math.min(distanceToTop, distanceToRight, distanceToBottom)
      
      if (minDistance === distanceToTop) return 'top'
      if (minDistance === distanceToRight) return 'right'
      return 'bottom'
    } else {
      // Mobile - check for header snap zones first, then fallback to left/right edges
      const headerHeight = 64 // Approximate header height
      
      // Check if near header area
      if (y < headerHeight + 30) {
        // Determine which header zone is closest - match CSS positioning exactly
        const leftZone = viewportWidth * 0.32 + 8 // Match CSS: calc(32% + 8px)
        const centerZone = viewportWidth * 0.625 // Match CSS: 62.5%
        const rightZone = viewportWidth - 20 - 27 // Match CSS: right: 20px, center of 54px circle
        
        const distanceToLeft = Math.abs(x + buttonWidth/2 - leftZone)
        const distanceToCenter = Math.abs(x + buttonWidth/2 - centerZone)
        const distanceToRight = Math.abs(x + buttonWidth/2 - rightZone)
        
        const minDistance = Math.min(distanceToLeft, distanceToCenter, distanceToRight)
        
        // Only snap to header zone if close enough (within 80px)
        const snapThreshold = 80
        
        if (minDistance < snapThreshold) {
          if (minDistance === distanceToLeft) return 'header-left'
          if (minDistance === distanceToCenter) return 'header-center'
          return 'header-right'
        }
        
        // If not close enough to any header zone, fall through to regular edge logic
      }
      
      // Default to left/right edges for mobile
      const distanceToLeft = x
      const distanceToRight = viewportWidth - (x + buttonWidth)
      
      const minDistance = Math.min(distanceToLeft, distanceToRight)
      
      if (minDistance === distanceToLeft) return 'left'
      return 'right'
    }
  }

  const snapToEdge = (x: number, y: number): Position => {
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight
    const buttonWidth = BUTTON_SIZE
    const buttonHeight = BUTTON_SIZE
    const smallButtonSize = Math.round(BUTTON_SIZE * 0.7) // 38px for header positions
    const isDesktopOrTablet = window.innerWidth >= 768

    const currentEdge = determineEdge(x, y)
    setEdge(currentEdge)

    switch (currentEdge) {
      case 'left':
        // Only allow left edge on mobile
        if (isDesktopOrTablet) {
          // Fallback to right edge on desktop/tablet
          setEdge('right') // Update edge to right when fallback happens
          return { x: viewportWidth - buttonWidth, y: Math.max(20, Math.min(y, viewportHeight - buttonHeight - 20)) }
        }
        return { x: 0, y: Math.max(20, Math.min(y, viewportHeight - buttonHeight - 20)) }
      case 'right':
        // On mobile, avoid bottom nav collision
        const maxYForRight = isDesktopOrTablet 
          ? viewportHeight - buttonHeight - 20 
          : viewportHeight - buttonHeight - 80 // Extra space for bottom nav on mobile
        return { x: viewportWidth - buttonWidth, y: Math.max(20, Math.min(y, maxYForRight)) }
      case 'header-left':
        // Match CSS: calc(32% + 8px) - center the button on that point
        const leftZoneCenter = viewportWidth * 0.32 + 8
        return { 
          x: leftZoneCenter - smallButtonSize/2, 
          y: 24 - smallButtonSize/2 // Center in header
        }
      case 'header-center':
        // Match CSS: left: 62.5% with translateX(-50%) - so center is at 62.5%
        return { 
          x: viewportWidth * 0.625 - smallButtonSize/2, 
          y: 24 - smallButtonSize/2 
        }
      case 'header-right':
        // Match CSS: right: 20px - convert to left position and center button
        const rightZoneCenter = viewportWidth - 20 - 27 // 27px is half of original 54px circle
        return { 
          x: rightZoneCenter - smallButtonSize/2, 
          y: 24 - smallButtonSize/2 
        }
      case 'top':
        return { x: Math.max(20, Math.min(x, viewportWidth - buttonWidth - 20)), y: 0 }
      case 'bottom':
        // On mobile, fallback to right edge if somehow we get bottom
        if (!isDesktopOrTablet) {
          setEdge('right')
          return { x: viewportWidth - buttonWidth, y: Math.max(20, Math.min(y, viewportHeight - buttonHeight - 20)) }
        }
        return { x: Math.max(20, Math.min(x, viewportWidth - buttonWidth - 20)), y: viewportHeight - buttonHeight }
      default:
        return { x, y }
    }
  }

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isOpen) return
    e.preventDefault()
    setIsDragging(true)
    setHasDragged(false)
    
    const pos = getEventPosition(e.nativeEvent as MouseEvent | TouchEvent)
    dragStartRef.current = pos
    initialPositionRef.current = position
  }

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    
    const pos = getEventPosition(e)
    const deltaX = pos.x - dragStartRef.current.x
    const deltaY = pos.y - dragStartRef.current.y
    
    // Mark as dragged if moved more than 8px (slightly higher threshold for touch)
    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      setHasDragged(true)
    }
    
    const newX = initialPositionRef.current.x + deltaX
    const newY = initialPositionRef.current.y + deltaY
    
    setPosition({ x: newX, y: newY })
    
    // Show preview of which edge we'll snap to
    const nextEdge = determineEdge(newX, newY)
    setPreviewEdge(nextEdge)
    
    // Show header zones only when near header area on mobile
    const isDesktopOrTablet = window.innerWidth >= 768
    if (!isDesktopOrTablet && hasDragged) {
      const zones = document.querySelectorAll('.accessibility-header-snap-zone')
      const headerHeight = 64
      const isNearHeader = newY < headerHeight + 30
      
      if (isNearHeader) {
        // Show all zones as visible when dragging near header
        zones.forEach(zone => {
          zone.classList.add('visible')
          zone.classList.remove('highlight')
        })
        
        // Highlight only the zone we'll actually snap to
        if (nextEdge.startsWith('header-')) {
          const targetZone = document.querySelector(`[data-snap-position="${nextEdge}"]`)
          if (targetZone) {
            targetZone.classList.add('highlight')
          }
        }
      } else {
        // Hide all zones when not near header
        zones.forEach(zone => {
          zone.classList.remove('visible', 'highlight')
        })
      }
    }
  }

  const handleEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    setPreviewEdge(null) // Clear preview
    
    // Hide and reset header snap zones on mobile
    const isDesktopOrTablet = window.innerWidth >= 768
    if (!isDesktopOrTablet) {
      const zones = document.querySelectorAll('.accessibility-header-snap-zone')
      zones.forEach(zone => {
        zone.classList.remove('visible', 'highlight')
      })
    }
    
    if (hasDragged) {
      // It was a drag - snap to edge
      const snappedPosition = snapToEdge(position.x, position.y)
      setPosition(snappedPosition)
      
      localStorage.setItem('accessibility-position', JSON.stringify(snappedPosition))
      localStorage.setItem('accessibility-edge', edge)
    }
    
    // Reset drag state
    setTimeout(() => setHasDragged(false), 100)
  }

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      
      // Touch events
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      
      return () => {
        // Mouse events
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        
        // Touch events
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }
    }
    // Return undefined if not dragging
    return undefined
  }, [isDragging, position]) // eslint-disable-line react-hooks/exhaustive-deps

  // Click outside to close widget
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as Node
        const button = document.querySelector('[aria-label="Tillgänglighetsverktyg - dra för att flytta"]')
        const panel = button?.nextElementSibling
        
        if (button && panel && !button.contains(target) && !panel.contains(target)) {
          setActiveWidget(null)
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
    return undefined
  }, [isOpen, edge, setActiveWidget])

  // Focus management for dialog
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when dialog opens
      const closeButton = document.querySelector('[aria-label="Stäng tillgänglighetsverktyg"]') as HTMLButtonElement
      if (closeButton) {
        closeButton.focus()
      }
    }
  }, [isOpen])

  // Keyboard navigation - close with Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setActiveWidget(null)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    return undefined
  }, [isOpen, setActiveWidget])

  const getPanelPosition = (): React.CSSProperties => {
    if (typeof document === 'undefined') return { display: 'none' }
    
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight
    const panelWidth = 320
    const panelHeight = Math.min(viewportHeight * 0.8, 600)
    
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      width: `${panelWidth}px`,
      maxHeight: `${Math.min(viewportHeight * 0.8, 600)}px`
    }
    
    switch (edge) {
      case 'left':
        return {
          ...baseStyle,
          left: 0,
          top: Math.max(20, Math.min(position.y, viewportHeight - panelHeight - 20)),
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          borderRadius: '0 1rem 1rem 0', // Round only right corners
        }
      case 'right':
        return {
          ...baseStyle,
          right: 0,
          top: Math.max(20, Math.min(position.y, viewportHeight - panelHeight - 20)),
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          borderRadius: '1rem 0 0 1rem', // Round only left corners
        }
      case 'header-left':
      case 'header-center':
      case 'header-right':
        return {
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          maxHeight: `${Math.min(viewportHeight * 0.8, 600)}px`,
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 60, // Higher than header
          borderRadius: '0 0 1rem 1rem', // Round only bottom corners
        }
      case 'top':
        return {
          ...baseStyle,
          left: Math.max(20, Math.min(position.x, viewportWidth - panelWidth - 20)),
          top: 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          borderRadius: '0 0 1rem 1rem', // Round only bottom corners
        }
      case 'bottom':
        return {
          ...baseStyle,
          left: Math.max(20, Math.min(position.x, viewportWidth - panelWidth - 20)),
          bottom: 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          borderRadius: '1rem 1rem 0 0', // Round only top corners
        }
      default:
        return {
          ...baseStyle,
          right: 0,
          top: position.y,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }
    }
  }

  const getButtonStyle = () => {
    // Adjust size for header positions to match unfocused indicator circles (scale 0.7)
    const getButtonSize = () => {
      if (edge.startsWith('header-')) {
        const smallSize = Math.round(BUTTON_SIZE * 0.7) // Match the scale 0.7 of unfocused circles
        return { width: `${smallSize}px`, height: `${smallSize}px` }
      }
      return { width: `${BUTTON_SIZE}px`, height: `${BUTTON_SIZE}px` }
    }

    const buttonSize = getButtonSize()
    const baseStyle = {
      left: position.x,
      top: position.y,
      ...buttonSize,
    }

    const getTransform = () => {
      if (!isOpen) return 'translate(0, 0)'
      
      switch (edge) {
        case 'left':
          return 'translateX(-100%)'
        case 'right':
          return 'translateX(100%)'
        case 'header-left':
        case 'header-center':
        case 'header-right':
          return 'translateY(-100%)'
        case 'bottom':
          return 'translateY(100%)'
        default:
          return 'translateX(100%)'
      }
    }

    const getBorderRadius = () => {
      // When dragging, make it completely round
      if (isDragging) {
        return '50%'
      }
      
      // When snapped to edge, use edge-specific radius
      switch (edge) {
        case 'left':
          return '0 20px 20px 0'
        case 'right':
          return '20px 0 0 20px'
        case 'header-left':
        case 'header-center':
        case 'header-right':
          return '50%' // Completely round for header positions
        case 'top':
          return '0 0 20px 20px'
        case 'bottom':
          return '20px 20px 0 0'
        default:
          return '20px 0 0 20px'
      }
    }

    return { 
      ...baseStyle, 
      borderRadius: getBorderRadius(),
      transform: getTransform(),
      opacity: isOpen ? (edge.startsWith('header-') ? 0.3 : 0) : 1,
      transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }

  return (
    <>
      {/* Edge Preview Indicators */}
      {previewEdge && (
        <>
          {/* Left edge indicator */}
          <div
            className={`fixed left-0 top-1/2 -translate-y-1/2 w-2 h-1/2 transition-all duration-200 pointer-events-none z-40 rounded-r-lg ${
              previewEdge === 'left' 
                ? 'opacity-100 shadow-lg' 
                : 'opacity-0'
            }`}
            style={{
              background: previewEdge === 'left' 
                ? 'linear-gradient(90deg, hsl(var(--widget-indicator-color)) 0%, hsl(var(--widget-indicator-color) / 0.3) 100%)'
                : 'hsl(var(--widget-indicator-color) / 0.2)',
              boxShadow: previewEdge === 'left' ? '0 4px 14px hsl(var(--widget-indicator-glow) / 0.5)' : undefined,
              animation: previewEdge === 'left' ? 'pulse 1s ease-in-out infinite' : undefined
            }}
          />
          
          {/* Right edge indicator */}
          <div
            className={`fixed right-0 top-1/2 -translate-y-1/2 w-2 h-1/2 transition-all duration-200 pointer-events-none z-40 rounded-l-lg ${
              previewEdge === 'right' 
                ? 'opacity-100 shadow-lg' 
                : 'opacity-0'
            }`}
            style={{
              background: previewEdge === 'right' 
                ? 'linear-gradient(-90deg, hsl(var(--widget-indicator-color)) 0%, hsl(var(--widget-indicator-color) / 0.3) 100%)'
                : 'hsl(var(--widget-indicator-color) / 0.2)',
              boxShadow: previewEdge === 'right' ? '0 4px 14px hsl(var(--widget-indicator-glow) / 0.5)' : undefined,
              animation: previewEdge === 'right' ? 'pulse 1s ease-in-out infinite' : undefined
            }}
          />
          
          {/* Top edge indicator */}
          <div
            className={`fixed top-0 left-1/2 -translate-x-1/2 w-1/2 h-2 transition-all duration-200 pointer-events-none z-40 rounded-b-lg ${
              previewEdge === 'top' 
                ? 'opacity-100 shadow-lg' 
                : 'opacity-0'
            }`}
            style={{
              background: previewEdge === 'top' 
                ? 'linear-gradient(0deg, hsl(var(--widget-indicator-color)) 0%, hsl(var(--widget-indicator-color) / 0.3) 100%)'
                : 'hsl(var(--widget-indicator-color) / 0.2)',
              boxShadow: previewEdge === 'top' ? '0 4px 14px hsl(var(--widget-indicator-glow) / 0.5)' : undefined,
              animation: previewEdge === 'top' ? 'pulse 1s ease-in-out infinite' : undefined
            }}
          />
          
          {/* Bottom edge indicator */}
          <div
            className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-2 transition-all duration-200 pointer-events-none z-40 rounded-t-lg ${
              previewEdge === 'bottom' 
                ? 'opacity-100 shadow-lg' 
                : 'opacity-0'
            }`}
            style={{
              background: previewEdge === 'bottom' 
                ? 'linear-gradient(-180deg, hsl(var(--widget-indicator-color)) 0%, hsl(var(--widget-indicator-color) / 0.3) 100%)'
                : 'hsl(var(--widget-indicator-color) / 0.2)',
              boxShadow: previewEdge === 'bottom' ? '0 4px 14px hsl(var(--widget-indicator-glow) / 0.5)' : undefined,
              animation: previewEdge === 'bottom' ? 'pulse 1s ease-in-out infinite' : undefined
            }}
          />
        </>
      )}

      {/* Draggable Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={(e) => {
          if (hasDragged) {
            e.preventDefault()
            return
          }
          setActiveWidget(isOpen ? null : 'accessibility')
        }}
        className={`fixed z-50 bg-accessibility-button-background text-accessibility-button-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 select-none touch-none flex items-center justify-center ${
          isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'
        }`}
        style={{
          ...getButtonStyle(),
          pointerEvents: isOpen ? 'none' : 'auto',
          touchAction: 'none', // Prevent scrolling while dragging
        }}
        aria-label="Öppna tillgänglighetsverktyg - dra för att flytta knappen"
        aria-describedby="accessibility-button-desc"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
      >
        <Eye className="w-6 h-6" aria-hidden="true" />
        <div id="accessibility-button-desc" className="sr-only">
          Tillgänglighetsverktyg för att anpassa webbplatsens utseende och funktioner
        </div>
      </button>

      {/* Widget Panel */}
      <div
        role="dialog"
        aria-labelledby="accessibility-widget-title"
        aria-describedby="accessibility-widget-description"
        className="z-50 bg-background border border-border shadow-2xl transition-all duration-300 ease-in-out"
        style={getPanelPosition()}
      >  
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex h-12 items-center justify-between p-4 border-b border-border ">
            <h2 id="accessibility-widget-title" className="text-sm font-semibold">Tillgänglighet</h2>
            <button
              onClick={() => setActiveWidget(null)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Stäng tillgänglighetsverktyg"
              type="button"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div 
            id="accessibility-widget-description" 
            className="flex-1 overflow-y-auto p-4 space-y-6"
            role="main"
            aria-label="Tillgänglighetsinställningar"
          >
            {/* High Contrast */}
            <fieldset className="space-y-2" role="group" aria-labelledby="high-contrast-label">
              <legend id="high-contrast-label" className="flex items-center gap-2 font-medium">
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>Högkontrast</span>
              </legend>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`w-full py-2 px-4 rounded-full border transition-all duration-200 ease-out ${
                  settings.highContrast
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                }`}
                type="button"
                role="switch"
                aria-checked={settings.highContrast}
                aria-describedby="high-contrast-desc"
              >
                <span className="sr-only">Högkontrast är </span>
                {settings.highContrast ? 'På' : 'Av'}
              </button>
              <div id="high-contrast-desc" className="sr-only">
                Aktiverar högkontrast för bättre synlighet av text och element
              </div>
            </fieldset>

            {/* Text Size */}
            <fieldset className="space-y-2" role="group" aria-labelledby="text-size-label">
              <legend id="text-size-label" className="flex items-center gap-2 font-medium">
                <Type className="w-4 h-4" aria-hidden="true" />
                <span>Textstorlek</span>
              </legend>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="text-size-label">
                {['normal', 'large', 'extra-large'].map((size) => {
                  const sizeLabels = {
                    normal: 'Normal',
                    large: 'Stor', 
                    'extra-large': 'Extra stor'
                  }
                  return (
                    <button
                      key={size}
                      onClick={() => updateSetting('textSize', size as any)}
                      className={`py-2 px-3 rounded-full border text-sm transition-all duration-200 ease-out ${
                        settings.textSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                      }`}
                      type="button"
                      role="radio"
                      aria-checked={settings.textSize === size}
                      aria-label={`Textstorlek: ${sizeLabels[size as keyof typeof sizeLabels]}`}
                    >
                      {sizeLabels[size as keyof typeof sizeLabels]}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Color Blind Mode */}
            <fieldset className="space-y-2" role="group" aria-labelledby="colorblind-label">
              <legend id="colorblind-label" className="flex items-center gap-2 font-medium">
                <Palette className="w-4 h-4" aria-hidden="true" />
                <span>Färgblindhetsanpassning</span>
              </legend>
              <label htmlFor="colorblind-select" className="sr-only">
                Välj färgblindhetsanpassning
              </label>
              <select
                id="colorblind-select"
                value={settings.colorBlindMode}
                onChange={(e) => updateSetting('colorBlindMode', e.target.value as ColorBlindMode)}
                className="w-full py-2 px-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ease-out hover:border-primary/20"
                aria-describedby="colorblind-desc"
              >
                <option value="normal">Normal</option>
                <option value="protanopia">Protanopi (röd-grön färgblindhet, typ 1)</option>
                <option value="deuteranopia">Deuteranopi (röd-grön färgblindhet, typ 2)</option>
                <option value="tritanopia">Tritanopi (blå-gul färgblindhet)</option>
                <option value="monochrome">Svartvit (monokrom syn)</option>
              </select>
              <div id="colorblind-desc" className="sr-only">
                Anpassar färgpaletten för olika typer av färgblindhet
              </div>
            </fieldset>

            {/* Line Highlighting */}
            <fieldset className="space-y-2" role="group" aria-labelledby="line-highlight-label">
              <legend id="line-highlight-label" className="flex items-center gap-2 font-medium">
                <Highlighter className="w-4 h-4" aria-hidden="true" />
                <span>Radmarkering</span>
              </legend>
              <button
                onClick={() => updateSetting('lineHighlight', !settings.lineHighlight)}
                className={`w-full py-2 px-4 rounded-full border transition-all duration-200 ease-out ${
                  settings.lineHighlight
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                }`}
                type="button"
                role="switch"
                aria-checked={settings.lineHighlight}
                aria-describedby="line-highlight-desc"
              >
                <span className="sr-only">Radmarkering är </span>
                {settings.lineHighlight ? 'På' : 'Av'}
              </button>
              <div id="line-highlight-desc" className="sr-only">
                Markerar textrader när du för muspekaren över dem för bättre läsbarhet
              </div>
            </fieldset>
          </div>

          {/* Footer */}
          <footer className="p-4 border-t border-border">
            <button
              onClick={resetSettings}
              className="w-full py-2 px-4 rounded-full border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ease-out flex items-center justify-center gap-2 text-sm font-medium"
              type="button"
              aria-describedby="reset-desc"
            >
              <RotateCcw className="h-4 w-4 tech-icon" aria-hidden="true" />
              <span>Återställ alla inställningar</span>
            </button>
            <div id="reset-desc" className="sr-only">
              Återställer alla tillgänglighetsinställningar till standardvärden
            </div>
          </footer>
        </div>
      </div>

      {/* Overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setActiveWidget(null)}
        />
      )}
    </>
  )
}