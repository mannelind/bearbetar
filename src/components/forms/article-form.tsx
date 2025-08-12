'use client'

import { useState } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useSupabase } from '@/hooks/use-supabase'
import { useAuth } from '@/hooks/use-auth'
import { ADMIN_ROUTES } from '@/lib/constants'
import { toast } from 'sonner'
import { Loader2, Save, Eye, X, Plus } from 'lucide-react'

const articleSchema = z.object({
  title: z.string().min(1, 'Titel krävs').max(200, 'Titel får vara max 200 tecken'),
  slug: z
    .string()
    .min(1, 'Slug krävs')
    .max(100, 'Slug får vara max 100 tecken')
    .regex(/^[a-z0-9-]+$/, 'Slug får bara innehålla små bokstäver, siffror och bindestreck'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Innehåll krävs'),
  featured_image: z.string().url('Måste vara en giltig URL').optional().or(z.literal('')),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional().default([]),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleFormProps {
  article?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    featured_image: string | null
    published: boolean
    published_at: string | null
    tags: string[] | null
  }
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const supabase = useSupabase()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [tagUsage, setTagUsage] = useState<Record<string, number>>({})
  
  // Predefined tags
  const predefinedTags = [
    'Affärsutveckling', 'Strategi', 'Ledning', 'Innovation', 'Digitalisering',
    'Försäljning', 'Marknadsföring', 'Finansiering', 'HR', 'Process',
    'Tillväxt', 'Effektivitet', 'Kvalitet', 'Kundservice', 'Teknologi',
    'Hållbarhet', 'Partnerskap', 'Internationalisering', 'Produktutveckling',
    'Organisationskultur', 'Förändringsledning', 'Riskhantering'
  ]

  // Fetch tag usage statistics
  React.useEffect(() => {
    const fetchTagUsage = async () => {
      const { data: articles } = await supabase
        .from('articles')
        .select('tags')
      
      const usage: Record<string, number> = {}
      
      // Count predefined tags
      predefinedTags.forEach(tag => {
        usage[tag] = 0
      })
      
      // Count usage from articles
      articles?.forEach(article => {
        if (article.tags) {
          article.tags.forEach((tag: string) => {
            usage[tag] = (usage[tag] || 0) + 1
          })
        }
      })
      
      setTagUsage(usage)
    }
    
    fetchTagUsage()
  }, [supabase, predefinedTags])

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      excerpt: article?.excerpt || '',
      content: article?.content || '',
      featured_image: article?.featured_image || '',
      published: article?.published || false,
      tags: article?.tags || [],
    },
  })

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/å/g, 'a')
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Tag management functions
  const addTag = () => {
    if (newTag.trim() && !form.getValues('tags').includes(newTag.trim())) {
      const currentTags = form.getValues('tags')
      form.setValue('tags', [...currentTags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags')
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  const addPredefinedTag = (tag: string) => {
    const currentTags = form.getValues('tags')
    if (!currentTags.includes(tag)) {
      form.setValue('tags', [...currentTags, tag])
    }
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: ArticleFormData) => {
    if (!user) {
      toast.error('Du måste vara inloggad för att spara artikeln')
      return
    }

    setIsLoading(true)

    try {
      // Handle published_at logic
      let publishedAt = null
      if (data.published) {
        // If article is being published and wasn't published before, set current date
        // If it was already published, keep the existing date
        publishedAt = article?.published_at || new Date().toISOString()
      }

      const articleData = {
        ...data,
        author_id: user.id,
        published_at: publishedAt,
      }

      let result

      if (article) {
        // Update existing article
        result = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id)
          .select()
          .single()
      } else {
        // Create new article
        result = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single()
      }

      if (result.error) {
        throw result.error
      }

      toast.success(
        article 
          ? 'Artikel uppdaterad framgångsrikt' 
          : 'Artikel skapad framgångsrikt'
      )

      router.push(ADMIN_ROUTES.articles)
      router.refresh()
    } catch (error) {
      console.error('Error saving article:', error)
      toast.error('Ett fel uppstod när artikeln sparades')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (value: string) => {
    if (!article) { // Only auto-generate slug for new articles
      form.setValue('slug', generateSlug(value))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Skriv artikelns titel..."
                  onChange={(e) => {
                    field.onChange(e)
                    handleTitleChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL-vänlig)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="artikel-slug"
                  onChange={(e) => {
                    field.onChange(generateSlug(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sammanfattning (valfritt)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Kort sammanfattning av artikeln..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Utvald bild URL (valfritt)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://example.com/bild.jpg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Innehåll</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Skriv artikelns innehåll..."
                  className="min-h-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Section */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => {
            // Get all tags sorted by usage
            const allAvailableTags = Object.entries(tagUsage)
              .sort(([,a], [,b]) => b - a)
              .map(([tag]) => tag)
            
            return (
              <FormItem>
                <FormLabel>Taggar</FormLabel>
                <div className="space-y-4">
                  {/* Display selected tags */}
                  {field.value.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Valda taggar:</p>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Available tags */}
                  {allAvailableTags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Tillgängliga taggar:</p>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {allAvailableTags
                          .filter(tag => !field.value.includes(tag))
                          .map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="cursor-pointer hover:bg-muted text-sm"
                              onClick={() => addPredefinedTag(tag)}
                            >
                              {tag}
                              {tagUsage[tag] > 0 && (
                                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center">
                                  {tagUsage[tag]}
                                </span>
                              )}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add new tag input */}
                  <div>
                    <p className="text-sm font-medium mb-2">Lägg till ny tagg:</p>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        placeholder="Skriv ny tagg..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        size="sm"
                        disabled={!newTag.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="mt-0.5"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Publicerad
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Artikeln kommer att vara synlig på webbplatsen
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Sparar...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {article ? 'Uppdatera' : 'Skapa'} Artikel
              </>
            )}
          </Button>

          {form.watch('published') && form.watch('slug') && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const slug = form.getValues('slug')
                window.open(`/blog/${slug}`, '_blank')
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Förhandsgranska
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}