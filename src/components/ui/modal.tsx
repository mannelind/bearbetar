'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
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
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
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
  if (!context) {
    throw new Error('ModalContent must be used within a Modal')
  }

  const { isOpen, close } = context
  const focusTrapRef = useFocusTrap(isOpen)

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div 
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          "relative bg-background border rounded-lg shadow-xl max-h-[90vh] overflow-auto w-full focus:outline-none",
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
  )
}

export function ModalHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-6 pb-4 border-b", className)}>
      {children}
    </div>
  )
}

export function ModalBody({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-6", className)}>
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