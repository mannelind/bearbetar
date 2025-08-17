'use client'

import { useState } from 'react'
import { ContentModal } from '@/components/ui/content-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, Clock, CheckCircle } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  short_description?: string
  icon?: string
  featured_image?: string
  price_info?: string
  features?: string[]
  process_steps?: string[]
  estimated_timeline?: string
  contact_info?: string
}

interface ServiceModalProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const contactFormSchema = z.object({
  name: z.string().min(2, 'Namn måste vara minst 2 tecken'),
  email: z.string().email('Ogiltig e-postadress'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Meddelandet måste vara minst 10 tecken'),
  service_interest: z.string()
})

type ContactFormData = z.infer<typeof contactFormSchema>

export function ServiceModal({ service, open, onOpenChange }: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      service_interest: service?.title || ''
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulera API-anrop
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Kontaktformulär skickat:', data)
      setIsSubmitted(true)
      form.reset()
      
      // Stäng modal efter 3 sekunder
      setTimeout(() => {
        setIsSubmitted(false)
        onOpenChange(false)
      }, 3000)
      
    } catch (error) {
      console.error('Fel vid skickande av formulär:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simulerade features om de inte finns
  const features = service?.features || [
    'Professionell implementation',
    'Responsiv design',
    'SEO-optimering',
    'Teknisk support',
    'Regelbundna uppdateringar'
  ]

  // Simulerade processsteg om de inte finns
  const processSteps = service?.process_steps || [
    'Initial konsultation och behovsanalys',
    'Projektplanering och design',
    'Utveckling och implementation', 
    'Testning och kvalitetskontroll',
    'Lansering och support'
  ]

  // Create service-specific content and metadata
  const serviceContent = service ? `
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-semibold mb-4">Vad ingår</h3>
        <div class="space-y-2">
          ${features.map(feature => `
            <div class="flex items-start gap-2">
              <span class="text-primary">✓</span>
              <span class="text-sm">${feature}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4">Vår process</h3>
        <div class="space-y-3">
          ${processSteps.map((step, index) => `
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                ${index + 1}
              </div>
              <span class="text-sm">${step}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  ` : undefined

  const additionalMetadata = service ? (
    <div className="space-y-3">
      {/* Price Info */}
      {service.price_info && (
        <Badge variant="outline" className="text-lg px-4 py-2 w-full justify-center">
          {service.price_info}
        </Badge>
      )}
      
      {/* Timeline */}
      {service.estimated_timeline && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <Clock className="h-4 w-4 text-primary" />
          <div>
            <div className="font-medium text-sm">Estimerad tidsram</div>
            <div className="text-xs text-muted-foreground">{service.estimated_timeline}</div>
          </div>
        </div>
      )}
      
      {/* Contact Form */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">Intresserad?</h4>
          <p className="text-xs text-muted-foreground">
            Fyll i formuläret så kontaktar vi dig inom 24 timmar.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-4 space-y-2">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h4 className="text-sm font-semibold text-green-700">Tack för ditt intresse!</h4>
            <p className="text-xs text-muted-foreground">
              Vi kommer att kontakta dig inom 24 timmar.
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-xs">Namn *</Label>
              <Input
                id="name"
                placeholder="Ditt namn"
                className="text-xs"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-xs">E-post *</Label>
              <Input
                id="email"
                type="email"
                placeholder="din@email.se"
                className="text-xs"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-xs">Meddelande *</Label>
              <Textarea
                id="message"
                placeholder="Berätta lite om ditt projekt..."
                rows={3}
                className="text-xs"
                {...form.register('message')}
              />
              {form.formState.errors.message && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>

            {/* Service Interest (Hidden) */}
            <input
              type="hidden"
              value={service.title}
              {...form.register('service_interest')}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full text-xs" 
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner w-3 h-3 mr-2" />
                  Skickar...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-3 w-3" />
                  Skicka förfrågan
                </>
              )}
            </Button>
          </form>
        )}

        {/* Contact Info */}
        <div className="pt-3 border-t space-y-1">
          <p className="text-xs font-medium">Eller kontakta oss direkt:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>hej@bearbetar.se</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>070-123 45 67</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null

  // Transform service to ContentItem format
  const contentItem = service ? {
    id: service.id,
    title: service.title,
    excerpt: service.short_description || service.description,
    featured_image: service.featured_image || undefined,
    created_at: new Date().toISOString(), // Services don't have creation dates
    content: serviceContent
  } : null

  return (
    <ContentModal
      item={contentItem}
      open={open}
      onOpenChange={onOpenChange}
      loading={false}
      error={null}
      showReadingTime={false}
      showAuthor={false}
      showDates={false}
      showCategories={false}
      showTags={false}
      additionalMetadata={additionalMetadata}
    />
  )
}