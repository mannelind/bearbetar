'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: ReactNode
  animation?: 'slide-up' | 'slide-up-delayed' | 'slide-up-delayed-2' | 'slide-up-delayed-3' | 'slide-in-left' | 'slide-in-right' | 'scale-in' | 'scale-in-delayed' | 'fade-in'
  className?: string
}

export function AnimatedSection({ children, animation = 'slide-up', className }: AnimatedSectionProps) {
  const animationClass = {
    'slide-up': 'animate-slide-up',
    'slide-up-delayed': 'animate-slide-up-delayed',
    'slide-up-delayed-2': 'animate-slide-up-delayed-2',
    'slide-up-delayed-3': 'animate-slide-up-delayed-3',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
    'scale-in-delayed': 'animate-scale-in-delayed',
    'fade-in': 'animate-fade-in'
  }

  return (
    <div className={cn(animationClass[animation], className)}>
      {children}
    </div>
  )
}

interface AnimatedGridProps {
  children: ReactNode
  className?: string
  itemClassName?: string
}

export function AnimatedGrid({ children, className, itemClassName }: AnimatedGridProps) {
  return (
    <div className={cn('grid', className)}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <div key={index} className={cn(`animate-card-${Math.min(index + 1, 4)}`, itemClassName)}>
              {child}
            </div>
          ))
        : <div className={cn('animate-card-1', itemClassName)}>{children}</div>
      }
    </div>
  )
}

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn('flex flex-col animate-fade-in', className)}>
      {children}
    </div>
  )
}