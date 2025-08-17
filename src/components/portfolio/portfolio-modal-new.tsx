'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { ContentModal } from '@/components/ui/content-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, FileText, Image as ImageIcon, User, Calendar, Target, Cog } from 'lucide-react'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
            image_alt: null,
            caption: gallery.caption,
            sort_order: gallery.sort_order,
            created_at: new Date().toISOString()
          })).sort((a, b) => a.sort_order - b.sort_order) || []
        }
        setFullItem(transformedItem)
      }
    } catch (err) {
      console.error('Error loading portfolio item:', err)
      setError('Anslutningen misslyckades. Kontrollera din internetanslutning och försök igen.')
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    if (open && item && !fullItem) {
      loadFullItem(item.id)
    }
    if (!open) {
      setFullItem(null)
      setError(null)
    }
  }, [open, item, fullItem, loadFullItem])

  const handleRetry = () => {
    if (item) {
      loadFullItem(item.id)
    }
  }

  // Create additional metadata for portfolio-specific information
  const additionalMetadata = fullItem ? (
    <div className="space-y-3">
      {/* Client Name */}
      {fullItem.client_name && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{fullItem.client_name}</span>
        </div>
      )}
      
      {/* Completion Date */}
      {fullItem.completion_date && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Slutfört: {new Date(fullItem.completion_date).toLocaleDateString('sv-SE')}</span>
        </div>
      )}
      
      {/* Project Type */}
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
      
      {/* Project URL */}
      {fullItem.project_url && (
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
      {fullItem.technologies_used && (
        <div>
          <h4 className="text-sm font-medium mb-2">Teknologier</h4>
          <div className="flex flex-wrap gap-1">
            {fullItem.technologies_used.split(',').map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech.trim()}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : null

  // Create example related projects (in real app, this would come from admin/database)
  const relatedProjects = fullItem ? [
    {
      id: 'portfolio-2',
      title: 'Mobil-app för Fitness Tracking',
      excerpt: 'React Native-app med avancerad träningsspårning och social funktionalitet.',
      featured_image: '/images/fitness-app.jpg',
      type: 'portfolio' as const,
      onClick: () => console.log('Navigate to portfolio 2')
    },
    {
      id: 'article-tech',
      title: 'Teknisk djupdykning: Microservices Architecture',
      excerpt: 'En detaljerad guide till hur vi implementerade skalbar microservices-arkitektur.',
      type: 'article' as const,
      onClick: () => console.log('Navigate to tech article')
    }
  ] : []

  // Create quick links for portfolio sections
  const quickLinks = fullItem ? [
    { id: 'content-top', label: 'Projektöversikt', icon: <Target className="h-3 w-3" /> },
    { id: 'sammanfattning', label: 'Sammanfattning', icon: <FileText className="h-3 w-3" /> },
    { id: 'beskrivning', label: 'Beskrivning', icon: <FileText className="h-3 w-3" /> },
    { id: 'case-study', label: 'Case Study', icon: <FileText className="h-3 w-3" /> },
    { id: 'teknologier', label: 'Teknologier', icon: <Cog className="h-3 w-3" /> },
    ...(relatedProjects.length > 0 ? [{ id: 'relaterat-innehall', label: 'Relaterade projekt', icon: <Target className="h-3 w-3" /> }] : [])
  ].filter(link => {
    // Only show links that have corresponding content
    if (link.id === 'content-top') return true
    if (link.id === 'relaterat-innehall') return true
    if (link.id === 'sammanfattning' && fullItem.excerpt) return true
    if (link.id === 'beskrivning' && fullItem.description) return true
    if (link.id === 'case-study' && fullItem.case_study_content) return true
    if (link.id === 'teknologier' && fullItem.technologies_used) return true
    return false
  }) : []

  // Transform portfolio item to ContentItem format
  const contentItem = fullItem ? {
    id: fullItem.id,
    title: fullItem.title,
    excerpt: fullItem.excerpt || undefined,
    featured_image: fullItem.featured_image || undefined,
    created_at: fullItem.created_at,
    updated_at: fullItem.updated_at || undefined,
    content: fullItem.description || fullItem.case_study_content || undefined,
    categories: fullItem.portfolio_categories?.map(cat => ({ id: cat.id, name: cat.name })) || [],
    tags: fullItem.tags?.map(tag => ({ id: tag.id, name: tag.name })) || []
  } : null

  return (
    <ContentModal
      item={contentItem}
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      showReadingTime={false} // Don't show reading time for portfolio items
      showAuthor={false} // Don't show author for portfolio items
      showDates={false} // We handle dates in additionalMetadata
      showCategories={true}
      showTags={true}
      additionalMetadata={additionalMetadata}
      quickLinks={quickLinks}
      relatedItems={relatedProjects}
    />
  )
}