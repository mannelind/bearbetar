'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { Button } from '@/components/ui/button'
import { PortfolioCard } from '@/components/ui/portfolio-card'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { PortfolioModal } from './portfolio-modal'
import { Calendar, ExternalLink, FileText, Image as ImageIcon, User } from 'lucide-react'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'] & {
  portfolio_categories?: Database['public']['Tables']['portfolio_categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  gallery_count?: number
}


export function PortfolioGrid() {
  const searchParams = useSearchParams()
  const viewMode = searchParams.get('view') as 'grid' | 'list' || 'grid'
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const loadPortfolioItems = useCallback(async () => {
    setLoading(true)

    let query = supabase
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
          id
        )
      `)
      .eq('published', true)

    // Apply filters
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')
    const projectType = searchParams.get('type')
    const sortBy = searchParams.get('sort') || 'newest'

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Project type filter
    if (projectType && projectType !== 'all') {
      query = query.eq('project_type', projectType)
    }

    // Sorting
    switch (sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'title':
        query = query.order('title', { ascending: true })
        break
      case 'completion_date':
        query = query.order('completion_date', { ascending: false })
        break
      default: // newest
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error loading portfolio items:', error)
      
      // Use mock data in development when Supabase fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock portfolio data for development...')
        const mockPortfolioItems: PortfolioItem[] = [
          {
            id: '1',
            title: 'Lorem Ipsum Project Alpha',
            slug: 'lorem-ipsum-project-alpha',
            description: `
              <div class="space-y-6">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                
                <h2>Lorem Ipsum Dolor</h2>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <h2>Consectetur Adipiscing</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                
                <h2>Excepteur Sint</h2>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</p>
              </div>
            `,
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
            excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
            featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
            project_type: 'simple',
            client_name: 'Lorem Client AB',
            project_url: null,
            completion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            case_study_content: 'Detaljerad fallstudie om utvecklingsprocessen och resultaten.',
            technologies_used: 'Next.js, Stripe, Supabase, Tailwind CSS',
            published: true,
            published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            portfolio_categories: [
              { id: '1', name: 'Webbutveckling', slug: 'webbutveckling', description: 'Utveckling av webbplatser och webbapplikationer', created_at: new Date().toISOString() }
            ],
            tags: [
              { id: '1', name: 'Next.js', slug: 'nextjs', created_at: new Date().toISOString() },
              { id: '2', name: 'E-handel', slug: 'e-handel', created_at: new Date().toISOString() },
              { id: '3', name: 'Stripe', slug: 'stripe', created_at: new Date().toISOString() }
            ],
            gallery_count: 5
          },
          {
            id: '2',
            title: 'Bokningssystem för frisörsalong',
            slug: 'bokningssystem-frisor',
            description: `
              <div class="space-y-6">
                <p>Digitalt bokningssystem som gjorde det enkelt för kunder att boka tid och för personalen att hantera schema.</p>
                
                <h2>Utmaningen</h2>
                <p>Salongen hade problem med dubbelbokningar och kunde inte effektivt hantera sina tider.</p>
                
                <h2>Lösningen</h2>
                <p>Ett skräddarsytt bokningssystem som revolutionerade hur salongen hanterar sina bokningar.</p>
                
                <h2>Teknisk arkitektur</h2>
                <p>Vi byggde systemet med React för en responsiv frontend och Node.js för backend-logiken.</p>
                
                <h2>Resultat och påverkan</h2>
                <p>Systemet minskade dubbelbokningar med 95% och ökade kundnöjdheten markant.</p>
              </div>
            `,
            content: 'Ett skräddarsytt bokningssystem som revolutionerade hur salongen hanterar sina bokningar.',
            excerpt: 'Digitalt bokningssystem för enkel tidsbokning och schemahantering.',
            featured_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center',
            project_type: 'case_study',
            client_name: 'Hår & Skönhet Salon',
            project_url: null,
            completion_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            case_study_content: 'Analys av användning och effektivisering av bokningsprocessen.',
            technologies_used: 'React, Node.js, MongoDB, Calendly API',
            published: true,
            published_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            portfolio_categories: [
              { id: '2', name: 'Systemutveckling', slug: 'systemutveckling', description: 'Utveckling av affärssystem och mjukvara', created_at: new Date().toISOString() }
            ],
            tags: [
              { id: '4', name: 'React', slug: 'react', created_at: new Date().toISOString() },
              { id: '5', name: 'Node.js', slug: 'nodejs', created_at: new Date().toISOString() },
              { id: '6', name: 'MongoDB', slug: 'mongodb', created_at: new Date().toISOString() }
            ],
            gallery_count: 8
          },
          {
            id: '3',
            title: 'Mobilapp för träningslogg',
            slug: 'mobilapp-traningslogg',
            description: `
              <div class="space-y-6">
                <p>Enkel och intuitiv app för att logga träningspass och följa framsteg över tid.</p>
                
                <h2>Användarupplevelse</h2>
                <p>En motiverande träningsapp som hjälper användare att hålla koll på sina träningspass.</p>
                
                <h2>Funktioner</h2>
                <p>Appen inkluderar träningslogg, progressspårning, statistik och motiverande notifikationer.</p>
                
                <h2>Teknologi</h2>
                <p>Utvecklad med React Native för att fungera på både iOS och Android med en gemensam kodbas.</p>
              </div>
            `,
            content: 'En motiverande träningsapp som hjälper användare att hålla koll på sina träningspass.',
            excerpt: 'Enkel och intuitiv app för träningslogg och framstegsspårning.',
            featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
            project_type: 'simple',
            client_name: null,
            project_url: null,
            completion_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            case_study_content: 'Användarfeedback och appens påverkan på träningsvanor.',
            technologies_used: 'React Native, Firebase, TypeScript',
            published: true,
            published_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            portfolio_categories: [
              { id: '3', name: 'Mobilutveckling', slug: 'mobilutveckling', description: 'Utveckling av mobilapplikationer för iOS och Android', created_at: new Date().toISOString() }
            ],
            tags: [
              { id: '7', name: 'React Native', slug: 'react-native', created_at: new Date().toISOString() },
              { id: '8', name: 'Firebase', slug: 'firebase', created_at: new Date().toISOString() },
              { id: '9', name: 'TypeScript', slug: 'typescript', created_at: new Date().toISOString() }
            ],
            gallery_count: 3
          },
          {
            id: '4',
            title: 'Företagshemsida med CMS',
            slug: 'foretagshemsida-cms',
            description: 'Responsiv företagswebbplats med enkelt innehållshanteringssystem.',
            content: 'En professionell företagswebbplats med kraftfullt CMS.',
            excerpt: 'Responsiv företagswebbplats med enkelt innehållshanteringssystem.',
            featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
            project_type: 'simple',
            client_name: 'Professional Services AB',
            project_url: null,
            completion_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            case_study_content: 'SEO-förbättringar och prestanda optimeringar.',
            technologies_used: 'WordPress, PHP, MySQL, SCSS',
            published: true,
            published_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            portfolio_categories: [
              { id: '1', name: 'Webbutveckling', slug: 'webbutveckling', description: 'Utveckling av webbplatser och webbapplikationer', created_at: new Date().toISOString() }
            ],
            tags: [
              { id: '10', name: 'WordPress', slug: 'wordpress', created_at: new Date().toISOString() },
              { id: '11', name: 'PHP', slug: 'php', created_at: new Date().toISOString() },
              { id: '12', name: 'MySQL', slug: 'mysql', created_at: new Date().toISOString() }
            ],
            gallery_count: 12
          },
          {
            id: '5',
            title: 'Pedagogisk lärplattform',
            slug: 'pedagogisk-larplattform',
            description: 'Interaktiv lärplattform med fokus på pedagogik och användbarhet.',
            content: 'En innovativ lärplattform utvecklad i nära samarbete med lärare.',
            excerpt: 'Interaktiv lärplattform med fokus på pedagogik och användbarhet.',
            featured_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&crop=center',
            project_type: 'case_study',
            client_name: 'Utbildningscentrum',
            project_url: null,
            completion_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            case_study_content: 'Pedagogisk utvärdering och användarupplevelse.',
            technologies_used: 'Vue.js, Laravel, PostgreSQL, Docker',
            published: true,
            published_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            portfolio_categories: [
              { id: '4', name: 'EdTech', slug: 'edtech', description: 'Utbildningsteknologi och lärplattformar', created_at: new Date().toISOString() }
            ],
            tags: [
              { id: '13', name: 'Vue.js', slug: 'vuejs', created_at: new Date().toISOString() },
              { id: '14', name: 'Laravel', slug: 'laravel', created_at: new Date().toISOString() },
              { id: '15', name: 'PostgreSQL', slug: 'postgresql', created_at: new Date().toISOString() }
            ],
            gallery_count: 6
          },
          {
            id: '6',
            title: 'Dashboard för dataanalys',
            slug: 'dashboard-dataanalys',
            description: 'Kraftfull dashboard för visualisering och analys av affärsdata.',
            content: 'Ett omfattande dashboard som hjälper företag att förstå sina data.',
            excerpt: 'Kraftfull dashboard för visualisering och analys av affärsdata.',
            featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
            project_type: 'simple',
            client_name: 'Data Analytics Corp',
            project_url: null,
            completion_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            case_study_content: 'Prestanda optimering och skalbarhet.',
            technologies_used: 'React, D3.js, Python, FastAPI',
            published: true,
            published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            portfolio_categories: [
              { id: '5', name: 'Datavisualisering', slug: 'datavisualisering', description: 'Visualisering och analys av data', created_at: new Date().toISOString() }
            ],
            tags: [
              { id: '4', name: 'React', slug: 'react', created_at: new Date().toISOString() },
              { id: '16', name: 'D3.js', slug: 'd3js', created_at: new Date().toISOString() },
              { id: '17', name: 'Python', slug: 'python', created_at: new Date().toISOString() }
            ],
            gallery_count: 4
          }
        ]
        setItems(mockPortfolioItems)
      }
      setLoading(false)
      return
    }

    if (!data) {
      setItems([])
      setLoading(false)
      return
    }

    // Transform and filter the data
    let transformedItems = data.map(item => ({
      ...item,
      portfolio_categories: item.portfolio_item_categories?.map((pc: any) => pc.portfolio_categories).filter(Boolean) || [],
      tags: item.portfolio_item_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
      gallery_count: item.portfolio_gallery?.length || 0
    }))

    // Apply category filter
    if (category && category !== 'all') {
      transformedItems = transformedItems.filter(item =>
        item.portfolio_categories?.some(cat => cat.id === category)
      )
    }

    // Apply tags filter
    if (tags) {
      const tagIds = tags.split(',').filter(Boolean)
      if (tagIds.length > 0) {
        transformedItems = transformedItems.filter(item =>
          tagIds.some(tagId => item.tags?.some(tag => tag.id === tagId))
        )
      }
    }

    setItems(transformedItems)
    setLoading(false)
  }, [supabase, searchParams])

  const loadPortfolioItemsCallback = useCallback(() => {
    loadPortfolioItems()
  }, [loadPortfolioItems])

  useEffect(() => {
    loadPortfolioItemsCallback()
  }, [loadPortfolioItemsCallback])

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300) // Allow modal to close before clearing item
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">
          Inga portfolio items hittades
        </div>
        <p className="text-muted-foreground">
          Prova att justera dina filter eller sökord
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 text-sm text-muted-foreground">
        Visar {items.length} projekt
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
        {items.map((item) => (
          <SimpleTooltip key={item.id} text={`Klicka för att se mer om ${item.title} 🔍`} side="top">
            {viewMode === 'grid' ? (
              // Grid view - use shared PortfolioCard
              <PortfolioCard project={item} onClick={() => handleItemClick(item)} />
            ) : (
              <Card 
                className="w-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleItemClick(item)}
              >
                {/* List view - horizontal layout with image on left */}
                <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="aspect-video md:aspect-square relative md:w-48 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.featured_image ? (
                    <Image 
                      src={item.featured_image} 
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.project_type === 'case_study' ? 'default' : 'secondary'}>
                        {item.project_type === 'case_study' ? (
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
                      {item.completion_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.completion_date).toLocaleDateString('sv-SE')}
                        </div>
                      )}
                      {item.gallery_count && item.gallery_count > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.gallery_count} bilder
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    
                    {item.client_name && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {item.client_name}
                      </div>
                    )}
                  </CardHeader>

                  {item.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.excerpt}
                      </p>
                    </CardContent>
                  )}

                  {/* Tags and actions in list view */}
                  <div className="mt-auto">
                    {/* Categories */}
                    {item.portfolio_categories && item.portfolio_categories.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Kategorier:</div>
                          <div className="flex flex-wrap gap-1">
                            {item.portfolio_categories.slice(0, 3).map((category: any) => (
                              <ColoredBadge key={category.id} tag={category.name} className="text-xs" />
                            ))}
                            {item.portfolio_categories.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.portfolio_categories.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Teknologier:</div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag: any) => (
                              <ColoredBadge key={tag.id} tag={tag.name} className="text-xs" />
                            ))}
                            {item.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {/* Project URL */}
                    {item.project_url && (
                      <CardContent className="pt-0">
                        <SimpleTooltip text="Öppna projektet i en ny flik 🚀" side="bottom">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(item.project_url!, '_blank')
                            }}
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Besök projekt
                          </Button>
                        </SimpleTooltip>
                      </CardContent>
                    )}
                  </div>
                </div>
              </div>
              </Card>
            )}
          </SimpleTooltip>
        ))}
      </div>

      {/* Portfolio Modal */}
      <PortfolioModal 
        item={selectedItem}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </>
  )
}