'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { Modal, ModalContent } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  ImageIcon,
  Cog,
  MapPin
} from 'lucide-react'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'] & {
  portfolio_categories?: Database['public']['Tables']['portfolio_categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  portfolio_gallery?: Database['public']['Tables']['portfolio_gallery']['Row'][]
}

interface PortfolioModalEnhancedProps {
  item: PortfolioItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ContentSection {
  id: string
  title: string
  content: string
  imageIndex?: number // Which gallery image corresponds to this section
}

export function PortfolioModalEnhanced({ item, open, onOpenChange }: PortfolioModalEnhancedProps) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const [fullItem, setFullItem] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [mounted, setMounted] = useState(false)
  
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLElement }>({})

  const loadFullItem = useCallback(async (itemId: string) => {
    setLoading(true)
    setError(null)
    
    try {
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
            image_alt,
            caption,
            sort_order
          )
        `)
        .eq('id', itemId)
        .single()

      if (error) {
        console.error('Error loading portfolio item:', error)
        setError('Kunde inte ladda projektet. Försök igen senare.')
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
            image_alt: gallery.image_alt,
            caption: gallery.caption,
            sort_order: gallery.sort_order,
            created_at: new Date().toISOString()
          })).sort((a, b) => a.sort_order - b.sort_order) || []
        }
        setFullItem(transformedItem)
        
        // Parse content into sections with corresponding images
        parseContentSections(transformedItem)
      }
    } catch (err) {
      console.error('Error loading portfolio item:', err)
      setError('Anslutningen misslyckades. Kontrollera din internetanslutning och försök igen.')
    }

    setLoading(false)
  }, [supabase])

  // Parse content into sections and map to gallery images
  const parseContentSections = (item: PortfolioItem): void => {
    if (!item.description) {
      setContentSections([])
      return
    }

    const sections: ContentSection[] = []
    
    // Split content by h2 headings
    const contentParts = item.description.split(/<h2[^>]*>(.*?)<\/h2>/gi)
    
    if (contentParts.length > 1) {
      // First part is intro (before first h2)
      if (contentParts[0].trim()) {
        sections.push({
          id: 'intro',
          title: 'Introduktion',
          content: contentParts[0].trim(),
          imageIndex: 0
        })
      }
      
      // Process h2 sections
      for (let i = 1; i < contentParts.length; i += 2) {
        const title = contentParts[i]
        const content = contentParts[i + 1] || ''
        
        if (title && content.trim()) {
          const sectionIndex = Math.floor(sections.length)
          sections.push({
            id: title.toLowerCase().replace(/[^a-z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '-'),
            title: title,
            content: content.trim(),
            imageIndex: sectionIndex % (item.portfolio_gallery?.length || 1)
          })
        }
      }
    } else {
      // No h2 headings, treat as single section
      sections.push({
        id: 'content',
        title: 'Projektbeskrivning',
        content: item.description,
        imageIndex: 0
      })
    }

    setContentSections(sections)
  }

  // Handle scroll to update current image based on visible section
  const handleScroll = useCallback(() => {
    if (!contentRef.current || contentSections.length === 0) return

    const scrollTop = contentRef.current.scrollTop
    const containerHeight = contentRef.current.clientHeight
    const scrollCenter = scrollTop + containerHeight / 2

    // Find which section is most visible
    let currentSection = contentSections[0]
    let minDistance = Infinity

    contentSections.forEach((section) => {
      const element = sectionRefs.current[section.id]
      if (element) {
        const rect = element.getBoundingClientRect()
        const containerRect = contentRef.current!.getBoundingClientRect()
        const elementTop = rect.top - containerRect.top + scrollTop
        const elementCenter = elementTop + rect.height / 2
        const distance = Math.abs(elementCenter - scrollCenter)
        
        if (distance < minDistance) {
          minDistance = distance
          currentSection = section
        }
      }
    })

    // Update image if section has changed
    if (currentSection.imageIndex !== undefined && currentSection.imageIndex !== currentImageIndex) {
      setCurrentImageIndex(currentSection.imageIndex)
    }
  }, [contentSections, currentImageIndex])

  // Throttled scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const throttledScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    const container = contentRef.current
    if (container) {
      container.addEventListener('scroll', throttledScroll)
      return () => {
        container.removeEventListener('scroll', throttledScroll)
        clearTimeout(timeoutId)
      }
    }
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [handleScroll])

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    const container = contentRef.current
    
    if (!container || !element) return

    const containerRect = container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const scrollOffset = elementRect.top - containerRect.top + container.scrollTop - 20

    container.scrollTo({
      top: scrollOffset,
      behavior: 'smooth'
    })
  }

  // Navigate gallery
  const nextImage = () => {
    if (!fullItem?.portfolio_gallery) return
    setCurrentImageIndex((prev) => (prev + 1) % fullItem.portfolio_gallery!.length)
  }

  const prevImage = () => {
    if (!fullItem?.portfolio_gallery) return
    setCurrentImageIndex((prev) => (prev - 1 + fullItem.portfolio_gallery!.length) % fullItem.portfolio_gallery!.length)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open && item && !fullItem) {
      loadFullItem(item.id)
      setCurrentImageIndex(0)
    }
    if (!open) {
      setFullItem(null)
      setError(null)
      setContentSections([])
      setCurrentImageIndex(0)
    }
  }, [open, item, fullItem, loadFullItem])

  if (!item) return null

  const currentGalleryItem = fullItem?.portfolio_gallery?.[currentImageIndex]
  const hasGallery = fullItem?.portfolio_gallery && fullItem.portfolio_gallery.length > 0

  // Quick navigation links
  const quickLinks = contentSections.map(section => ({
    id: section.id,
    label: section.title,
    icon: <FileText className="h-3 w-3" />
  }))

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent size="full" className="overflow-hidden h-[85vh] max-w-7xl p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
              <p className="text-muted-foreground">Laddar projekt...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => item && loadFullItem(item.id)}>
                Försök igen
              </Button>
            </div>
          ) : (
            <div className="relative flex h-full">
              {/* Left 45% - Image Gallery + Metadata */}
              <div className="w-[45%] flex-shrink-0 flex flex-col bg-muted/30">
                {/* Image Gallery */}
                <div className="flex-1 relative bg-background">
                  {hasGallery ? (
                    <>
                      {/* Main Image */}
                      <div className="relative h-full">
                        <Image 
                          src={currentGalleryItem?.image_url || fullItem?.featured_image || ''} 
                          alt={currentGalleryItem?.image_alt || fullItem?.title || ''}
                          fill
                          className="object-contain"
                          sizes="45vw"
                        />
                        
                        {/* Navigation arrows */}
                        {fullItem?.portfolio_gallery && fullItem.portfolio_gallery.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white transition-colors"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white transition-colors"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        {/* Image counter */}
                        {fullItem?.portfolio_gallery && fullItem.portfolio_gallery.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-white text-sm">
                            {currentImageIndex + 1} / {fullItem.portfolio_gallery.length}
                          </div>
                        )}
                      </div>
                      
                      {/* Thumbnail Strip */}
                      {fullItem?.portfolio_gallery && fullItem.portfolio_gallery.length > 1 && (
                        <div className="p-4 bg-background border-t">
                          <div className="flex gap-2 overflow-x-auto">
                            {fullItem.portfolio_gallery.map((galleryItem, index) => (
                              <button
                                key={galleryItem.id}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                                  index === currentImageIndex 
                                    ? 'border-primary' 
                                    : 'border-border hover:border-muted-foreground'
                                }`}
                              >
                                <Image
                                  src={galleryItem.image_url}
                                  alt={galleryItem.image_alt || `Bild ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-muted">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                        <p>Inga bilder tillgängliga</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Metadata Panel */}
                <div className="p-6 space-y-4 border-t bg-background">
                  {/* Project Type */}
                  <Badge variant={fullItem?.project_type === 'case_study' ? 'default' : 'secondary'}>
                    {fullItem?.project_type === 'case_study' ? (
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

                  {/* Client and Date */}
                  <div className="space-y-2">
                    {fullItem?.client_name && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{fullItem.client_name}</span>
                      </div>
                    )}
                    
                    {fullItem?.completion_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Slutfört: {new Date(fullItem.completion_date).toLocaleDateString('sv-SE')}</span>
                      </div>
                    )}
                  </div>

                  {/* Project URL */}
                  {fullItem?.project_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(fullItem.project_url!, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Besök projekt
                    </Button>
                  )}
                  
                  {/* Technologies */}
                  {fullItem?.technologies_used && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Cog className="h-4 w-4" />
                        Teknologier
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {fullItem.technologies_used.split(',').map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories and Tags */}
                  {((fullItem?.portfolio_categories?.length) || (fullItem?.tags?.length)) && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Kategorier & Taggar</h4>
                      <div className="flex flex-wrap gap-2">
                        {fullItem?.portfolio_categories?.map((category) => (
                          <Badge key={category.id} variant="default" className="text-xs">
                            {category.name}
                          </Badge>
                        ))}
                        
                        {fullItem?.tags?.map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right 55% - Content */}
              <div className="w-[55%] flex flex-col overflow-hidden">
                <div className="flex-1 p-6 overflow-hidden">
                  <div 
                    ref={contentRef}
                    className="h-full overflow-y-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                  
                    {/* Title and Excerpt */}
                    <div className="space-y-4 mb-8">
                      <h1 className="text-3xl font-bold leading-tight">{fullItem?.title}</h1>
                      
                      {fullItem?.excerpt && (
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {fullItem.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Content Sections */}
                    {contentSections.map((section, index) => (
                      <div 
                        key={section.id}
                        ref={(el) => { if (el) sectionRefs.current[section.id] = el }}
                        className="mb-8 scroll-mt-4"
                      >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          {section.title}
                        </h2>
                        <div 
                          className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    ))}

                    {/* Case Study Content */}
                    {fullItem?.case_study_content && (
                      <div className="mt-8 pt-6 border-t">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Detaljerad Case Study
                        </h2>
                        <div 
                          className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
                          dangerouslySetInnerHTML={{ __html: fullItem.case_study_content }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Quick Navigation - Floating on the right */}
      {mounted && open && quickLinks.length > 0 && (
        <div className="fixed top-1/2 right-8 -translate-y-1/2 z-[999] w-48">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Innehållsförteckning
            </div>
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-muted transition-colors text-left w-full"
                  title={link.label}
                >
                  {link.icon && <span className="flex-shrink-0">{link.icon}</span>}
                  <span className="truncate">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}