import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label?: string
  error?: string
  description?: string
  required?: boolean
  className?: string
}

interface InputFieldProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'number'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, description, required, className, ...props }, ref) => {
    const id = `field-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={id} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={id}
          className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          {...props}
        />
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'

interface TextareaFieldProps extends FormFieldProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  rows?: number
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, description, required, className, ...props }, ref) => {
    const id = `field-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={id} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}>
            {label}
          </Label>
        )}
        <Textarea
          ref={ref}
          id={id}
          className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          {...props}
        />
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'