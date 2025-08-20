'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { Modal, ModalContent } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { POST_TYPE_CONFIG } from '@/types'
import { Calendar, Clock, User, List } from 'lucide-react'

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
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [headings, setHeadings] = useState<Array<{id: string, text: string, level: number}>>([])
  const [activeHeading, setActiveHeading] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const loadFullArticle = useCallback(async (articleId: string) => {
    setLoading(true)
    setError(null)
    
    try {
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
        
        // If this is development and we're using mock data, create a mock full article
        if (process.env.NODE_ENV === 'development' && article) {
          console.log('Using mock article data for development...')
          const mockFullArticle: Article = {
            ...article,
            content: `<div class="space-y-6">
              <p>Detta är mock-innehåll för artikeln "<strong>${article.title}</strong>" i utvecklingsläge.</p>
              
              <p>I en riktig miljö skulle detta innehåll komma från Supabase-databasen och innehålla den fullständiga artikeltexten med formatering. Detta är en mycket lång text som ska visa hur scrollbaren fungerar när innehållet är längre än vad som får plats i modal-fönstret.</p>
              
              <h2>Om denna artikel</h2>
              <p>${article.excerpt || 'Ingen sammanfattning tillgänglig.'}</p>
              
              <p>Detta är bara en demonstration av hur modal-fönstret fungerar när en artikel öppnas. Vi vill se till att scrollbaren visas korrekt när innehållet är för långt för att få plats i modal-fönstret.</p>
              
              <h2>Mer innehåll för att testa scrollning</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              
              <h2>Ännu mer text</h2>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              
              <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
              
              <h2>Tekniska detaljer</h2>
              <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
              
              <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?</p>
              
              <h2>Sammanfattning</h2>
              <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
              
              <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
              
              <blockquote class="border-l-4 border-primary pl-4 italic">
                "I produktionsmiljön kommer detta att ersättas med verkligt innehåll från databasen. Detta längre mock-innehåll hjälper oss att testa scrollning-funktionaliteten."
              </blockquote>
              
              <h2>Slutkommentar</h2>
              <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
              
              <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
            </div>`,
            categories: [],
            tags: [],
            author: {
              id: 'mock',
              email: 'demo@bearbetar.se',
              full_name: 'Demo Författare',
              bio: 'Detta är en demo-författare för utvecklingsläge.',
              profile_image: null,
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
          setFullArticle(mockFullArticle)
          setLoading(false)
          return
        }
        
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
        console.log('FullArticle transformed:', { 
          fullArticleTags: transformedArticle.tags, 
          fullArticleCategories: transformedArticle.categories 
        })
        setFullArticle(transformedArticle)
      }
    } catch (err) {
      console.error('Supabase connection failed:', err)
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development' && article) {
        console.log('Using mock article data as fallback...')
        const mockFullArticle: Article = {
          ...article,
          content: `<div class="space-y-6">
            <p>Detta är mock-innehåll för artikeln "<strong>${article.title}</strong>" (fallback-läge).</p>
            
            <p>Supabase-anslutningen misslyckades, så vi visar mock-data istället i utvecklingsläge. Detta är en mycket lång text som ska visa hur scrollbaren fungerar när innehållet är längre än vad som får plats i modal-fönstret.</p>
            
            <h2>Artikel-sammanfattning</h2>
            <p>${article.excerpt || 'Ingen sammanfattning tillgänglig.'}</p>
            
            <p>I produktionsmiljön skulle detta visa det verkliga innehållet från databasen. Vi vill se till att scrollbaren visas korrekt när innehållet är för långt för att få plats i modal-fönstret.</p>
            
            <h2>Ytterligare innehåll för scrolltest</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
            <h2>Mer test-innehåll</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            
            <h2>Fallback-läge information</h2>
            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?</p>
          </div>`,
          categories: [],
          tags: [],
          author: {
            id: 'mock',
            email: 'demo@bearbetar.se',
            full_name: 'Demo Författare',
            bio: 'Mock-författare för utvecklingsläge.',
            profile_image: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
        setFullArticle(mockFullArticle)
      } else {
        setError('Anslutningen misslyckades. Kontrollera din internetanslutning och försök igen.')
      }
    }

    setLoading(false)
  }, [supabase, article])

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollTop(target.scrollTop)
    setScrollHeight(target.scrollHeight)
    setClientHeight(target.clientHeight)
    updateActiveHeading()
  }

  const handleScrollbarDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = document.getElementById('article-content')
    if (!container) return

    const scrollbar = e.currentTarget
    const rect = scrollbar.getBoundingClientRect()
    const percentage = (e.clientY - rect.top) / rect.height
    const maxScroll = scrollHeight - clientHeight
    container.scrollTop = percentage * maxScroll
  }

  const extractHeadings = useCallback(() => {
    // Wait a bit for content to be fully rendered with dangerouslySetInnerHTML
    setTimeout(() => {
      const container = document.getElementById('article-content')
      if (!container) return

      const headingElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6')

      if (headingElements.length === 0) return

      const extractedHeadings = Array.from(headingElements).map((heading, index) => {
        const text = heading.textContent?.trim() || ''
        const level = parseInt(heading.tagName.charAt(1))
        const id = `blog-heading-${index}`
        heading.id = id
        return { id, text, level }
      })

      setHeadings(extractedHeadings)
    }, 200) // Increased timeout to ensure HTML is rendered
  }, [])

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId)
    const container = document.getElementById('article-content')
    
    if (element && container) {
      // Calculate the position relative to the container's scroll area
      const elementTop = element.offsetTop
      const containerPadding = 24 // Add padding from the top
      const targetScrollTop = Math.max(0, elementTop - containerPadding)
      
      // Scroll to the heading with smooth animation
      container.scrollTo({ 
        top: targetScrollTop, 
        behavior: 'smooth' 
      })
      
      // Update active heading immediately to provide visual feedback
      setTimeout(() => {
        updateActiveHeading()
      }, 100)
    }
  }

  const updateActiveHeading = useCallback(() => {
    if (!contentRef.current || headings.length === 0) return

    const container = document.getElementById('article-content')
    if (!container) return

    const scrollTop = container.scrollTop
    let activeId = null

    // Find the heading that's currently visible in the viewport
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i]
      const element = document.getElementById(heading.id)
      if (element) {
        const elementTop = element.offsetTop
        if (scrollTop >= elementTop - 50) {
          activeId = heading.id
          break
        }
      }
    }

    // If no heading is found, use the first one if we're at the top
    if (!activeId && scrollTop < 50 && headings.length > 0) {
      activeId = headings[0].id
    }

    setActiveHeading(activeId)
  }, [headings])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [open])

  useEffect(() => {
    if (open && fullArticle) {
      setTimeout(() => {
        const container = document.getElementById('article-content')
        if (container) {
          setScrollHeight(container.scrollHeight)
          setClientHeight(container.clientHeight)
          setScrollTop(container.scrollTop)
        }
      }, 100)
      
      // Extract headings with a longer delay to ensure dangerouslySetInnerHTML content is rendered
      extractHeadings()
    }
    if (!open) {
      setHeadings([])
      setActiveHeading(null)
    }
  }, [open, fullArticle, extractHeadings])

  if (!article) return null

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent size="full" className="overflow-hidden h-[75vh] max-w-5xl p-0">
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
          <div className="relative flex flex-col md:flex-row h-full">
            {/* Mobile: Top section, Desktop: Left 40% - Featured Image + Metadata */}
            <div className="w-full md:w-2/5 flex-shrink-0 flex flex-col md:h-full h-auto md:border-r border-b md:border-b-0 border-border">
              {/* Image section */}
              <div className="h-48 md:h-64 relative bg-muted">
                {fullArticle.featured_image ? (
                  <Image 
                    src={fullArticle.featured_image} 
                    alt={fullArticle.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-muted-foreground text-center">
                      <div className="text-4xl mb-2">📰</div>
                      <p>Ingen bild tillgänglig</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Metadata section - scrollable on desktop if content is long */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
                {/* Article Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const config = POST_TYPE_CONFIG[fullArticle.post_type as keyof typeof POST_TYPE_CONFIG] || POST_TYPE_CONFIG.artikel
                    return (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/10">
                        {config.label}
                      </Badge>
                    )
                  })()}
                </div>
                
                {/* Author */}
                {fullArticle.author && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={fullArticle.author.avatar_url || undefined} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
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
                
                {/* Categories */}
                {((fullArticle.categories && fullArticle.categories.length > 0) || (article.categories && article.categories.length > 0)) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Kategorier</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(fullArticle.categories && fullArticle.categories.length > 0 ? fullArticle.categories : article.categories)?.map((category: any) => (
                        <Badge key={category.id} variant="secondary" className="text-xs hover:bg-secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Date and Reading time */}
                <div className="pt-3 border-t border-border">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(fullArticle.created_at).toLocaleDateString('sv-SE')}</span>
                    </div>
                    
                    {fullArticle.content && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatReadingTime(fullArticle.content)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Article Tags - Show all tags generated when article was created */}
                {((fullArticle.tags && fullArticle.tags.length > 0) || (article.tags && article.tags.length > 0)) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Taggar</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(fullArticle.tags && fullArticle.tags.length > 0 ? fullArticle.tags : article.tags)?.map((tag: any, index: number) => {
                        // Handle both string array (from ArticleCard) and object array (from database)
                        const tagName = typeof tag === 'string' ? tag : tag.name || tag
                        const tagKey = typeof tag === 'string' ? `${tagName}-${index}` : tag.id || `${tagName}-${index}`
                        return (
                          <ColoredBadge key={tagKey} tag={tagName} className="text-xs hover:bg-current" />
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Updated date - moved to bottom */}
                {fullArticle.updated_at && new Date(fullArticle.updated_at) > new Date(fullArticle.created_at) && (
                  <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                    Uppdaterad: {new Date(fullArticle.updated_at).toLocaleDateString('sv-SE')}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Bottom section, Desktop: Right 60% - Content */}
            <div className="w-full md:w-3/5 flex flex-col overflow-hidden relative">
              <div className="flex-1 p-6 overflow-hidden relative">
                <div 
                  id="article-content" 
                  className="h-full overflow-y-auto pr-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={handleScroll}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                
                  {/* Title and Meta */}
                  <div className="space-y-4 mb-6">
                    <h1 className="text-2xl font-bold leading-tight">{fullArticle.title}</h1>
                    
                    {fullArticle.excerpt && (
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {fullArticle.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Article Content */}
                  {fullArticle.content && (
                    <div 
                      ref={contentRef}
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border"
                      dangerouslySetInnerHTML={{ __html: fullArticle.content }}
                    />
                  )}
                </div>
                
                {/* Scrollbar inside content area */}
                {scrollHeight > clientHeight && (
                  <div className="absolute right-0 top-0 bottom-0 w-2 hidden lg:block">
                    <div className="relative h-full w-full bg-background/50 rounded-sm">
                      <div
                        className="absolute right-0 w-1 bg-muted-foreground/60 cursor-pointer hover:bg-muted-foreground/80 transition-colors rounded-sm"
                        style={{
                          height: `${Math.max(20, (clientHeight / scrollHeight) * 100)}%`,
                          top: `${(scrollTop / (scrollHeight - clientHeight)) * (100 - Math.max(20, (clientHeight / scrollHeight) * 100))}%`
                        }}
                        onClick={handleScrollbarDrag}
                        onMouseDown={(e) => {
                          const startY = e.clientY
                          const startScrollTop = scrollTop
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const container = document.getElementById('article-content')
                            if (!container) return
                            
                            const deltaY = e.clientY - startY
                            const scrollbarHeight = clientHeight - (clientHeight / scrollHeight) * clientHeight
                            const scrollRatio = deltaY / scrollbarHeight
                            const newScrollTop = Math.max(0, Math.min(scrollHeight - clientHeight, startScrollTop + scrollRatio * (scrollHeight - clientHeight)))
                            
                            container.scrollTop = newScrollTop
                          }
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove)
                            document.removeEventListener('mouseup', handleMouseUp)
                          }
                          
                          document.addEventListener('mousemove', handleMouseMove)
                          document.addEventListener('mouseup', handleMouseUp)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        </ModalContent>
      

      {/* External Navigation Menu - Hidden on mobile, shown as expandable menu */}
      {mounted && open && fullArticle && headings.length > 0 && createPortal(
        <div className="fixed top-1/2 right-12 -translate-y-1/2 w-56 z-[999] hidden lg:block">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
            <List className="h-4 w-4" />
            Innehåll
          </div>
          <nav className="space-y-1 max-h-[60vh] overflow-y-auto bg-background/90 backdrop-blur-sm border rounded-lg p-3">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  w-full text-left text-xs px-2 py-1.5 transition-colors border border-transparent
                  ${activeHeading === heading.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:border-muted/30'
                  }
                `}
                style={{ paddingLeft: `${(heading.level - 1) * 8 + 8}px` }}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>,
        document.body
      )}
      </Modal>

    </>
  )
}