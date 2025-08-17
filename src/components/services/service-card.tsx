'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceModal } from './service-modal'
import { ArrowRight, Eye } from 'lucide-react'

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

interface ServiceCardProps {
  service: Service
  IconComponent: React.ComponentType<{ className?: string }>
  className?: string
}

export function ServiceCard({ service, IconComponent, className = '' }: ServiceCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleCardClick = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Card 
        className={`relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group ${className}`}
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {service.title}
              </CardTitle>
              {service.short_description && (
                <CardDescription className="mt-1">
                  {service.short_description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              Läs mer
            </div>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>

      <ServiceModal 
        service={service}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </>
  )
}