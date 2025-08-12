'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { Search, X, Filter, Grid, List } from 'lucide-react'

type PortfolioCategory = Database['public']['Tables']['portfolio_categories']['Row']
type Tag = Database['public']['Tables']['tags']['Row']

export function PortfolioFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [categories, setCategories] = useState<PortfolioCategory[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  )
  const [projectType, setProjectType] = useState(searchParams.get('type') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadCategories()
    loadTags()
  }, [])

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('portfolio_categories')
      .select('*')
      .order('name')

    if (!error && data) {
      setCategories(data)
    }
  }

  const loadTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (!error && data) {
      setTags(data)
    }
  }

  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key)
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','))
      } else {
        newParams.set(key, value)
      }
    })

    router.push(`${pathname}?${newParams.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateFilters({ search: value })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateFilters({ category: value })
  }

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value)
    updateFilters({ type: value })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateFilters({ sort: value })
  }

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    
    setSelectedTags(newTags)
    updateFilters({ tags: newTags })
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedTags([])
    setProjectType('all')
    setSortBy('newest')
    router.push(pathname)
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTags.length > 0 || projectType !== 'all' || sortBy !== 'newest'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Sök i portfolio..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Alla kategorier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla kategorier</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Typ</label>
              <Select value={projectType} onValueChange={handleProjectTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Alla typer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla typer</SelectItem>
                  <SelectItem value="simple">Portfolio</SelectItem>
                  <SelectItem value="case_study">Case Studies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sortera</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sortera efter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Senaste</SelectItem>
                  <SelectItem value="oldest">Äldsta</SelectItem>
                  <SelectItem value="title">Titel A-Ö</SelectItem>
                  <SelectItem value="completion_date">Slutdatum</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          {tags.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Taggar</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id)
                  return (
                    <Badge
                      key={tag.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      #{tag.name}
                      {isSelected && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Aktiva filter:</span>
              {searchQuery && (
                <Badge variant="secondary">
                  Sök: &quot;{searchQuery}&quot;
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleSearchChange('')}
                  />
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleCategoryChange('all')}
                  />
                </Badge>
              )}
              {projectType !== 'all' && (
                <Badge variant="secondary">
                  {projectType === 'simple' ? 'Portfolio' : 'Case Studies'}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleProjectTypeChange('all')}
                  />
                </Badge>
              )}
              {selectedTags.length > 0 && (
                <Badge variant="secondary">
                  {selectedTags.length} taggar
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => {
                      setSelectedTags([])
                      updateFilters({ tags: [] })
                    }}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}