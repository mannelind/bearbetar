'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { Search, X, Filter, Grid, List, ChevronDown, ChevronUp } from 'lucide-react'

type Category = Database['public']['Tables']['portfolio_categories']['Row'] | Database['public']['Tables']['article_categories']['Row']
type Tag = Database['public']['Tables']['tags']['Row']

interface FilterConfig {
  // Content type specific options
  contentType: 'portfolio' | 'blog' | 'services' | 'generic'
  
  // Enable/disable specific filter types
  enableSearch?: boolean
  enableCategories?: boolean
  enableTags?: boolean
  enableSort?: boolean
  enableViewToggle?: boolean
  enableDateFilter?: boolean
  enableAuthorFilter?: boolean
  
  // Custom filter options
  customFilters?: Array<{
    key: string
    label: string
    options: Array<{ value: string; label: string }>
  }>
  
  // Sort options
  sortOptions?: Array<{ value: string; label: string }>
  
  // Search placeholder
  searchPlaceholder?: string
  
  // Category table name (portfolio_categories, article_categories, etc.)
  categoryTable?: string
}

interface ContentFiltersProps {
  config: FilterConfig
  onFiltersChange?: (filters: FilterState) => void
  className?: string
  // Optional array of available tags (for when we want to derive from content rather than database)
  availableTags?: string[]
}

interface FilterState {
  search: string
  category: string
  tags: string[]
  sort: string
  viewMode: 'grid' | 'list'
  dateRange?: string
  author?: string
  customFilters: Record<string, string>
}

export function ContentFilters({ config, onFiltersChange, className, availableTags }: ContentFiltersProps) {
  const searchParams = useSearchParams()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [showMoreTags, setShowMoreTags] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    sort: searchParams.get('sort') || (config.sortOptions?.[0]?.value || 'newest'),
    viewMode: (searchParams.get('view') as 'grid' | 'list') || 'grid',
    dateRange: searchParams.get('dateRange') || 'all',
    author: searchParams.get('author') || 'all',
    customFilters: config.customFilters?.reduce((acc, filter) => {
      acc[filter.key] = searchParams.get(filter.key) || 'all'
      return acc
    }, {} as Record<string, string>) || {}
  })

  // Load categories
  const loadCategories = useCallback(async () => {
    if (!config.enableCategories || !config.categoryTable) return

    const { data, error } = await supabase
      .from(config.categoryTable as any)
      .select('*')
      .order('name')

    if (!error && data) {
      setCategories(data as any)
    }
  }, [supabase, config.enableCategories, config.categoryTable])

  // Load tags
  const loadTags = useCallback(async () => {
    if (!config.enableTags) return

    // If availableTags is provided, use those instead of fetching from database
    if (availableTags) {
      const uniqueTags = [...new Set(availableTags)].sort()
      const transformedTags = uniqueTags.map((tag) => ({
        id: tag, // Use tag name as ID for local tags
        name: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-'),
        created_at: new Date().toISOString()
      }))
      setTags(transformedTags as any)
      return
    }

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (!error && data) {
      setTags(data)
    }
  }, [supabase, config.enableTags, availableTags])

  // Load authors (for blog)
  const loadAuthors = useCallback(async () => {
    if (!config.enableAuthorFilter) return

    const { data, error } = await supabase
      .from('admin_users')
      .select('id, full_name, email')
      .order('full_name')

    if (!error && data) {
      setAuthors(data)
    }
  }, [supabase, config.enableAuthorFilter])

  useEffect(() => {
    loadCategories()
    loadTags()
    loadAuthors()
  }, [loadCategories, loadTags, loadAuthors])

  // Update filters and notify parent component (no URL updates)
  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    
    // Notify parent component
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleTagToggle = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId]
    
    updateFilters({ tags: newTags })
  }

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      search: '',
      category: 'all',
      tags: [],
      sort: config.sortOptions?.[0]?.value || 'newest',
      viewMode: 'grid',
      dateRange: 'all',
      author: 'all',
      customFilters: config.customFilters?.reduce((acc, filter) => {
        acc[filter.key] = 'all'
        return acc
      }, {} as Record<string, string>) || {}
    }
    
    setFilters(defaultFilters)
    
    if (onFiltersChange) {
      onFiltersChange(defaultFilters)
    }
  }

  const hasActiveFilters = filters.search || 
    filters.category !== 'all' || 
    filters.tags.length > 0 || 
    filters.sort !== (config.sortOptions?.[0]?.value || 'newest') ||
    filters.dateRange !== 'all' ||
    filters.author !== 'all' ||
    Object.values(filters.customFilters).some(value => value !== 'all')

  // Get default sort options based on content type
  const getDefaultSortOptions = () => {
    switch (config.contentType) {
      case 'portfolio':
        return [
          { value: 'newest', label: 'Senaste' },
          { value: 'oldest', label: 'Äldsta' },
          { value: 'title', label: 'Titel A-Ö' },
          { value: 'completion_date', label: 'Slutdatum' }
        ]
      case 'blog':
        return [
          { value: 'newest', label: 'Senaste' },
          { value: 'oldest', label: 'Äldsta' },
          { value: 'title', label: 'Titel A-Ö' },
          { value: 'popular', label: 'Populära' }
        ]
      case 'services':
        return [
          { value: 'name', label: 'Namn A-Ö' },
          { value: 'price', label: 'Pris' },
          { value: 'popular', label: 'Populära' }
        ]
      default:
        return [
          { value: 'newest', label: 'Senaste' },
          { value: 'oldest', label: 'Äldsta' },
          { value: 'title', label: 'Titel A-Ö' }
        ]
    }
  }

  const sortOptions = config.sortOptions || getDefaultSortOptions()

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            {config.enableSearch !== false && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={config.searchPlaceholder || `Sök i ${config.contentType}...`}
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-10"
                />
              </div>
            )}
            
            {config.enableViewToggle && (
              <div className="flex gap-2">
                <Button
                  variant={filters.viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ viewMode: 'grid' })}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={filters.viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ viewMode: 'list' })}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Category Filter */}
            {config.enableCategories && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => updateFilters({ category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alla kategorier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla kategorier</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Custom Filters */}
            {config.customFilters?.map((customFilter) => (
              <div key={customFilter.key} className="space-y-2">
                <label className="text-sm font-medium">{customFilter.label}</label>
                <Select 
                  value={filters.customFilters[customFilter.key] || 'all'} 
                  onValueChange={(value) => updateFilters({ 
                    customFilters: { ...filters.customFilters, [customFilter.key]: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Alla ${customFilter.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla {customFilter.label.toLowerCase()}</SelectItem>
                    {customFilter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Date Range Filter */}
            {config.enableDateFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Datum</label>
                <Select 
                  value={filters.dateRange || 'all'} 
                  onValueChange={(value) => updateFilters({ dateRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alla datum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla datum</SelectItem>
                    <SelectItem value="last_week">Senaste veckan</SelectItem>
                    <SelectItem value="last_month">Senaste månaden</SelectItem>
                    <SelectItem value="last_year">Senaste året</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Author Filter */}
            {config.enableAuthorFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Författare</label>
                <Select 
                  value={filters.author || 'all'} 
                  onValueChange={(value) => updateFilters({ author: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alla författare" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla författare</SelectItem>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.full_name || author.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sort Filter */}
            {config.enableSort !== false && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Sortera</label>
                <Select 
                  value={filters.sort} 
                  onValueChange={(value) => updateFilters({ sort: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sortera efter" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Clear Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium invisible">Actions</label>
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Rensa filter
              </Button>
            </div>
          </div>

          {/* Tag Filters */}
          {config.enableTags && tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <label className="text-sm font-medium">Filtrera efter taggar</label>
                  {filters.tags.length > 0 && (
                    <Badge variant="outline">
                      {filters.tags.length} valda
                    </Badge>
                  )}
                </div>
                {filters.tags.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => updateFilters({ tags: [] })}
                  >
                    Rensa taggar
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(showMoreTags ? tags : tags.slice(0, 8)).map((tag) => {
                  const isSelected = filters.tags.includes(tag.id)
                  return (
                    <div key={tag.id} className="cursor-pointer" onClick={() => handleTagToggle(tag.id)}>
                      <ColoredBadge 
                        tag={tag.name}
                        selected={isSelected}
                        className="hover:opacity-80 transition-opacity"
                      >
                        #{tag.name}
                        {isSelected && <X className="h-3 w-3 ml-1" />}
                      </ColoredBadge>
                    </div>
                  )
                })}
                
                {tags.length > 8 && (
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
                        Visa fler ({tags.length - 8}) <ChevronDown className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Aktiva filter:</span>
              
              {filters.search && (
                <Badge variant="secondary">
                  Sök: &quot;{filters.search}&quot;
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters({ search: '' })}
                  />
                </Badge>
              )}
              
              {filters.category !== 'all' && (
                <Badge variant="secondary">
                  {(categories as any).find((c: any) => c.id === filters.category)?.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters({ category: 'all' })}
                  />
                </Badge>
              )}
              
              {filters.tags.length > 0 && (
                <Badge variant="secondary">
                  {filters.tags.length} taggar
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters({ tags: [] })}
                  />
                </Badge>
              )}
              
              {filters.author !== 'all' && (
                <Badge variant="secondary">
                  {authors.find(a => a.id === filters.author)?.full_name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters({ author: 'all' })}
                  />
                </Badge>
              )}
              
              {Object.entries(filters.customFilters).map(([key, value]) => 
                value !== 'all' && (
                  <Badge key={key} variant="secondary">
                    {config.customFilters?.find(f => f.key === key)?.options.find(o => o.value === value)?.label}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => updateFilters({ 
                        customFilters: { ...filters.customFilters, [key]: 'all' }
                      })}
                    />
                  </Badge>
                )
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Export filter state type for use in parent components
export type { FilterState, FilterConfig }