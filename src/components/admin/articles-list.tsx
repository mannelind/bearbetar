'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ADMIN_ROUTES } from '@/lib/constants'
import { 
  Plus, 
  Edit, 
  Eye, 
  Calendar,
  FileText,
  Filter,
  X,
  Search
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author_id: string
  tags: string[] | null
  admin_users: {
    full_name: string | null
    email: string
  }
}

interface ArticlesListProps {
  articles: Article[]
}

export function ArticlesList({ articles }: ArticlesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    articles.forEach(article => {
      if (article.tags) {
        article.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [articles])

  // Filter articles based on search term, tag, and status
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const titleMatch = article.title.toLowerCase().includes(searchLower)
        const excerptMatch = article.excerpt?.toLowerCase().includes(searchLower)
        const authorMatch = article.admin_users?.full_name?.toLowerCase().includes(searchLower) ||
                           article.admin_users?.email?.toLowerCase().includes(searchLower)
        if (!titleMatch && !excerptMatch && !authorMatch) return false
      }

      // Tag filter
      if (selectedTag && (!article.tags || !article.tags.includes(selectedTag))) {
        return false
      }

      // Status filter
      if (statusFilter === 'published' && !article.published) return false
      if (statusFilter === 'draft' && article.published) return false

      return true
    })
  }, [articles, searchTerm, selectedTag, statusFilter])

  const publishedCount = articles.filter(a => a.published).length
  const draftCount = articles.filter(a => !a.published).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artiklar</h1>
          <p className="text-muted-foreground">
            Hantera blogginlägg och artiklar
          </p>
        </div>
        <Button asChild>
          <Link href={ADMIN_ROUTES.newArticle}>
            <Plus className="mr-2 h-4 w-4" />
            Ny Artikel
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicerade</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utkast</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter & Sök
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök artiklar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Alla ({articles.length})
            </Button>
            <Button
              variant={statusFilter === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('published')}
            >
              Publicerade ({publishedCount})
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
            >
              Utkast ({draftCount})
            </Button>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Filtrera efter tagg:</div>
              <div className="flex flex-wrap gap-2">
                {selectedTag && (
                  <Badge variant="default" className="cursor-pointer" onClick={() => setSelectedTag(null)}>
                    {selectedTag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {allTags.filter(tag => tag !== selectedTag).map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredArticles.length === articles.length 
              ? 'Alla Artiklar' 
              : `Filtrerade Artiklar (${filteredArticles.length} av ${articles.length})`
            }
          </CardTitle>
          <CardDescription>
            {filteredArticles.length} artikel{filteredArticles.length !== 1 ? 'ar' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {articles.length === 0 ? 'Inga artiklar än' : 'Inga matchande artiklar'}
              </h3>
              <p className="text-muted-foreground">
                {articles.length === 0 
                  ? 'Skapa din första artikel för att komma igång.'
                  : 'Prova att ändra dina filterkriterier.'
                }
              </p>
              {articles.length === 0 && (
                <Button asChild className="mt-4">
                  <Link href={ADMIN_ROUTES.newArticle}>
                    <Plus className="mr-2 h-4 w-4" />
                    Skapa första artikeln
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article: Article) => (
                <div 
                  key={article.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{article.title}</h3>
                      <Badge variant={article.published ? "default" : "secondary"}>
                        {article.published ? "Publicerad" : "Utkast"}
                      </Badge>
                    </div>
                    
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {article.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {(article.admin_users?.full_name || article.admin_users?.email || 'U')
                              .substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          Av {article.admin_users?.full_name || article.admin_users?.email}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(article.updated_at), { 
                          addSuffix: true, 
                          locale: sv 
                        })}
                      </span>
                      {article.published && article.published_at && (
                        <span>
                          Publicerad {formatDistanceToNow(new Date(article.published_at), { 
                            addSuffix: true, 
                            locale: sv 
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {article.published && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}