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
import { Calendar, User, ChevronDown, ChevronUp, Filter, BookOpen } from 'lucide-react'
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
  selectedTags?: string[]
  searchTerm?: string
  sortBy?: string
  viewMode?: 'grid' | 'list'
}

export function ArticlesGrid({ articles, selectedTags = [], searchTerm = '', sortBy = 'newest', viewMode = 'grid' }: ArticlesGridProps) {
  const [showMoreCardTags, setShowMoreCardTags] = useState<Record<string, boolean>>({})
  const [selectedArticle, setSelectedArticle] = useState<BlogModalArticle | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Filter and sort articles based on all filters
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(search) ||
        article.excerpt?.toLowerCase().includes(search) ||
        article.tags.some(tag => tag.toLowerCase().includes(search))
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article =>
        selectedTags.some(tag => article.tags.includes(tag))
      )
    }

    // Sort articles
    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.published_at || '').getTime() - new Date(b.published_at || '').getTime())
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title))
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime())
    }
  }, [articles, selectedTags, searchTerm, sortBy])

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

  return (
    <div className={`space-y-8 ${viewMode === 'list' ? 'w-full max-w-none' : 'w-full mx-auto'}`}>
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedTags.length > 0 || searchTerm ? 'Filtrerade Artiklar' : 'Alla Artiklar'}
          </h2>
          <p className="text-muted-foreground">
            {filteredAndSortedArticles.length} artikel{filteredAndSortedArticles.length !== 1 ? 'ar' : ''}
            {(selectedTags.length > 0 || searchTerm) && ` matchande filter`}
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredAndSortedArticles.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Inga matchande artiklar</h3>
          <p className="text-muted-foreground mb-4">
            Inga artiklar matchar de valda filtren. Prova att ändra dina sökkriterier.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'articles-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3' : 'w-full space-y-6'}>
          {filteredAndSortedArticles.map((article) => {
            const articleTags = article.tags
            const visibleCardTags = showMoreCardTags[article.id] ? articleTags : articleTags.slice(0, 3)
            const hasMoreCardTags = articleTags.length > 3

            return (
              <div key={article.id} className={viewMode === 'list' ? 'w-full' : ''}>
                <Card 
                  className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                    viewMode === 'grid' ? 'article-card' : 'w-full'
                  }`}
                  onClick={() => handleArticleClick(article)}
                >
                <div className={viewMode === 'grid' ? 'h-full flex flex-col' : 'flex flex-col md:flex-row gap-6'}>
                  {article.featured_image && (
                    <div className={viewMode === 'grid' ? 'aspect-video relative' : 'aspect-video md:aspect-square relative md:w-48 flex-shrink-0'}>
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <div className={viewMode === 'grid' ? 'article-card-body' : 'flex-1 flex flex-col'}>
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
                      <CardContent className={viewMode === 'grid' ? 'pt-0 flex-1' : 'pt-0'}>
                        <CardDescription className={viewMode === 'grid' ? 'line-clamp-4' : 'line-clamp-3'}>
                          {article.excerpt}
                        </CardDescription>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleArticleClick(article)
                            }}
                            className="flex items-center gap-2"
                          >
                            <BookOpen className="h-4 w-4" />
                            Läs mer
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </div>
                </div>

                {/* Tags Section */}
                <div className={viewMode === 'grid' ? 'article-card-footer' : ''}>
                {articleTags.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {visibleCardTags.map((tag, index) => (
                          <ColoredBadge
                            key={index}
                            tag={tag}
                            selected={selectedTags.includes(tag)}
                            className="text-xs"
                          />
                        ))}
                        
                        {hasMoreCardTags && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
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
                </div>
                  </Card>
              </div>
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