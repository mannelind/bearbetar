'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Send, CheckCircle } from 'lucide-react'

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Namn måste vara minst 2 tecken')
    .max(100, 'Namn kan inte vara längre än 100 tecken'),
  email: z.string()
    .email('Ange en giltig e-postadress')
    .min(1, 'E-postadress krävs'),
  company: z.string()
    .max(100, 'Företagsnamn kan inte vara längre än 100 tecken')
    .optional(),
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Ange ett giltigt telefonnummer')
    .optional()
    .or(z.literal('')),
  subject: z.string()
    .min(5, 'Ämne måste vara minst 5 tecken')
    .max(200, 'Ämne kan inte vara längre än 200 tecken'),
  message: z.string()
    .min(10, 'Meddelandet måste vara minst 10 tecken')
    .max(2000, 'Meddelandet kan inte vara längre än 2000 tecken'),
  projectType: z.enum(['webbsida', 'app', 'utveckling', 'radgivning', 'annat'], {
    required_error: 'Välj typ av projekt'
  }),
  budget: z.enum(['under-25k', '25k-50k', '50k-100k', '100k-plus', 'vet-inte'], {
    required_error: 'Välj ungefärlig budget'
  }).optional(),
  timeline: z.enum(['akut', '1-manaden', '2-3-manader', 'langre', 'flexibel'], {
    required_error: 'Välj ungefärlig tidsram'
  }).optional()
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      projectType: 'annat',
      budget: 'vet-inte',
      timeline: 'flexibel'
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Något gick fel när meddelandet skickades')
      }

      setIsSuccess(true)
      form.reset()
      toast.success('Tack för ditt meddelande!', {
        description: 'Vi hör av oss så snart vi kan.'
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Något gick fel', {
        description: 'Prova att skicka igen eller maila oss direkt på hej@bearbetar.se'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Tack för ditt meddelande!</h3>
          <p className="text-sm text-muted-foreground">
            Vi hör av oss inom 24 timmar. Ofta tidigare.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)}
          className="mt-4"
        >
          Skicka nytt meddelande
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Namn *</FormLabel>
                <FormControl>
                  <Input placeholder="Ditt namn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="din@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Företag</FormLabel>
                <FormControl>
                  <Input placeholder="Ditt företag (valfritt)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="+46 70 123 45 67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Project Details */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ämne *</FormLabel>
              <FormControl>
                <Input placeholder="Vad handlar projektet om?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ av projekt *</FormLabel>
              <FormControl>
                <select 
                  {...field} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="webbsida">Webbsida</option>
                  <option value="app">Mobilapp eller webapp</option>
                  <option value="utveckling">Skräddarsydd utveckling</option>
                  <option value="radgivning">Rådgivning/konsultation</option>
                  <option value="annat">Annat</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ungefärlig budget</FormLabel>
                <FormControl>
                  <select 
                    {...field} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="under-25k">Under 25 000 kr</option>
                    <option value="25k-50k">25 000 - 50 000 kr</option>
                    <option value="50k-100k">50 000 - 100 000 kr</option>
                    <option value="100k-plus">100 000+ kr</option>
                    <option value="vet-inte">Vet inte / Vill diskutera</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tidsram</FormLabel>
                <FormControl>
                  <select 
                    {...field} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="akut">ASAP / Akut</option>
                    <option value="1-manaden">Inom en månad</option>
                    <option value="2-3-manader">2-3 månader</option>
                    <option value="langre">Längre tid</option>
                    <option value="flexibel">Flexibel</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meddelande *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Berätta mer om ditt projekt, vad du vill ha hjälp med, eller andra tankar..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Skickar...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Skicka meddelande
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Vi svarar vanligtvis inom 24 timmar. Första konsultationen är alltid gratis!
        </p>
      </form>
    </Form>
  )
}