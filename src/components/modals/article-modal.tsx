'use client'

import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  admin_users?: {
    full_name: string | null
    email: string
  }
}

interface ArticleModalProps {
  article: Article | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ArticleModal({ article, open, onOpenChange }: ArticleModalProps) {
  if (!article) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            {article.featured_image && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">Artikel</Badge>
                {article.published_at && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(article.published_at), {
                      addSuffix: true,
                      locale: sv
                    })}
                  </div>
                )}
              </div>
              
              <DialogTitle className="text-2xl font-bold leading-tight">
                {article.title}
              </DialogTitle>
              
              {article.admin_users && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>
                    {article.admin_users.full_name || article.admin_users.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {article.excerpt && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-base leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          )}
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Det här är en förhandsvisning av artikeln. I den riktiga versionen skulle hela 
              artikelinnehållet visas här med riktig text, bilder och formatering.
            </p>
            <p>
              Vi håller på att utveckla bloggsystemet och kommer snart att fylla på med 
              riktigt innehåll. Tills dess kan du få en känsla för hur artiklarna kommer 
              att presenteras.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <Button asChild>
              <Link href={`/blog/${article.slug}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Läs hela artikeln
              </Link>
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Stäng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}