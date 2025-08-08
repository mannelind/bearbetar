import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'default', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )} 
    />
  )
}

interface LoadingProps {
  text?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function Loading({ text = 'Laddar...', size = 'default', className }: LoadingProps) {
  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <LoadingSpinner size={size} />
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading text="Laddar sida..." size="lg" />
    </div>
  )
}

export function ButtonLoading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" />
      <span>{children}</span>
    </div>
  )
}