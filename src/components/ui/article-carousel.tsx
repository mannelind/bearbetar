'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArticleCard } from './article-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'
import { BlogModal } from '@/components/blog/blog-modal'
import { Database } from '@/types/database'
import { ArrowRight, FileText } from 'lucide-react'

type Article = Database['public']['Tables']['articles']['Row'] & {
  tags?: string[]
  categories?: Database['public']['Tables']['categories']['Row'][]
  admin_users?: {
    full_name: string | null
    email: string
  }
}

type BlogModalArticle = Database['public']['Tables']['articles']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  author?: Database['public']['Tables']['admin_users']['Row']
}

interface ArticleCarouselProps {
  articles: Article[]
  title: string
  description?: string
}

export function ArticleCarousel({ articles, title, description }: ArticleCarouselProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogModalArticle | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleArticleClick = (article: Article) => {
    // Convert Article to BlogModalArticle for the modal
    const blogModalArticle: BlogModalArticle = {
      ...article,
      tags: undefined, // BlogModal will fetch proper tag objects
      categories: undefined,
      author: undefined
    }
    setSelectedArticle(blogModalArticle)
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
          {/* Fade gradient masks - optimerat för centrerad layout */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
          
          <Carousel
            opts={{
              align: "center",
              loop: true,
              startIndex: Math.floor((articles.length - 1) / 2),
            }}
            className="w-full max-w-6xl mx-auto overflow-visible"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {articles.map((article) => (
                <CarouselItem key={article.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-1/3 flex">
                  <div className="p-2 flex flex-col w-full">
                    <ArticleCard article={article} onClick={() => handleArticleClick(article)} />
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
      
      <BlogModal 
        article={selectedArticle}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}