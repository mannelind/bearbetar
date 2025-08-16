'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PortfolioCard } from './portfolio-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'
import { PortfolioModal } from '@/components/portfolio/portfolio-modal'
import { Database } from '@/types/database'
import { ArrowRight, Briefcase } from 'lucide-react'

type PortfolioProject = Database['public']['Tables']['portfolio_items']['Row'] & {
  portfolio_categories?: Database['public']['Tables']['portfolio_categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  technologies: string[]
  category: string
  gallery_count?: number
}

interface PortfolioCarouselProps {
  projects: PortfolioProject[]
  title: string
  description?: string
}

export function PortfolioCarousel({ projects, title, description }: PortfolioCarouselProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleProjectClick = (project: PortfolioProject) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  // Show placeholder when no projects
  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Inga projekt än</h3>
          <p className="text-muted-foreground mb-6">
            Vi håller på med våra första projekt. Håll utkik för resultat!
          </p>
          <Button asChild>
            <Link href="/portfolio">
              Se portfolion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="relative py-4 px-4">
        <div className="relative overflow-hidden">
          {/* Fade gradient masks - optimerat för centrerad layout */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
          
          <Carousel
            opts={{
              align: "center",
              loop: true,
              startIndex: Math.floor((projects.length - 1) / 2),
            }}
            className="w-full max-w-6xl mx-auto overflow-visible"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {projects.map((project) => (
                <CarouselItem key={project.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-1/3 flex">
                  <div className="p-2 flex flex-col w-full">
                    <PortfolioCard project={project} onClick={() => handleProjectClick(project)} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4 mt-4">
              <CarouselPrevious className="relative left-auto right-auto top-auto translate-y-0" />
              <CarouselDots className="pt-0" />
              <CarouselNext className="relative left-auto right-auto top-auto translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
      
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/portfolio">
            Se alla projekt
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <PortfolioModal 
        item={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}