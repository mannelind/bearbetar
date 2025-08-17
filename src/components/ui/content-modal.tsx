'use client'

import { useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Modal, ModalContent } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Tag, ArrowRight, FileText, Briefcase, FolderOpen } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  excerpt?: string
  featured_image?: string
  created_at: string
  updated_at?: string
  content?: string
  categories?: Array<{ id: string; name: string }>
  tags?: Array<{ id: string; name: string }>
  author?: {
    full_name?: string
    email?: string
    avatar_url?: string
  }
  [key: string]: any // Allow additional properties for different content types
}

interface QuickLink {
  id: string
  label: string
  icon?: ReactNode
}

interface RelatedItem {
  id: string
  title: string
  excerpt?: string
  featured_image?: string
  type: 'article' | 'portfolio' | 'service' | 'other'
  url?: string // For external links
  onClick?: () => void // For internal navigation
}

interface ContentModalProps {
  item: ContentItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  showReadingTime?: boolean
  showAuthor?: boolean
  showDates?: boolean
  showCategories?: boolean
  showTags?: boolean
  additionalMetadata?: ReactNode
  quickLinks?: QuickLink[]
  relatedItems?: RelatedItem[]
  className?: string
}

export function ContentModal({
  item,
  open,
  onOpenChange,
  loading = false,
  error = null,
  onRetry,
  showReadingTime = true,
  showAuthor = true,
  showDates = true,
  showCategories = true,
  showTags = true,
  additionalMetadata,
  quickLinks = [],
  relatedItems = [],
  className
}: ContentModalProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)
  const [mounted, setMounted] = useState(false)

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
  }

  const handleScrollbarDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = document.getElementById('content-scroll-area')
    if (!container) return

    const scrollbar = e.currentTarget
    const rect = scrollbar.getBoundingClientRect()
    const percentage = (e.clientY - rect.top) / rect.height
    const maxScroll = scrollHeight - clientHeight
    container.scrollTop = percentage * maxScroll
  }

  const scrollToSection = (sectionId: string) => {
    const container = document.getElementById('content-scroll-area')
    const section = document.getElementById(sectionId)
    
    if (!container || !section) return

    const containerRect = container.getBoundingClientRect()
    const sectionRect = section.getBoundingClientRect()
    const scrollOffset = sectionRect.top - containerRect.top + container.scrollTop - 20 // 20px offset

    container.scrollTo({
      top: scrollOffset,
      behavior: 'smooth'
    })
  }

  // Function to add IDs to headings in HTML content
  const processContentWithAnchors = (htmlContent: string) => {
    if (!htmlContent) return htmlContent
    
    // Add IDs to h1, h2, h3 elements
    return htmlContent
      .replace(/<h1([^>]*)>(.*?)<\/h1>/gi, (_, attrs, content) => {
        const id = content.toLowerCase().replace(/[^a-z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '-')
        return `<h1${attrs} id="${id}">${content}</h1>`
      })
      .replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_, attrs, content) => {
        const id = content.toLowerCase().replace(/[^a-z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '-')
        return `<h2${attrs} id="${id}">${content}</h2>`
      })
      .replace(/<h3([^>]*)>(.*?)<\/h3>/gi, (_, attrs, content) => {
        const id = content.toLowerCase().replace(/[^a-z0-9åäöÅÄÖ\s]/g, '').replace(/\s+/g, '-')
        return `<h3${attrs} id="${id}">${content}</h3>`
      })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open && item) {
      setTimeout(() => {
        const container = document.getElementById('content-scroll-area')
        if (container) {
          setScrollHeight(container.scrollHeight)
          setClientHeight(container.clientHeight)
          setScrollTop(container.scrollTop)
        }
      }, 100)
    }
  }, [open, item])

  if (!item) return null

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent size="full" className={`overflow-hidden h-[75vh] max-w-5xl p-0 ${className || ''}`}>
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Laddar innehåll...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry}>
                Försök igen
              </Button>
            )}
          </div>
        ) : (
          <div className="relative flex h-full">
            {/* Left 40% - Featured Image + Metadata */}
            <div className="w-2/5 flex-shrink-0 flex flex-col">
              {/* Image */}
              <div className="flex-1">
                {item.featured_image ? (
                  <div className="relative h-full bg-background">
                    <Image 
                      src={item.featured_image} 
                      alt={item.title}
                      fill
                      className="object-contain"
                      sizes="40vw"
                    />
                  </div>
                ) : (
                  <div className="h-full bg-background flex items-center justify-center">
                    <div className="text-muted-foreground text-center">
                      <div className="text-4xl mb-2">📄</div>
                      <p>Ingen bild tillgänglig</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* All metadata under image */}
              <div className="p-4 space-y-4 border-t border-border">
                {/* Author */}
                {showAuthor && item.author && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.author.avatar_url || undefined} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {item.author.full_name || item.author.email}
                      </p>
                      <p className="text-xs text-muted-foreground">Författare</p>
                    </div>
                  </div>
                )}
                
                {/* Date and Reading time */}
                {showDates && (
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.created_at).toLocaleDateString('sv-SE')}
                    </div>
                    
                    {showReadingTime && item.content && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatReadingTime(item.content)}
                      </div>
                    )}
                  </div>
                )}

                {/* Updated date */}
                {showDates && item.updated_at && new Date(item.updated_at) > new Date(item.created_at) && (
                  <div className="text-xs text-muted-foreground">
                    Uppdaterad: {new Date(item.updated_at).toLocaleDateString('sv-SE')}
                  </div>
                )}

                {/* Categories and Tags - Always show all together */}
                {((showCategories && item.categories?.length) || (showTags && item.tags?.length)) && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Kategorier & Taggar
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {showCategories && item.categories?.map((category) => (
                        <Badge key={category.id} variant="default" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                      
                      {showTags && item.tags?.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional metadata */}
                {additionalMetadata}
              </div>
            </div>

            {/* Right 60% - Content */}
            <div className="w-3/5 flex flex-col overflow-hidden">
              <div className="flex-1 pl-6 py-6 pr-6 overflow-hidden">
                <div 
                  id="content-scroll-area" 
                  className="h-full overflow-y-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={handleScroll}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                
                  {/* Title and Meta */}
                  <div className="space-y-4 mb-6" id="content-top">
                    <h1 className="text-2xl font-bold leading-tight">{item.title}</h1>
                    
                    {item.excerpt && (
                      <p className="text-muted-foreground leading-relaxed">
                        {item.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  {item.content && (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border"
                      dangerouslySetInnerHTML={{ __html: processContentWithAnchors(item.content) }}
                    />
                  )}

                  {/* Related Items Section */}
                  {relatedItems.length > 0 && (
                    <div id="relaterat-innehall" className="mt-8 pt-6 border-t border-border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-primary" />
                        Relaterat innehåll
                      </h3>
                      <div className="grid gap-4">
                        {relatedItems.map((relatedItem) => {
                          const getTypeIcon = (type: string) => {
                            switch (type) {
                              case 'article': return <FileText className="h-4 w-4" />
                              case 'portfolio': return <FolderOpen className="h-4 w-4" />
                              case 'service': return <Briefcase className="h-4 w-4" />
                              default: return <FileText className="h-4 w-4" />
                            }
                          }

                          const getTypeLabel = (type: string) => {
                            switch (type) {
                              case 'article': return 'Artikel'
                              case 'portfolio': return 'Projekt'
                              case 'service': return 'Tjänst'
                              default: return 'Innehåll'
                            }
                          }

                          const handleClick = () => {
                            if (relatedItem.onClick) {
                              relatedItem.onClick()
                            } else if (relatedItem.url) {
                              window.open(relatedItem.url, '_blank')
                            }
                          }

                          return (
                            <div 
                              key={relatedItem.id}
                              className="group flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={handleClick}
                            >
                              {/* Image */}
                              <div className="flex-shrink-0">
                                {relatedItem.featured_image ? (
                                  <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden">
                                    <Image 
                                      src={relatedItem.featured_image} 
                                      alt={relatedItem.title}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                    {getTypeIcon(relatedItem.type)}
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {getTypeIcon(relatedItem.type)}
                                    <span className="ml-1">{getTypeLabel(relatedItem.type)}</span>
                                  </Badge>
                                </div>
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                  {relatedItem.title}
                                </h4>
                                {relatedItem.excerpt && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {relatedItem.excerpt.length > 100 ? `${relatedItem.excerpt.substring(0, 100)}...` : relatedItem.excerpt}
                                  </p>
                                )}
                              </div>

                              {/* Arrow */}
                              <div className="flex-shrink-0 self-center">
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </ModalContent>
      </Modal>

      {/* External Scrollbar and Quick Links rendered via Portal to ensure highest z-index */}
      {mounted && open && item && scrollHeight > clientHeight && createPortal(
        <div className="fixed top-1/2 left-[calc(50vw+32rem+1rem)] -translate-y-1/2 z-[999]">
          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div className="absolute right-8 top-0 w-48 h-[75vh] flex flex-col justify-start pt-8 space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Snabblänkar
              </div>
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-md bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors text-left"
                  title={link.label}
                >
                  {link.icon && <span className="flex-shrink-0">{link.icon}</span>}
                  <span className="truncate">{link.label}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Scrollbar */}
          <div className="w-3 h-[75vh]">
            <div className="relative h-full w-full bg-muted rounded-full">
            <div
              className="absolute left-0 w-full bg-muted-foreground/30 rounded-full cursor-pointer hover:bg-muted-foreground/70 transition-colors"
              style={{
                height: `${Math.max(20, (clientHeight / scrollHeight) * 100)}%`,
                top: `${(scrollTop / (scrollHeight - clientHeight)) * (100 - Math.max(20, (clientHeight / scrollHeight) * 100))}%`
              }}
              onClick={handleScrollbarDrag}
              onMouseDown={(e) => {
                const startY = e.clientY
                const startScrollTop = scrollTop
                
                const handleMouseMove = (e: MouseEvent) => {
                  const container = document.getElementById('content-scroll-area')
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
        </div>,
        document.body
      )}
    </>
  )
}