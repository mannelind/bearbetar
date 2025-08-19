'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { Modal, ModalContent } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  ExternalLink, 
  User, 
  FileText, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  List
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'] & {
  portfolio_categories?: Database['public']['Tables']['portfolio_categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  portfolio_gallery?: Database['public']['Tables']['portfolio_gallery']['Row'][]
}

interface PortfolioModalProps {
  item: PortfolioItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PortfolioModal({ item, open, onOpenChange }: PortfolioModalProps) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [fullItem, setFullItem] = useState<PortfolioItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [headings, setHeadings] = useState<Array<{id: string, text: string, level: number}>>([])
  const [activeHeading, setActiveHeading] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const loadFullItem = useCallback(async (itemId: string) => {
    setLoading(true)
    
    const { data, error } = await supabase
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
          id,
          image_url,
          caption,
          sort_order
        )
      `)
      .eq('id', itemId)
      .single()

    if (error) {
      console.error('Error loading portfolio item:', error)
      setLoading(false)
      return
    }

    if (data) {
      const transformedItem: PortfolioItem = {
        ...data,
        portfolio_categories: data.portfolio_item_categories?.map((pc: any) => pc.portfolio_categories).filter(Boolean) || [],
        tags: data.portfolio_item_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
        portfolio_gallery: data.portfolio_gallery?.map(gallery => ({
          id: gallery.id,
          portfolio_item_id: data.id,
          image_url: gallery.image_url,
          image_alt: null,
          caption: gallery.caption,
          sort_order: gallery.sort_order,
          created_at: new Date().toISOString()
        })).sort((a, b) => a.sort_order - b.sort_order) || []
      }
      setFullItem(transformedItem)
    }

    setLoading(false)
  }, [supabase])

  const loadFullItemCallback = useCallback((itemId: string) => {
    loadFullItem(itemId)
  }, [loadFullItem])

  useEffect(() => {
    if (open && item && !fullItem) {
      loadFullItemCallback(item.id)
    }
    if (!open) {
      setFullItem(null)
      setCurrentImageIndex(0)
      setHeadings([])
      setActiveHeading(null)
    }
  }, [open, item, fullItem, loadFullItemCallback])

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

  const extractHeadings = useCallback(() => {
    setTimeout(() => {
      const container = document.querySelector('[data-portfolio-content]')
      if (!container) return

      const headingElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6')

      if (headingElements.length === 0) return

      const extractedHeadings = Array.from(headingElements).map((heading, index) => {
        const text = heading.textContent?.trim() || ''
        const level = parseInt(heading.tagName.charAt(1))
        const id = `portfolio-heading-${index}`
        heading.id = id
        return { id, text, level }
      })

      setHeadings(extractedHeadings)
    }, 200)
  }, [])

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId)
    const container = document.querySelector('[data-portfolio-content]') as HTMLElement
    if (element && container) {
      const elementTop = element.offsetTop
      const containerPadding = 20
      const targetScrollTop = elementTop - containerPadding
      
      container.scrollTo({ 
        top: Math.max(0, targetScrollTop), 
        behavior: 'smooth' 
      })
    }
  }

  const updateActiveHeading = useCallback(() => {
    if (!contentRef.current || headings.length === 0) return

    const container = document.querySelector('[data-portfolio-content]')
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    let activeId = null

    for (const heading of headings) {
      const element = document.getElementById(heading.id)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top - containerRect.top <= 100) {
          activeId = heading.id
        }
      }
    }

    setActiveHeading(activeId)
    
    // Update scroll measurements for external scrollbar
    setScrollHeight(container.scrollHeight)
    setClientHeight(container.clientHeight)
    setScrollTop(container.scrollTop)
  }, [headings])

  const handleExternalScroll = useCallback((newScrollTop: number) => {
    const container = document.querySelector('[data-portfolio-content]')
    if (container) {
      container.scrollTop = newScrollTop
    }
  }, [])

  useEffect(() => {
    if (open && fullItem) {
      setTimeout(() => {
        extractHeadings()
      }, 100)
    }
  }, [open, fullItem, extractHeadings])

  const allImages = fullItem ? [
    ...(fullItem.featured_image ? [{ url: fullItem.featured_image, caption: 'Huvudbild' }] : []),
    ...(fullItem.portfolio_gallery?.map(img => ({ url: img.image_url, caption: img.caption })) || [])
  ] : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  if (!item) return null

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent size="full" className="overflow-hidden h-[75vh] max-w-5xl p-0">
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Laddar projektdetaljer...</p>
          </div>
        ) : fullItem ? (
          <div className="relative flex flex-col md:flex-row h-full">
            {/* Mobile: Top section, Desktop: Left 40% - Image Gallery + Metadata */}
            <div className="w-full md:w-2/5 flex-shrink-0 flex flex-col md:max-h-full max-h-[40vh] md:border-r border-b md:border-b-0 border-border">
              {/* Image Gallery */}
              <div className="flex-1">
                {allImages.length > 0 ? (
                  <div className="relative h-full bg-background">
                    <Image 
                      src={allImages[currentImageIndex]?.url || ''} 
                      alt={allImages[currentImageIndex]?.caption || fullItem.title}
                      fill
                      className="object-contain"
                      sizes="40vw"
                    />
                    
                    {allImages.length > 1 && (
                      <>
                        {/* Navigation buttons */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                          onClick={previousImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Image counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {allImages.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-full bg-background flex items-center justify-center">
                    <div className="text-muted-foreground text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p>Ingen bild tillgänglig</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Metadata under image */}
              <div className="p-3 md:p-4 space-y-2 md:space-y-3 border-t border-border bg-muted/20">
                {/* Project Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={fullItem.project_type === 'case_study' ? 'default' : 'secondary'} className="text-xs">
                    {fullItem.project_type === 'case_study' ? (
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
                </div>
                
                {/* Client and Date */}
                <div className="space-y-2">
                  {fullItem.client_name && (
                    <div className="flex items-center gap-2 md:gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs md:text-sm font-medium">{fullItem.client_name}</p>
                        <p className="text-xs text-muted-foreground hidden md:block">Kund</p>
                      </div>
                    </div>
                  )}
                  
                  {fullItem.completion_date && (
                    <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{new Date(fullItem.completion_date).toLocaleDateString('sv-SE')}</span>
                    </div>
                  )}
                </div>
                
                {/* Categories and Tags */}
                <div className="space-y-2">
                  {fullItem.portfolio_categories && fullItem.portfolio_categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {fullItem.portfolio_categories.map((category: any) => (
                        <Badge key={category.id} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {fullItem.tags && fullItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {fullItem.tags.map((tag: any) => (
                        <ColoredBadge key={tag.id} tag={tag.name} className="text-xs" />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Project URL */}
                {fullItem.project_url && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(fullItem.project_url!, '_blank')}
                    className="w-full text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Besök projekt
                  </Button>
                )}
                
                {/* Thumbnail strip for mobile */}
                {allImages.length > 1 && (
                  <div className="md:hidden">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-colors relative",
                            index === currentImageIndex ? "border-primary" : "border-transparent"
                          )}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image 
                            src={img.url} 
                            alt={img.caption || `Bild ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Bottom section, Desktop: Right 60% - Content */}
            <div className="w-full md:w-3/5 flex-shrink-0 flex flex-col overflow-hidden flex-1">
              <div className="flex-1 p-4 md:pl-6 md:py-6 md:pr-6 overflow-hidden">
                <div 
                  className="h-full overflow-y-auto space-y-6"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  data-portfolio-content
                  onScroll={updateActiveHeading}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                
                  {/* Title and Meta */}
                  <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                    <h1 className="text-lg md:text-2xl font-bold leading-tight">{fullItem.title}</h1>
                    
                    {fullItem.excerpt && (
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {fullItem.excerpt}
                      </p>
                    )}
                  </div>

                    {/* Content */}
                    {fullItem.description && (
                      <div>
                        <h3 className="text-base md:text-lg font-semibold mb-2">Beskrivning</h3>
                        <div 
                          ref={contentRef}
                          className="prose prose-xs md:prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-headings:text-sm md:prose-headings:text-base"
                          dangerouslySetInnerHTML={{ __html: fullItem.description }}
                        />
                      </div>
                    )}

                    {fullItem.project_type === 'case_study' && fullItem.case_study_content && (
                      <div>
                        <h3 className="text-base md:text-lg font-semibold mb-2">Case Study</h3>
                        <div 
                          className="prose prose-xs md:prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-headings:text-sm md:prose-headings:text-base"
                          dangerouslySetInnerHTML={{ __html: fullItem.case_study_content }}
                        />
                      </div>
                    )}

                    {fullItem.technologies_used && (
                      <div>
                        <h3 className="text-base md:text-lg font-semibold mb-2">Teknologier</h3>
                        <div className="flex flex-wrap gap-2">
                          {fullItem.technologies_used.split(',').map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        ) : null}
        </ModalContent>
      </Modal>

      {/* External Navigation Menu */}
      {mounted && open && fullItem && headings.length > 0 && createPortal(
        <div className="fixed top-1/2 right-4 -translate-y-1/2 w-56 z-[999] hidden lg:block">
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
                    ? 'text-primary font-medium border-primary/20' 
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

      {/* External Scrollbar rendered via Portal to ensure highest z-index - Hidden on mobile */}
      {mounted && open && fullItem && scrollHeight > clientHeight && createPortal(
        <div className="fixed top-1/2 right-[15rem] -translate-y-1/2 w-1 h-[75vh] z-[999] hidden lg:block">
          <div className="relative h-full w-full bg-background border rounded-full">
            <div
              className="absolute left-0 w-full bg-muted-foreground/50 rounded-full cursor-pointer hover:bg-muted-foreground/70 transition-colors"
              style={{
                height: `${Math.max((clientHeight / scrollHeight) * 100, 10)}%`,
                top: `${(scrollTop / scrollHeight) * 100}%`
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                const startY = e.clientY
                const startScrollTop = scrollTop
                const scrollRatio = scrollHeight / clientHeight

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaY = e.clientY - startY
                  const newScrollTop = Math.max(0, Math.min(
                    scrollHeight - clientHeight,
                    startScrollTop + (deltaY * scrollRatio)
                  ))
                  handleExternalScroll(newScrollTop)
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
        </div>,
        document.body
      )}
    </>
  )
}