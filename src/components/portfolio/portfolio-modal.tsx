'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
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
  }, [headings])

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
        <ModalContent size="xl" className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Laddar projektdetaljer...</p>
          </div>
        ) : fullItem ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <ModalHeader className="flex-shrink-0">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{fullItem.title}</h2>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {fullItem.client_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {fullItem.client_name}
                        </div>
                      )}
                      
                      {fullItem.completion_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(fullItem.completion_date).toLocaleDateString('sv-SE')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Badge variant={fullItem.project_type === 'case_study' ? 'default' : 'secondary'}>
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

                {/* Categories and Tags */}
                <div className="flex flex-wrap gap-2">
                  {fullItem.portfolio_categories?.map((category: any) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                  
                  {fullItem.tags?.map((tag: any) => (
                    <Badge key={tag.id} variant="secondary">
                      #{tag.name}
                    </Badge>
                  ))}
                </div>

                {/* Project URL */}
                {fullItem.project_url && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(fullItem.project_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Besök projekt
                  </Button>
                )}
              </div>
            </ModalHeader>

            {/* Body with scrollable content */}
            <ModalBody className="flex-1 overflow-y-auto space-y-6" data-portfolio-content onScroll={updateActiveHeading}>
              {/* Image Gallery */}
              {allImages.length > 0 && (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <Image 
                      src={allImages[currentImageIndex]?.url || ''} 
                      alt={allImages[currentImageIndex]?.caption || fullItem.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
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

                  {/* Image caption */}
                  {allImages[currentImageIndex]?.caption && (
                    <p className="text-sm text-muted-foreground text-center">
                      {allImages[currentImageIndex].caption}
                    </p>
                  )}

                  {/* Thumbnail strip */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          className={cn(
                            "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                            index === currentImageIndex ? "border-primary" : "border-transparent"
                          )}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image 
                            src={img.url} 
                            alt={img.caption || `Bild ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="space-y-4">
                {fullItem.excerpt && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sammanfattning</h3>
                    <p className="text-muted-foreground">{fullItem.excerpt}</p>
                  </div>
                )}
                
                {fullItem.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Beskrivning</h3>
                    <div 
                      ref={contentRef}
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: fullItem.description }}
                    />
                  </div>
                )}

                {fullItem.project_type === 'case_study' && fullItem.case_study_content && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Case Study</h3>
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: fullItem.case_study_content }}
                    />
                  </div>
                )}

                {fullItem.technologies_used && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Teknologier</h3>
                    <div className="flex flex-wrap gap-2">
                      {fullItem.technologies_used.split(',').map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
          </div>
        ) : null}
        </ModalContent>
      </Modal>

      {/* External Navigation Menu */}
      {mounted && open && fullItem && headings.length > 0 && createPortal(
        <div className="fixed top-1/2 right-8 -translate-y-1/2 w-56 z-[999]">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
            <List className="h-4 w-4" />
            Innehåll
          </div>
          <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
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
    </>
  )
}