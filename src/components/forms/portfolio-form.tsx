'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { X, Plus, Image as ImageIcon, Trash2 } from 'lucide-react'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']
type PortfolioCategory = Database['public']['Tables']['portfolio_categories']['Row']
type Tag = Database['public']['Tables']['tags']['Row']
type GalleryItem = Database['public']['Tables']['portfolio_gallery']['Row']

const portfolioSchema = z.object({
  title: z.string().min(1, 'Titel krävs'),
  slug: z.string().min(1, 'Slug krävs'),
  description: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().max(200).optional(),
  featured_image: z.string().url().optional().or(z.literal('')),
  project_type: z.enum(['simple', 'case_study']),
  client_name: z.string().optional(),
  project_url: z.string().url().optional().or(z.literal('')),
  completion_date: z.string().optional(),
  published: z.boolean(),
})

type PortfolioFormData = z.infer<typeof portfolioSchema>

interface PortfolioFormProps {
  portfolioItem?: PortfolioItem
  onSave?: () => void
}

export function PortfolioForm({ portfolioItem, onSave }: PortfolioFormProps) {
  const router = useRouter()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<PortfolioCategory[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [galleryImages, setGalleryImages] = useState<(GalleryItem & { isNew?: boolean })[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: portfolioItem?.title || '',
      slug: portfolioItem?.slug || '',
      description: portfolioItem?.description || '',
      content: portfolioItem?.content || '',
      excerpt: portfolioItem?.excerpt || '',
      featured_image: portfolioItem?.featured_image || '',
      project_type: (portfolioItem?.project_type as 'simple' | 'case_study') || 'simple',
      client_name: portfolioItem?.client_name || '',
      project_url: portfolioItem?.project_url || '',
      completion_date: portfolioItem?.completion_date || '',
      published: portfolioItem?.published || false,
    }
  })

  const projectType = watch('project_type')

  useEffect(() => {
    loadCategories()
    loadTags()
    if (portfolioItem) {
      loadSelectedCategoriesAndTags()
      loadGalleryImages()
    }
  }, [portfolioItem])

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

  const loadSelectedCategoriesAndTags = async () => {
    if (!portfolioItem) return

    // Load selected categories
    const { data: categoryData } = await supabase
      .from('portfolio_item_categories')
      .select('category_id')
      .eq('portfolio_item_id', portfolioItem.id)

    if (categoryData) {
      setSelectedCategories(categoryData.map(c => c.category_id))
    }

    // Load selected tags
    const { data: tagData } = await supabase
      .from('portfolio_item_tags')
      .select('tag_id')
      .eq('portfolio_item_id', portfolioItem.id)

    if (tagData) {
      setSelectedTags(tagData.map(t => t.tag_id))
    }
  }

  const loadGalleryImages = async () => {
    if (!portfolioItem) return

    const { data, error } = await supabase
      .from('portfolio_gallery')
      .select('*')
      .eq('portfolio_item_id', portfolioItem.id)
      .order('sort_order')

    if (!error && data) {
      setGalleryImages(data)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  const addGalleryImage = () => {
    if (!newImageUrl) return

    const newImage: GalleryItem & { isNew?: boolean } = {
      id: `temp-${Date.now()}`,
      portfolio_item_id: portfolioItem?.id || '',
      image_url: newImageUrl,
      image_alt: '',
      caption: '',
      sort_order: galleryImages.length,
      created_at: new Date().toISOString(),
      isNew: true
    }

    setGalleryImages([...galleryImages, newImage])
    setNewImageUrl('')
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index))
  }

  const updateGalleryImage = (index: number, field: string, value: string) => {
    const updated = [...galleryImages]
    updated[index] = { ...updated[index], [field]: value }
    setGalleryImages(updated)
  }

  const onSubmit = async (data: PortfolioFormData) => {
    setLoading(true)

    try {
      let portfolioItemId = portfolioItem?.id

      if (portfolioItem) {
        // Update existing portfolio item
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            ...data,
            published_at: data.published ? new Date().toISOString() : null,
          })
          .eq('id', portfolioItem.id)

        if (error) throw error
      } else {
        // Create new portfolio item
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) throw new Error('Not authenticated')

        const { data: newItem, error } = await supabase
          .from('portfolio_items')
          .insert({
            ...data,
            author_id: user.user.id,
            published_at: data.published ? new Date().toISOString() : null,
          })
          .select()
          .single()

        if (error) throw error
        if (newItem) portfolioItemId = newItem.id
      }

      if (!portfolioItemId) throw new Error('Failed to get portfolio item ID')

      // Update categories
      await supabase.from('portfolio_item_categories').delete().eq('portfolio_item_id', portfolioItemId)
      if (selectedCategories.length > 0) {
        await supabase.from('portfolio_item_categories').insert(
          selectedCategories.map(categoryId => ({
            portfolio_item_id: portfolioItemId!,
            category_id: categoryId
          }))
        )
      }

      // Update tags
      await supabase.from('portfolio_item_tags').delete().eq('portfolio_item_id', portfolioItemId)
      if (selectedTags.length > 0) {
        await supabase.from('portfolio_item_tags').insert(
          selectedTags.map(tagId => ({
            portfolio_item_id: portfolioItemId!,
            tag_id: tagId
          }))
        )
      }

      // Update gallery images
      if (portfolioItem) {
        await supabase.from('portfolio_gallery').delete().eq('portfolio_item_id', portfolioItemId)
      }
      
      if (galleryImages.length > 0) {
        await supabase.from('portfolio_gallery').insert(
          galleryImages.map((img, index) => ({
            portfolio_item_id: portfolioItemId!,
            image_url: img.image_url,
            image_alt: img.image_alt || '',
            caption: img.caption || '',
            sort_order: index
          }))
        )
      }

      if (onSave) {
        onSave()
      } else {
        router.push('/admin/portfolio')
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error)
      alert('Fel vid sparande av portfolio item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            {...register('title')}
            onChange={(e) => {
              register('title').onChange(e)
              if (!portfolioItem) {
                setValue('slug', generateSlug(e.target.value))
              }
            }}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...register('slug')} />
          {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project_type">Projekttyp *</Label>
          <Select onValueChange={(value) => setValue('project_type', value as 'simple' | 'case_study')}>
            <SelectTrigger>
              <SelectValue placeholder="Välj projekttyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Enkelt portfolioarbete</SelectItem>
              <SelectItem value="case_study">Case study</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_name">Klientnamn</Label>
          <Input id="client_name" {...register('client_name')} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project_url">Projekt-URL</Label>
          <Input id="project_url" type="url" {...register('project_url')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="completion_date">Slutdatum</Label>
          <Input id="completion_date" type="date" {...register('completion_date')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Sammanfattning (för kort)</Label>
        <Textarea 
          id="excerpt" 
          {...register('excerpt')} 
          placeholder="Kort beskrivning som visas på kort..."
          rows={2}
        />
        {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beskrivning</Label>
        <Textarea 
          id="description" 
          {...register('description')} 
          placeholder="Detaljerad projektbeskrivning..."
          rows={4}
        />
      </div>

      {projectType === 'case_study' && (
        <div className="space-y-2">
          <Label htmlFor="content">Case Study Innehåll</Label>
          <Textarea 
            id="content" 
            {...register('content')} 
            placeholder="Detaljerat case study innehåll (stöder Markdown)..."
            rows={8}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="featured_image">Huvudbild URL</Label>
        <Input id="featured_image" type="url" {...register('featured_image')} />
      </div>

      {/* Gallery Images */}
      <Card>
        <CardHeader>
          <CardTitle>Galleri ({projectType === 'case_study' ? 'Rekommenderat för case studies' : 'Valfritt'})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Bild URL..."
              type="url"
            />
            <Button type="button" onClick={addGalleryImage}>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till
            </Button>
          </div>

          {galleryImages.map((image, index) => (
            <div key={image.id} className="flex gap-2 items-start p-3 border rounded">
              <ImageIcon className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1 grid gap-2 md:grid-cols-3">
                <Input
                  value={image.image_url}
                  onChange={(e) => updateGalleryImage(index, 'image_url', e.target.value)}
                  placeholder="Bild URL"
                />
                <Input
                  value={image.image_alt || ''}
                  onChange={(e) => updateGalleryImage(index, 'image_alt', e.target.value)}
                  placeholder="Alt text"
                />
                <Input
                  value={image.caption || ''}
                  onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)}
                  placeholder="Bildtext"
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeGalleryImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Kategorier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category.id])
                    } else {
                      setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                    }
                  }}
                />
                <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Taggar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((tagId) => {
              const tag = tags.find(t => t.id === tagId)
              return tag ? (
                <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                  {tag.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))}
                  />
                </Badge>
              ) : null
            })}
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {tags
              .filter(tag => !selectedTags.includes(tag.id))
              .map((tag) => (
                <Button
                  key={tag.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTags([...selectedTags, tag.id])}
                >
                  {tag.name}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="published"
          {...register('published')}
        />
        <Label htmlFor="published">Publicerad</Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Sparar...' : portfolioItem ? 'Uppdatera' : 'Skapa'} Portfolio Item
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/admin/portfolio')}
        >
          Avbryt
        </Button>
      </div>
    </form>
  )
}