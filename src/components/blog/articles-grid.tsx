'use client'

import { useState, useMemo } from 'react'
import { ArticleCard } from '@/components/ui/article-card'
import { BlogModal } from './blog-modal'
import { Database } from '@/types/database'
import { Filter } from 'lucide-react'

type ArticlesGridArticle = Database['public']['Tables']['articles']['Row'] & {
  tags: string[]
  categories: Database['public']['Tables']['categories']['Row'][]
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
  selectedCategory?: string
  searchTerm?: string
  sortBy?: string
  viewMode?: 'grid' | 'list'
}

export function ArticlesGrid({ articles, selectedTags = [], selectedCategory = 'all', searchTerm = '', sortBy = 'newest', viewMode = 'grid' }: ArticlesGridProps) {
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

    // Filter by selected category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.categories && article.categories.some(cat => cat.id === selectedCategory)
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
  }, [articles, selectedTags, selectedCategory, searchTerm, sortBy])

  const handleArticleClick = (article: ArticlesGridArticle) => {
    // Convert ArticlesGridArticle to BlogModalArticle for the modal  
    const blogModalArticle: any = {
      ...article,
      tags: article.tags, // Keep the original tags as strings
      categories: undefined, // BlogModal will fetch proper category objects
      author: undefined // BlogModal will fetch proper author object
    }
    console.log('Article clicked:', article.title, 'tags:', article.tags)
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
            {selectedTags.length > 0 || selectedCategory !== 'all' || searchTerm ? 'Filtrerade Artiklar' : 'Alla Artiklar'}
          </h2>
          <p className="text-muted-foreground">
            {filteredAndSortedArticles.length} artikel{filteredAndSortedArticles.length !== 1 ? 'ar' : ''}
            {(selectedTags.length > 0 || selectedCategory !== 'all' || searchTerm) && ` matchande filter`}
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
          {filteredAndSortedArticles.map((article) => (
            <div key={article.id} className={viewMode === 'list' ? 'w-full' : ''}>
              <ArticleCard 
                article={article} 
                onClick={() => handleArticleClick(article)} 
                className={viewMode === 'list' ? 'w-full' : ''}
              />
            </div>
          ))}
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
