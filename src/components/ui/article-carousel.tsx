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
import { ArticleModal } from '@/components/modals/article-modal'
import { Calendar, User, ArrowRight, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  tags?: string[]
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article)
    setModalOpen(true)
  }

  // Show placeholder when no articles
  if (!articles || articles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Inga artiklar än</h3>
          <p className="text-muted-foreground mb-6">
            Vi håller på att skriva våra första inlägg. Håll utkik!
          </p>
          <Button asChild>
            <Link href="/blog">
              Se bloggen
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
              {articles.map((article) => (
                <CarouselItem key={article.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 flex">
                  <div className="p-2 flex flex-col w-full">
                    <Card className="h-full overflow-visible transition-shadow flex flex-col cursor-pointer" onClick={() => handleArticleClick(article)}>
                      <div className="flex flex-col h-full">
                        {article.featured_image && (
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
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
                          
                          <CardTitle className="leading-tight hover:text-primary transition-colors min-h-[3rem] flex items-start">
                            {article.title}
                          </CardTitle>
                        </CardHeader>

                        {article.excerpt && (
                          <CardContent className="pt-0 flex-grow">
                            <CardDescription className="line-clamp-3">
                              {article.excerpt}
                            </CardDescription>
                          </CardContent>
                        )}

                        {article.tags && article.tags.length > 0 && (
                          <CardContent className="pt-0">
                            <TagsDisplay 
                              tags={article.tags} 
                              maxVisible={3}
                              size="sm"
                              variant="outline"
                            />
                          </CardContent>
                        )}

                        {article.admin_users && (
                          <CardContent className="pt-0 mt-auto">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>
                                {article.admin_users.full_name || article.admin_users.email}
                              </span>
                            </div>
                          </CardContent>
                        )}
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
      
      <div className="text-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/blog">
            Se alla artiklar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <ArticleModal 
        article={selectedArticle}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}