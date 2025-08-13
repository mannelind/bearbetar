'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Tag } from 'lucide-react'

type Article = Database['public']['Tables']['articles']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  author?: Database['public']['Tables']['admin_users']['Row']
}

interface BlogModalProps {
  article: Article | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BlogModal({ article, open, onOpenChange }: BlogModalProps) {
  console.log('BlogModal render:', { article: article?.title, open })
  console.log('Supabase env vars:', { 
    url: process.env.NEXT_PUBLIC_SUPABASE_URL, 
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing' 
  })
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [fullArticle, setFullArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFullArticle = useCallback(async (articleId: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        article_categories (
          categories (
            id,
            name,
            slug
          )
        ),
        article_tags (
          tags (
            id,
            name,
            slug
          )
        ),
        admin_users (
          id,
          email,
          full_name,
          bio,
          profile_image,
          avatar_url,
          created_at,
          updated_at
        )
      `)
      .eq('id', articleId)
      .single()

    if (error) {
      console.error('Error loading article:', error)
      setError('Kunde inte ladda artikeln. Försök igen senare.')
      setLoading(false)
      return
    }

    if (data) {
      const transformedArticle: Article = {
        ...data,
        categories: data.article_categories?.map((ac: any) => ac.categories).filter(Boolean) || [],
        tags: data.article_tags?.map((at: any) => at.tags).filter(Boolean) || [],
        author: data.admin_users
      }
      setFullArticle(transformedArticle)
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    if (open && article && !fullArticle) {
      loadFullArticle(article.id)
    }
    if (!open) {
      setFullArticle(null)
      setError(null)
    }
  }, [open, article, fullArticle, loadFullArticle])

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min läsning`
  }

  if (!article) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl" className="max-h-[95vh] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Laddar artikel...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => loadFullArticle(article.id)}>
              Försök igen
            </Button>
          </div>
        ) : fullArticle ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <ModalHeader className="flex-shrink-0">
              <div className="space-y-4">
                {/* Featured Image */}
                {fullArticle.featured_image && (
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <Image 
                      src={fullArticle.featured_image} 
                      alt={fullArticle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                )}

                {/* Title and Meta */}
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold leading-tight">{fullArticle.title}</h1>
                  
                  {fullArticle.excerpt && (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {fullArticle.excerpt}
                    </p>
                  )}

                  {/* Author and Date */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {fullArticle.author && (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={fullArticle.author.avatar_url || undefined} />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {fullArticle.author.full_name || fullArticle.author.email}
                            </p>
                            <p className="text-xs text-muted-foreground">Författare</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(fullArticle.created_at).toLocaleDateString('sv-SE')}
                        </div>
                        
                        {fullArticle.content && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatReadingTime(fullArticle.content)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Updated date */}
                    {fullArticle.updated_at && new Date(fullArticle.updated_at) > new Date(fullArticle.created_at) && (
                      <div className="text-xs text-muted-foreground">
                        Uppdaterad: {new Date(fullArticle.updated_at).toLocaleDateString('sv-SE')}
                      </div>
                    )}
                  </div>

                  {/* Categories and Tags */}
                  <div className="flex flex-wrap gap-2">
                    {fullArticle.categories?.map((category: any) => (
                      <Badge key={category.id} variant="default">
                        {category.name}
                      </Badge>
                    ))}
                    
                    {fullArticle.tags?.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ModalHeader>

            {/* Body with scrollable content */}
            <ModalBody className="flex-1 overflow-y-auto">
              {fullArticle.content && (
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border"
                  dangerouslySetInnerHTML={{ __html: fullArticle.content }}
                />
              )}
            </ModalBody>
          </div>
        ) : null}
      </ModalContent>
    </Modal>
  )
}