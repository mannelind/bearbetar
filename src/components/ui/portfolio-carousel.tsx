'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TagsDisplay } from '@/components/ui/tags-display'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'
import { PortfolioModal } from '@/components/modals/portfolio-modal'
import { Calendar, ExternalLink, Github, Globe, ArrowRight, Briefcase } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

interface PortfolioProject {
  id: string
  title: string
  slug: string
  description: string | null
  featured_image: string | null
  project_url: string | null
  github_url: string | null
  technologies: string[]
  tags?: string[]
  created_at: string
  category: string
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
          {/* Fade gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto overflow-visible"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {projects.map((project) => (
                <CarouselItem key={project.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 flex">
                  <div className="p-2 flex flex-col w-full">
                    <Card className="h-full overflow-visible transition-shadow group flex flex-col cursor-pointer" onClick={() => handleProjectClick(project)}>
                      <div className="flex flex-col h-full">
                        {project.featured_image && (
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
                            <Image
                              src={project.featured_image}
                              alt={project.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        
                        <CardHeader className="space-y-2">
                          <div className="flex justify-between flex-wrap">
                            <Badge variant="secondary">{project.category}</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(project.created_at), {
                                addSuffix: true,
                                locale: sv
                              })}
                            </div>
                          </div>
                          
                          <CardTitle className="leading-tight group-hover:text-primary transition-colors flex items-start">
                            {project.title}
                          </CardTitle>
                        </CardHeader>

                        {project.description && (
                          <CardContent className="pt-0 flex-grow">
                            <CardDescription className="line-clamp-3">
                              {project.description}
                            </CardDescription>
                          </CardContent>
                        )}

                        {project.technologies && project.technologies.length > 0 && (
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground font-medium">Teknologier:</div>
                              <TagsDisplay 
                                tags={project.technologies} 
                                maxVisible={3}
                                size="sm"
                                variant="secondary"
                              />
                            </div>
                          </CardContent>
                        )}

                        {project.tags && project.tags.length > 0 && (
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground font-medium">Kategori:</div>
                              <TagsDisplay 
                                tags={project.tags} 
                                maxVisible={3}
                                size="sm"
                                variant="outline"
                              />
                            </div>
                          </CardContent>
                        )}

                        <CardContent className="pt-0 mt-auto">
                          <div className="flex items-center gap-1">
                            {project.project_url && (
                              <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                                <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Live
                                </Link>
                              </Button>
                            )}
                            {project.github_url && (
                              <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                                <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-3 w-3 mr-1" />
                                  Code
                                </Link>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                              <Link href={`/portfolio/${project.slug}`}>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Info
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
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
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}