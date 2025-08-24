'use client'

import { ServiceCard } from './service-card'
import { PaymentInfoCard } from './payment-info-card'
import { AnimatedGrid } from '@/components/ui/page-animations'
import { Globe, Smartphone, Code, Coffee, Target, CreditCard, LayoutTemplate, AppWindow, Waypoints } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  short_description?: string | null
  icon?: string | null
  featured_image?: string | null
  price_info?: string | null
  features?: string[]
  process_steps?: string[]
  estimated_timeline?: string
  contact_info?: string
}

interface ServicesGridProps {
  services: Service[]
}

const icons = {
  Globe,
  Smartphone,
  Code,
  Coffee,
  Target,
  CreditCard,
  LayoutTemplate,
  AppWindow,
  Waypoints,
  'layout-template': LayoutTemplate,
  'app-window': AppWindow,
  'waypoints': Waypoints
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const getIcon = (iconName: string) => {
    return icons[iconName as keyof typeof icons] || Target
  }

  // Separate payment info from regular services
  const regularServices = services.filter(service => service.id !== '5')
  const paymentInfo = services.find(service => service.id === '5')

  return (
    <div className="space-y-8">
      <AnimatedGrid className="services-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:h-100 justify-between">
        {regularServices.map((service: Service) => {
          const IconComponent = getIcon(service.icon || 'Target')
          return (
            <ServiceCard 
              key={service.id} 
              service={service} 
              IconComponent={IconComponent}
            />
          )
        })}
      </AnimatedGrid>
      
      {/* Payment info card - displayed separately */}
      {paymentInfo && <PaymentInfoCard />}
    </div>
  )
}