'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Briefcase, BookOpen, FolderOpen, Users, LogIn, Wrench, Home, Info, Phone } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useMobileWidgetState } from '@/hooks/use-mobile-widget-state'

type Position = { x: number; y: number }
type Edge = 'left' | 'right' | 'bottom' | 'header-left' | 'header-center' | 'header-right'

const BUTTON_SIZE = 44 // Reduced from 54px to match accessibility widget

export function DraggableMobileMenuWidget() {
  const { activeWidget, setActiveWidget } = useMobileWidgetState()
  const isOpen = activeWidget === 'draggable-mobile-menu'
  const [position, setPosition] = useState<Position>({ x: 0, y: 150 })
  const [edge, setEdge] = useState<Edge>('left')
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [previewEdge, setPreviewEdge] = useState<Edge | null>(null)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const initialPositionRef = useRef<Position>({ x: 0, y: 0 })
  const { user, isAdmin } = useAuth()

  const menuItems = [
    { href: '/', label: 'Hem', icon: Home },
    { href: '/om-oss', label: 'Om oss', icon: Info },
    { href: '/tjanster', label: 'Våra Tjänster', icon: Briefcase },
    { href: '/portfolio', label: 'Portfolio', icon: FolderOpen },
    { href: '/blog', label: 'Blogg & Artiklar', icon: BookOpen },
    { href: '/verktyg', label: 'Verktyg', icon: Wrench },
    { href: '/kontakt', label: 'Kontakt', icon: Phone },
  ]

  // Initialize position on mount
  useEffect(() => {
    const setInitialPosition = () => {
      const viewportHeight = document.documentElement.clientHeight
      const viewportWidth = window.innerWidth
      
      
      // Check for saved position
      const savedPosition = localStorage.getItem('mobile-menu-position')
      const savedEdge = localStorage.getItem('mobile-menu-edge')
      
      if (savedPosition && savedEdge) {
        const parsed = JSON.parse(savedPosition)
        setPosition(parsed)
        setEdge(savedEdge as Edge)
        return
      }
      
      // Default: right edge, positioned on right side of screen
      const defaultY = Math.max(180, viewportHeight / 2 - 25 + 80) // Below accessibility widget
      const xPos = viewportWidth - BUTTON_SIZE
      
      // Use snapToEdge to ensure proper edge snapping and styling
      const snappedPosition = snapToEdge(xPos, defaultY)
      setPosition(snappedPosition)
    }

    if (typeof window !== 'undefined') {
      setInitialPosition()
    }
  }, [])

  // Collision detection with accessibility widget
  const checkCollisionWithAccessibilityWidget = (newPos: Position): Position => {
    const accessibilityPos = localStorage.getItem('accessibility-position')
    const accessibilityEdge = localStorage.getItem('accessibility-edge')
    
    if (!accessibilityPos || !accessibilityEdge) return newPos
    
    const parsedAccessibilityPos = JSON.parse(accessibilityPos)
    
    // Check if positions would overlap (within 60px of each other)
    const distance = Math.sqrt(
      Math.pow(newPos.x - parsedAccessibilityPos.x, 2) + 
      Math.pow(newPos.y - parsedAccessibilityPos.y, 2)
    )
    
    if (distance < 60) {
      // Move mobile menu below accessibility widget
      return { x: newPos.x, y: parsedAccessibilityPos.y + 60 }
    }
    
    return newPos
  }

  const determineEdge = (x: number, y: number): Edge => {
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight
    const buttonWidth = BUTTON_SIZE
    const buttonHeight = BUTTON_SIZE
    const isDesktopOrTablet = window.innerWidth >= 768
    
    // On desktop/tablet, only allow right and bottom edges
    if (isDesktopOrTablet) {
      const distanceToRight = viewportWidth - (x + buttonWidth)
      const distanceToBottom = viewportHeight - (y + buttonHeight)
      
      const minDistance = Math.min(distanceToRight, distanceToBottom)
      
      if (minDistance === distanceToRight) return 'right'
      return 'bottom'
    } else {
      // Mobile - check for header snap zones first, then fallback to left/right edges
      const headerHeight = 64
      
      // Check if near header area
      if (y < headerHeight + 30) {
        // Use different header positions than accessibility widget to avoid overlap
        const leftZone = viewportWidth * 0.45 + 8 // Match CSS: calc(45% + 8px)
        const centerZone = viewportWidth * 0.78 // Different from accessibility (62.5%)
        const rightZone = viewportWidth - 20 - 81 // Further left than accessibility
        
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
    const smallButtonSize = Math.round(BUTTON_SIZE * 0.7)
    const isDesktopOrTablet = window.innerWidth >= 768

    const currentEdge = determineEdge(x, y)
    setEdge(currentEdge)

    let newPos: Position

    switch (currentEdge) {
      case 'left':
        if (isDesktopOrTablet) {
          setEdge('right')
          newPos = { x: viewportWidth - buttonWidth, y: Math.max(20, Math.min(y, viewportHeight - buttonHeight - 20)) }
        } else {
          newPos = { x: 0, y: Math.max(20, Math.min(y, viewportHeight - buttonHeight - 20)) }
        }
        break
      case 'right':
        newPos = { x: viewportWidth - buttonWidth, y: Math.max(20, Math.min(y, viewportHeight - buttonHeight - 20)) }
        break
      case 'header-left':
        newPos = { 
          x: viewportWidth * 0.45 + 8 - smallButtonSize/2, 
          y: 24 - smallButtonSize/2
        }
        break
      case 'header-center':
        newPos = { 
          x: viewportWidth * 0.78 - smallButtonSize/2, 
          y: 24 - smallButtonSize/2 
        }
        break
      case 'header-right':
        newPos = { 
          x: viewportWidth - smallButtonSize - 74, 
          y: 24 - smallButtonSize/2 
        }
        break
      case 'bottom':
        if (!isDesktopOrTablet) {
          setEdge('right')
          newPos = { x: viewportWidth - buttonWidth, y: Math.max(20, Math.min(y, viewportHeight - buttonHeight - 20)) }
        } else {
          newPos = { x: Math.max(20, Math.min(x, viewportWidth - buttonWidth - 20)), y: viewportHeight - buttonHeight }
        }
        break
      default:
        newPos = { x, y }
    }

    // Check for collision with accessibility widget and adjust if needed
    return checkCollisionWithAccessibilityWidget(newPos)
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
    
    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      setHasDragged(true)
    }
    
    const newX = initialPositionRef.current.x + deltaX
    const newY = initialPositionRef.current.y + deltaY
    
    setPosition({ x: newX, y: newY })
    
    const nextEdge = determineEdge(newX, newY)
    setPreviewEdge(nextEdge)
    
    // Show header zones only when near header area on mobile
    const isDesktopOrTablet = window.innerWidth >= 768
    if (!isDesktopOrTablet && hasDragged) {
      const zones = document.querySelectorAll('.mobile-menu-header-snap-zone')
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
          const targetZone = document.querySelector(`[data-snap-position="${nextEdge}"].mobile-menu-header-snap-zone`)
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
    setPreviewEdge(null)
    
    // Hide and reset mobile menu header snap zones
    const isDesktopOrTablet = window.innerWidth >= 768
    if (!isDesktopOrTablet) {
      const zones = document.querySelectorAll('.mobile-menu-header-snap-zone')
      zones.forEach(zone => {
        zone.classList.remove('visible', 'highlight')
      })
    }
    
    if (hasDragged) {
      const snappedPosition = snapToEdge(position.x, position.y)
      setPosition(snappedPosition)
      
      localStorage.setItem('mobile-menu-position', JSON.stringify(snappedPosition))
      localStorage.setItem('mobile-menu-edge', edge)
    }
    
    setTimeout(() => setHasDragged(false), 100)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }
    }
    return undefined
  }, [isDragging, position]) // eslint-disable-line react-hooks/exhaustive-deps

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as Node
        const button = document.querySelector('[aria-label="Stäng meny"], [aria-label="Öppna meny"]')
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
      const closeButton = document.querySelector('[aria-label="Stäng mobilmeny"]') as HTMLButtonElement
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
    const panelWidth = 280
    const panelHeight = Math.min(500, viewportHeight * 0.8)
    
    const baseStyle = {
      width: `${panelWidth}px`,
      maxHeight: `${panelHeight}px`,
      zIndex: 49, // Lower than accessibility widget (50)
    }

    switch (edge) {
      case 'left':
        return {
          ...baseStyle,
          left: 0, // Start directly from left edge
          top: position.y,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          borderRadius: '0 1rem 1rem 0', // Round only right corners
        }
      case 'right':
        return {
          ...baseStyle,
          right: 0, // Start directly from right edge
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
          maxHeight: `${Math.min(viewportHeight * 0.9, 700)}px`,
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 59, // Lower than accessibility widget (60) but higher than header
          borderRadius: '0 0 1rem 1rem', // Round only bottom corners
        }
      case 'bottom':
        return {
          ...baseStyle,
          left: Math.max(20, Math.min(position.x, viewportWidth - panelWidth - 20)),
          bottom: 0, // Already starts from bottom edge
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          borderRadius: '1rem 1rem 0 0', // Round only top corners
        }
      default:
        return {
          ...baseStyle,
          right: 0, // Start directly from right edge (default case)
          top: position.y,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }
    }
  }

  const getButtonStyle = () => {
    const getButtonSize = () => {
      if (edge.startsWith('header-')) {
        const smallSize = Math.round(BUTTON_SIZE * 0.7)
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
      if (isDragging) {
        return '50%'
      }
      
      switch (edge) {
        case 'left':
          return '0 20px 20px 0'
        case 'right':
          return '20px 0 0 20px'
        case 'header-left':
        case 'header-center':
        case 'header-right':
          return '50%'
        case 'bottom':
          return '20px 20px 0 0'
        default:
          return '20px 0 0 20px'
      }
    }

    return {
      ...baseStyle,
      transform: getTransform(),
      borderRadius: getBorderRadius(),
      transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: isDragging ? 'grabbing' : 'grab',
      touchAction: 'none', // Prevent scrolling while dragging
    }
  }

  return (
    <div className="md:hidden">
      {/* Edge indicators */}
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
        </>
      )}

      {/* Button */}
      <button
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={(e) => {
          if (hasDragged) {
            e.preventDefault()
            return
          }
          setActiveWidget(isOpen ? null : 'draggable-mobile-menu')
        }}
        className={`fixed shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 z-50 flex items-center justify-center select-none touch-none ${          isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'        }`}
        style={{
          ...getButtonStyle(),
          backgroundColor: 'hsl(var(--widget-button-background))',
          color: 'hsl(var(--widget-button-foreground))',
        }}
        aria-label={isOpen ? "Stäng mobilmeny" : "Öppna mobilmeny - dra för att flytta knappen"}
        aria-describedby="mobile-menu-button-desc"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
      >
        <div className="flex items-center justify-center w-full h-full">
          {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </div>
        <div id="mobile-menu-button-desc" className="sr-only">
          Mobilmeny för att navigera mellan webbplatsens sidor
        </div>
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-labelledby="mobile-menu-widget-title"
        aria-describedby="mobile-menu-widget-description"
        className="fixed bg-background border border-border shadow-2xl transition-all duration-300 ease-in-out overflow-hidden"
        style={getPanelPosition()}
      >
        <div className={`${edge.startsWith('header-') ? 'h-auto max-h-full' : 'h-full'} flex flex-col overflow-hidden`}>
          {/* Header */}
          <div className="flex h-12 items-center justify-between p-4 border-b border-border">
            <h2 id="mobile-menu-widget-title" className="text-sm font-semibold">Meny</h2>
            <button
              onClick={() => setActiveWidget(null)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Stäng mobilmeny"
              type="button"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav 
            id="mobile-menu-widget-description"
            className={`flex-1 overflow-y-auto p-4 ${edge.startsWith('header-') ? 'min-h-0' : ''}`}
            role="main"
            aria-label="Huvudnavigation"
          >
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out relative text-foreground sidebar-btn-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => setActiveWidget(null)}
                    >
                      <Icon className="h-4 w-4 tech-icon" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <footer className="p-4 border-t border-border">
            {user ? (
              <div className="space-y-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-3 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out relative text-foreground sidebar-btn-hover"
                    onClick={() => setActiveWidget(null)}
                  >
                    <Users className="h-4 w-4 tech-icon" aria-hidden="true" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="flex items-center space-x-3 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out relative text-foreground sidebar-btn-hover"
                onClick={() => setActiveWidget(null)}
              >
                <LogIn className="h-4 w-4 tech-icon" aria-hidden="true" />
                <span>Logga in</span>
              </Link>
            )}
            
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Byt tema</span>
              <ThemeToggle />
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}