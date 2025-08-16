'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { Calendar, BookOpen } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import { Database } from '@/types/database'

type Article = Database['public']['Tables']['articles']['Row'] & {
  tags?: string[]
  categories?: Database['public']['Tables']['categories']['Row'][]
  admin_users?: {
    full_name: string | null
    email: string
  }
}

interface ArticleCardProps {
  article: Article
  onClick: () => void
  className?: string
}

export function ArticleCard({ article, onClick, className = '' }: ArticleCardProps) {
  return (
    <Card 
      className={`h-full overflow-hidden transition-shadow flex flex-col cursor-pointer group hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        {article.featured_image && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            
            {/* Top metadata - endast ämnestaggar och datum */}
            <div className="absolute top-2 left-2 flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/90 text-black hover:bg-white">
                Artikel
              </Badge>
              {article.published_at && (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(article.published_at), {
                    addSuffix: true,
                    locale: sv
                  })}
                </Badge>
              )}
            </div>
            
            {/* Bottom right info button */}
            <div className="absolute bottom-2 right-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-colors">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        )}
        
        {/* Header med titel */}
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="leading-tight group-hover:text-primary transition-colors text-sm line-clamp-2">
            {article.title}
          </CardTitle>
        </CardHeader>

        {/* Tags under rubriken - färgkodade */}
        {article.tags && article.tags.length > 0 && (
          <CardContent className="pt-0 pb-3">
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag, index) => (
                <ColoredBadge key={index} tag={tag} className="text-xs" />
              ))}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        )}
      </div>
    </Card>
  )
}