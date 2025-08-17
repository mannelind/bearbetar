'use client'

import { ServiceCard } from './service-card'
import { AnimatedGrid } from '@/components/ui/page-animations'

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
  getIcon: (iconName: string) => React.ComponentType<{ className?: string }>
}

export function ServicesGrid({ services, getIcon }: ServicesGridProps) {
  return (
    <AnimatedGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
      {services.map((service: Service) => {
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
  )
}