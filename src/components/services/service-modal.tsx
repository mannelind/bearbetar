'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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

  if (!service) return null

  // Simulerade features om de inte finns
  const features = service.features || [
    'Professionell implementation',
    'Responsiv design',
    'SEO-optimering',
    'Teknisk support',
    'Regelbundna uppdateringar'
  ]

  // Simulerade processsteg om de inte finns
  const processSteps = service.process_steps || [
    'Initial konsultation och behovsanalys',
    'Projektplanering och design',
    'Utveckling och implementation', 
    'Testning och kvalitetskontroll',
    'Lansering och support'
  ]

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl" className="max-h-[95vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <ModalHeader className="flex-shrink-0">
            <div className="space-y-4">
              {/* Service Image */}
              {service.featured_image && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={service.featured_image} 
                    alt={service.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Title and Description */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">{service.title}</h2>
                    {service.short_description && (
                      <p className="text-lg text-muted-foreground mt-2">
                        {service.short_description}
                      </p>
                    )}
                  </div>
                  
                  {service.price_info && (
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {service.price_info}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>
          </ModalHeader>

          {/* Body with scrollable content */}
          <ModalBody className="flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Service Details */}
              <div className="space-y-6">
                {/* Features */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Vad ingår</h3>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Vår process</h3>
                  <div className="space-y-3">
                    {processSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                {service.estimated_timeline && (
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Estimerad tidsram</div>
                      <div className="text-sm text-muted-foreground">{service.estimated_timeline}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Contact Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Intresserad?</h3>
                  <p className="text-muted-foreground text-sm">
                    Fyll i formuläret så kontaktar vi dig inom 24 timmar för en kostnadsfri konsultation.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h4 className="text-xl font-semibold text-green-700">Tack för ditt intresse!</h4>
                    <p className="text-muted-foreground">
                      Vi har tagit emot din förfrågan och kommer att kontakta dig inom 24 timmar.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name">Namn *</Label>
                      <Input
                        id="name"
                        placeholder="Ditt fullständiga namn"
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
                      <Label htmlFor="email">E-post *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="din@email.se"
                        {...form.register('email')}
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="070-123 45 67"
                        {...form.register('phone')}
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <Label htmlFor="company">Företag</Label>
                      <Input
                        id="company"
                        placeholder="Ditt företag (valfritt)"
                        {...form.register('company')}
                      />
                    </div>

                    {/* Service Interest (Hidden) */}
                    <input
                      type="hidden"
                      value={service.title}
                      {...form.register('service_interest')}
                    />

                    {/* Message */}
                    <div>
                      <Label htmlFor="message">Meddelande *</Label>
                      <Textarea
                        id="message"
                        placeholder="Berätta lite om ditt projekt och vad du behöver hjälp med..."
                        rows={4}
                        {...form.register('message')}
                      />
                      {form.formState.errors.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="loading-spinner w-4 h-4 mr-2" />
                          Skickar...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Skicka förfrågan
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Contact Info */}
                <div className="pt-6 border-t space-y-2">
                  <p className="text-sm font-medium">Eller kontakta oss direkt:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>hej@bearbetar.se</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>070-123 45 67</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  )
}