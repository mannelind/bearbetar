'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Calendar, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

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

interface ArticleCarouselProps {
  articles: Article[]
  title: string
  description?: string
}

export function ArticleCarousel({ articles, title, description }: ArticleCarouselProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {articles.map((article) => (
            <CarouselItem key={article.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${article.slug}`} className="block">
                    {article.featured_image && (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={article.featured_image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    
                    <CardHeader className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Artikel</Badge>
                        {article.published_at && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(article.published_at), {
                              addSuffix: true,
                              locale: sv
                            })}
                          </div>
                        )}
                      </div>
                      
                      <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>

                    {article.excerpt && (
                      <CardContent className="pt-0">
                        <CardDescription className="line-clamp-3">
                          {article.excerpt}
                        </CardDescription>
                      </CardContent>
                    )}

                    {article.admin_users && (
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>
                            {article.admin_users.full_name || article.admin_users.email}
                          </span>
                        </div>
                      </CardContent>
                    )}
                  </Link>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}