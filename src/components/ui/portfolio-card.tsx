'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { Calendar, User, Eye, FileText, Image as ImageIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import { Database } from '@/types/database'

type PortfolioProject = Database['public']['Tables']['portfolio_items']['Row'] & {
  portfolio_categories?: Database['public']['Tables']['portfolio_categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  technologies: string[]
  category: string
  gallery_count?: number
}

interface PortfolioCardProps {
  project: PortfolioProject
  onClick: () => void
  className?: string
}

export function PortfolioCard({ project, onClick, className = '' }: PortfolioCardProps) {
  return (
    <Card 
      className={`h-full overflow-hidden transition-shadow flex flex-col cursor-pointer group hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        {/* Image with overlay */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {project.featured_image ? (
            <Image 
              src={project.featured_image} 
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          
          {/* Top metadata - project type and date */}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/90 text-black hover:bg-white">
              {project.project_type === 'case_study' ? (
                <>
                  <FileText className="h-3 w-3 mr-1" />
                  Case Study
                </>
              ) : (
                <>
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Portfolio
                </>
              )}
            </Badge>
            {project.completion_date && (
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(project.completion_date).toLocaleDateString('sv-SE')}
              </Badge>
            )}
          </div>

          {/* Gallery indicator */}
          {project.gallery_count && project.gallery_count > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                +{project.gallery_count} bilder
              </Badge>
            </div>
          )}
          
          {/* Bottom right info button */}
          <div className="absolute bottom-2 right-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-colors">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Header with title */}
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="leading-tight group-hover:text-primary transition-colors text-sm line-clamp-2">
            {project.title}
          </CardTitle>
          {project.client_name && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              {project.client_name}
            </div>
          )}
        </CardHeader>

        {/* Categories under title */}
        {project.portfolio_categories && project.portfolio_categories.length > 0 && (
          <CardContent className="pt-0 pb-2">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-medium">Kategorier:</div>
              <div className="flex flex-wrap gap-1">
                {project.portfolio_categories.slice(0, 3).map((category) => (
                  <ColoredBadge key={category.id} tag={category.name} className="text-xs" />
                ))}
                {project.portfolio_categories.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.portfolio_categories.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        )}

        {/* Tags under categories */}
        {project.tags && project.tags.length > 0 && (
          <CardContent className="pt-0 pb-3">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-medium">Teknologier:</div>
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <ColoredBadge key={tag.id} tag={tag.name} className="text-xs" />
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </div>
    </Card>
  )
}