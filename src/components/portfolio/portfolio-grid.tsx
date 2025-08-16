'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { PortfolioModal } from './portfolio-modal'
import { Calendar, ExternalLink, Eye, FileText, Image as ImageIcon, User } from 'lucide-react'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'] & {
  portfolio_categories?: Database['public']['Tables']['portfolio_categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  gallery_count?: number
}

interface PortfolioGridProps {
  viewMode?: 'grid' | 'list'
}

export function PortfolioGrid() {
  const searchParams = useSearchParams()
  const viewMode = searchParams.get('view') as 'grid' | 'list' || 'grid'
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const loadPortfolioItems = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('portfolio_items')
      .select(`
        *,
        portfolio_item_categories (
          portfolio_categories (
            id,
            name,
            slug
          )
        ),
        portfolio_item_tags (
          tags (
            id,
            name,
            slug
          )
        ),
        portfolio_gallery (
          id
        )
      `)
      .eq('published', true)

    // Apply filters
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')
    const projectType = searchParams.get('type')
    const sortBy = searchParams.get('sort') || 'newest'

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Project type filter
    if (projectType && projectType !== 'all') {
      query = query.eq('project_type', projectType)
    }

    // Sorting
    switch (sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'title':
        query = query.order('title', { ascending: true })
        break
      case 'completion_date':
        query = query.order('completion_date', { ascending: false })
        break
      default: // newest
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error loading portfolio items:', error)
      setLoading(false)
      return
    }

    if (!data) {
      setItems([])
      setLoading(false)
      return
    }

    // Transform and filter the data
    let transformedItems = data.map(item => ({
      ...item,
      portfolio_categories: item.portfolio_item_categories?.map((pc: any) => pc.portfolio_categories).filter(Boolean) || [],
      tags: item.portfolio_item_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
      gallery_count: item.portfolio_gallery?.length || 0
    }))

    // Apply category filter
    if (category && category !== 'all') {
      transformedItems = transformedItems.filter(item =>
        item.portfolio_categories?.some(cat => cat.id === category)
      )
    }

    // Apply tags filter
    if (tags) {
      const tagIds = tags.split(',').filter(Boolean)
      if (tagIds.length > 0) {
        transformedItems = transformedItems.filter(item =>
          tagIds.some(tagId => item.tags?.some(tag => tag.id === tagId))
        )
      }
    }

    setItems(transformedItems)
    setLoading(false)
  }, [supabase, searchParams])

  const loadPortfolioItemsCallback = useCallback(() => {
    loadPortfolioItems()
  }, [loadPortfolioItems])

  useEffect(() => {
    loadPortfolioItemsCallback()
  }, [loadPortfolioItemsCallback])

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300) // Allow modal to close before clearing item
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">
          Inga portfolio items hittades
        </div>
        <p className="text-muted-foreground">
          Prova att justera dina filter eller sökord
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 text-sm text-muted-foreground">
        Visar {items.length} projekt
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
        {items.map((item) => (
          <SimpleTooltip key={item.id} text={`Klicka för att se mer om ${item.title} 🔍`} side="top">
            <Card 
              className={`group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden ${
                viewMode === 'grid' ? 'h-full flex flex-col' : 'w-full'
              }`}
              onClick={() => handleItemClick(item)}
            >
            {viewMode === 'grid' ? (
              // Grid view - matches carousel design
              <div className="flex flex-col h-full">
                {/* Image with overlay */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {item.featured_image ? (
                    <Image 
                      src={item.featured_image} 
                      alt={item.title}
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
                      {item.project_type === 'case_study' ? (
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
                    {item.completion_date && (
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.completion_date).toLocaleDateString('sv-SE')}
                      </Badge>
                    )}
                  </div>

                  {/* Gallery indicator */}
                  {item.gallery_count && item.gallery_count > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        +{item.gallery_count} bilder
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
                    {item.title}
                  </CardTitle>
                  {item.client_name && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {item.client_name}
                    </div>
                  )}
                </CardHeader>

                {/* Categories under title */}
                {item.portfolio_categories && item.portfolio_categories.length > 0 && (
                  <CardContent className="pt-0 pb-2">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">Kategorier:</div>
                      <div className="flex flex-wrap gap-1">
                        {item.portfolio_categories.slice(0, 3).map((category: any) => (
                          <ColoredBadge key={category.id} tag={category.name} className="text-xs" />
                        ))}
                        {item.portfolio_categories.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.portfolio_categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}

                {/* Tags under categories */}
                {item.tags && item.tags.length > 0 && (
                  <CardContent className="pt-0 pb-3">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">Teknologier:</div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag: any) => (
                          <ColoredBadge key={tag.id} tag={tag.name} className="text-xs" />
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </div>
            ) : (
              // List view - horizontal layout with image on left
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="aspect-video md:aspect-square relative md:w-48 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.featured_image ? (
                    <Image 
                      src={item.featured_image} 
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.project_type === 'case_study' ? 'default' : 'secondary'}>
                        {item.project_type === 'case_study' ? (
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
                      {item.completion_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.completion_date).toLocaleDateString('sv-SE')}
                        </div>
                      )}
                      {item.gallery_count && item.gallery_count > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.gallery_count} bilder
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    
                    {item.client_name && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {item.client_name}
                      </div>
                    )}
                  </CardHeader>

                  {item.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.excerpt}
                      </p>
                    </CardContent>
                  )}

                  {/* Tags and actions in list view */}
                  <div className="mt-auto">
                    {/* Categories */}
                    {item.portfolio_categories && item.portfolio_categories.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Kategorier:</div>
                          <div className="flex flex-wrap gap-1">
                            {item.portfolio_categories.slice(0, 3).map((category: any) => (
                              <ColoredBadge key={category.id} tag={category.name} className="text-xs" />
                            ))}
                            {item.portfolio_categories.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.portfolio_categories.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Teknologier:</div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag: any) => (
                              <ColoredBadge key={tag.id} tag={tag.name} className="text-xs" />
                            ))}
                            {item.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {/* Project URL */}
                    {item.project_url && (
                      <CardContent className="pt-0">
                        <SimpleTooltip text="Öppna projektet i en ny flik 🚀" side="bottom">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(item.project_url!, '_blank')
                            }}
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Besök projekt
                          </Button>
                        </SimpleTooltip>
                      </CardContent>
                    )}
                  </div>
                </div>
              </div>
            )}
            </Card>
          </SimpleTooltip>
        ))}
      </div>

      {/* Portfolio Modal */}
      <PortfolioModal 
        item={selectedItem}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </>
  )
}