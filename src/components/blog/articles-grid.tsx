'use client'

import Image from 'next/image'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { BlogModal } from './blog-modal'
import { Database } from '@/types/database'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { Calendar, User, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

type ArticlesGridArticle = Database['public']['Tables']['articles']['Row'] & {
  tags: string[]
  admin_users: {
    full_name: string | null
    email: string
    bio?: string | null
    profile_image?: string | null
  }
}

type BlogModalArticle = Database['public']['Tables']['articles']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  author?: Database['public']['Tables']['admin_users']['Row']
}

interface ArticlesGridProps {
  articles: ArticlesGridArticle[]
}


export function ArticlesGrid({ articles }: ArticlesGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showMoreTags, setShowMoreTags] = useState(false)
  const [showMoreCardTags, setShowMoreCardTags] = useState<Record<string, boolean>>({})
  const [selectedArticle, setSelectedArticle] = useState<BlogModalArticle | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    articles.forEach(article => {
      article.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [articles])

  // Filter and sort articles based on selected tags
  const filteredAndSortedArticles = useMemo(() => {
    if (selectedTags.length === 0) {
      return articles
    }

    return articles
      .map(article => {
        const articleTags = article.tags
        const matchCount = selectedTags.filter(tag => articleTags.includes(tag)).length
        return { article, matchCount }
      })
      .filter(({ matchCount }) => matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(({ article }) => article)
  }, [articles, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllTags = () => {
    setSelectedTags([])
  }

  const toggleShowMoreCardTags = (articleId: string) => {
    setShowMoreCardTags(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }))
  }

  const handleArticleClick = (article: ArticlesGridArticle) => {
    // Convert ArticlesGridArticle to BlogModalArticle for the modal
    const blogModalArticle: BlogModalArticle = {
      ...article,
      tags: undefined, // BlogModal will fetch proper tag objects
      categories: undefined,
      author: undefined
    }
    console.log('Article clicked:', article.title)
    setSelectedArticle(blogModalArticle)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedArticle(null), 300)
  }

  const visibleTags = showMoreTags ? allTags : allTags.slice(0, 8)
  const hasMoreTags = allTags.length > 8

  return (
    <div className="space-y-8">
      {/* Tag Filter Section */}
      {allTags.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h3 className="font-semibold">Filtrera efter taggar</h3>
              {selectedTags.length > 0 && (
                <Badge variant="outline">
                  {selectedTags.length} valda
                </Badge>
              )}
            </div>
            {selectedTags.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAllTags}
              >
                Rensa alla
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {visibleTags.map(tag => (
              <ColoredBadge
                key={tag}
                tag={tag}
                selected={selectedTags.includes(tag)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleTag(tag)}
              />
            ))}
            
            {hasMoreTags && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreTags(!showMoreTags)}
                className="h-6 px-2 text-xs"
              >
                {showMoreTags ? (
                  <>
                    Visa färre <ChevronUp className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    Visa fler ({allTags.length - 8}) <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedTags.length > 0 ? 'Filtrerade Artiklar' : 'Alla Artiklar'}
          </h2>
          <p className="text-muted-foreground">
            {filteredAndSortedArticles.length} artikel{filteredAndSortedArticles.length !== 1 ? 'ar' : ''}
            {selectedTags.length > 0 && ` matchande valda taggar`}
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredAndSortedArticles.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Inga matchande artiklar</h3>
          <p className="text-muted-foreground mb-4">
            Inga artiklar matchar de valda taggarna. Prova att ändra ditt val.
          </p>
          <Button onClick={clearAllTags} variant="outline">
            Rensa filter
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedArticles.map((article) => {
            const articleTags = article.tags
            const visibleCardTags = showMoreCardTags[article.id] ? articleTags : articleTags.slice(0, 3)
            const hasMoreCardTags = articleTags.length > 3

            return (
              <SimpleTooltip key={article.id} text={`Läs "${article.title}" 📖`} side="top">
                <Card 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                <div>
                  {article.featured_image && (
                    <div className="aspect-video relative">
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
                </div>

                {/* Tags Section */}
                {articleTags.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {visibleCardTags.map((tag, index) => (
                          <ColoredBadge
                            key={index}
                            tag={tag}
                            selected={selectedTags.includes(tag)}
                            className="text-xs cursor-pointer transition-colors"
                            onClick={() => toggleTag(tag)}
                          />
                        ))}
                        
                        {hasMoreCardTags && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleShowMoreCardTags(article.id)
                            }}
                            className="h-5 px-1 text-xs"
                          >
                            {showMoreCardTags[article.id] ? (
                              <>
                                mindre <ChevronUp className="ml-1 h-2 w-2" />
                              </>
                            ) : (
                              <>
                                +{articleTags.length - 3} <ChevronDown className="ml-1 h-2 w-2" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}

                {/* Author */}
                {article.admin_users && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {article.admin_users.profile_image ? (
                        <div className="relative w-4 h-4 rounded-full overflow-hidden border border-border">
                          <Image
                            src={article.admin_users.profile_image}
                            alt={article.admin_users.full_name || article.admin_users.email}
                            fill
                            className="object-cover"
                            sizes="16px"
                          />
                        </div>
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span>
                        {article.admin_users.full_name || article.admin_users.email}
                      </span>
                    </div>
                  </CardContent>
                )}
              </Card>
              </SimpleTooltip>
            )
          })}
        </div>
      )}

      {/* Blog Modal */}
      <BlogModal 
        article={selectedArticle}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  )
}