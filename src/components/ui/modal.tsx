'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

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
  }, [isOpen])

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

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />
      
      {/* Content */}
      <div 
        className={cn(
          "relative bg-background border rounded-lg shadow-xl max-h-[90vh] overflow-auto w-full",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors"
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