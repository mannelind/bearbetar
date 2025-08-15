'use client'

import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ExternalLink, Github, Globe } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import Link from 'next/link'

interface PortfolioProject {
  id: string
  title: string
  slug: string
  description: string | null
  featured_image: string | null
  project_url: string | null
  github_url: string | null
  technologies: string[]
  created_at: string
  category: string
}

interface PortfolioModalProps {
  project: PortfolioProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PortfolioModal({ project, open, onOpenChange }: PortfolioModalProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            {project.featured_image && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={project.featured_image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{project.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDistanceToNow(new Date(project.created_at), {
                    addSuffix: true,
                    locale: sv
                  })}
                </div>
              </div>
              
              <DialogTitle className="text-2xl font-bold leading-tight">
                {project.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {project.description && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-base leading-relaxed">
                {project.description}
              </p>
            </div>
          )}
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3>Om projektet</h3>
            <p>
              Det här projektet visar vår kompetens inom modern webbutveckling och användarcentrerad design. 
              Vi fokuserade på att skapa en lösning som är både funktionell och användarvänlig.
            </p>
            <h4>Utmaningar vi löste</h4>
            <ul>
              <li>Responsiv design som fungerar på alla enheter</li>
              <li>Optimerad prestanda för snabba laddningstider</li>
              <li>Intuitiv användarupplevelse</li>
              <li>Skalbar arkitektur för framtida utveckling</li>
            </ul>
            <h4>Resultat</h4>
            <p>
              Kunden fick en modern, funktionell lösning som uppfyller alla krav och överträffar förväntningarna. 
              Projektet levererades i tid och inom budget.
            </p>
          </div>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Teknologier som användes</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4 border-t">
            {project.project_url && (
              <Button asChild>
                <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Se live-version
                </Link>
              </Button>
            )}
            {project.github_url && (
              <Button variant="outline" asChild>
                <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Se koden
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/portfolio/${project.slug}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Fullständig case study
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Stäng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}