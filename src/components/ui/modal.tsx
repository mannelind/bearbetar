'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
}

export function Modal({ children, open, onOpenChange }: ModalProps) {
  const [isOpen, setIsOpen] = useState(open || false)

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }, [onOpenChange])

  const contextValue: ModalContextType = {
    isOpen,
    open: () => handleOpenChange(true),
    close: () => handleOpenChange(false),
  }

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleOpenChange])

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY
      const body = document.body
      const html = document.documentElement
      
      // Get scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      // Lock body scroll and prevent layout shift
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.paddingRight = `${scrollbarWidth}px`
      
      // Also lock html element
      html.style.overflow = 'hidden'
      
      return () => {
        // Restore body scroll
        body.style.overflow = ''
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.paddingRight = ''
        
        // Restore html
        html.style.overflow = ''
        
        // Restore scroll position
        window.scrollTo(0, scrollY)
      }
    }
    
    // Return empty cleanup function when modal is closed
    return () => {}
  }, [isOpen])

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}

export function ModalTrigger({ 
  children, 
  className,
  asChild = false 
}: { 
  children: React.ReactNode
  className?: string
  asChild?: boolean 
}) {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('ModalTrigger must be used within a Modal')
  }

  const { open } = context

  if (asChild) {
    return (
      <div onClick={open} className={className}>
        {children}
      </div>
    )
  }

  return (
    <button onClick={open} className={className}>
      {children}
    </button>
  )
}

// Focus trap hook for modals
function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Focus the modal container
    container.focus()

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      // Restore focus to the previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen])

  return containerRef
}

export function ModalContent({ 
  children, 
  className,
  size = 'lg',
  showCloseButton = true 
}: ModalContentProps) {
  const context = useContext(ModalContext)
  const [mounted, setMounted] = useState(false)
  
  if (!context) {
    throw new Error('ModalContent must be used within a Modal')
  }

  const { isOpen, close } = context
  const focusTrapRef = useFocusTrap(isOpen)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  }

  return createPortal(
    <>
      {/* Backdrop - separate layer covering entire viewport */}
      <div 
        className="fixed inset-0 z-[80] bg-muted/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 pointer-events-none">
        {/* Content */}
        <div 
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          className={cn(
            "relative bg-background border rounded-lg shadow-xl max-h-[90vh] overflow-hidden w-full focus:outline-none pointer-events-auto",
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
        {showCloseButton && (
          <button
            onClick={close}
            aria-label="Stäng modal"
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Stäng</span>
          </button>
        )}
        {children}
        </div>
      </div>
    </>,
    document.body
  )
}

export function ModalHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-6 pb-4 border-b", className)}>
      {children}
    </div>
  )
}

export function ModalBody({ children, className, ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

export function ModalFooter({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-6 pt-4 border-t", className)}>
      {children}
    </div>
  )
}