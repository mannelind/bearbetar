'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/ui/hero-section'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { ArticlesGrid } from '@/components/blog/articles-grid'
import { BlogModal } from '@/components/blog/blog-modal'
import { ContentFilters, FilterState } from '@/components/ui/content-filters'
import { AnimatedSection, PageWrapper } from '@/components/ui/page-animations'
import { Search } from 'lucide-react'

export default function BlogPage() {
  const [articlesWithTags, setArticlesWithTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    tags: [],
    sort: 'newest',
    viewMode: 'grid',
    dateRange: 'all',
    author: 'all',
    customFilters: {}
  })

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    // Try to fetch from Supabase, fallback to mock data in development
    try {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        *,
        admin_users!articles_author_id_fkey (
          full_name,
          email,
          bio,
          profile_image
        ),
        article_tags (
          tags (
            name
          )
        ),
        article_categories (
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
      
      // Use mock data in development when Supabase fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development...')
        const mockArticles = [
          {
            id: '1',
            title: 'Varför Next.js är vårt favoritramverk',
            slug: 'varfor-nextjs-ar-vart-favoritramverk',
            content: 'Vi har testat massor av ramverk genom åren, men Next.js har verkligen imponerat på oss. Här berättar vi varför det blivit vårt första val för nya projekt och vad som gör det så kraftfullt.',
            excerpt: 'Vi har testat massor av ramverk genom åren, men Next.js har verkligen imponerat på oss. Här berättar vi varför det blivit vårt första val för nya projekt.',
            featured_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            tags: ['Next.js', 'React', 'JavaScript', 'Webbutveckling', 'Framework'],
            categories: [{ id: 'webbutveckling', name: 'Webbutveckling', slug: 'webbutveckling' }],
            admin_users: {
              full_name: 'Manne',
              email: 'manne@bearbetar.se'
            }
          },
          {
            id: '2',
            title: 'Så designar man för användbarhet',
            slug: 'sa-designar-man-for-anvandbarhet',
            content: 'Användarupplevelse handlar inte bara om att något ser snyggt ut. Det ska framför allt vara lätt att använda. Här är våra bästa tips för bättre UX och hur man skapar verkligt användbara gränssnitt.',
            excerpt: 'Användarupplevelse handlar inte bara om att något ser snyggt ut. Det ska framför allt vara lätt att använda. Här är våra bästa tips för bättre UX.',
            featured_image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id-2',
            tags: ['UX', 'Design', 'Användbarhet'],
            categories: [{ id: 'design', name: 'Design', slug: 'design' }],
            admin_users: {
              full_name: 'Adam',
              email: 'adam@bearbetar.se'
            }
          },
          {
            id: '3',
            title: 'Månadsabonnemang vs engångsköp',
            slug: 'manadsabonnemang-vs-engangskop',
            content: 'Varför vi tror på månadsabonnemang för webbplatser och appar. Det blir bättre för alla parter - både kunder och utvecklare. Vi förklarar fördelarna och hur modellen fungerar i praktiken.',
            excerpt: 'Varför vi tror på månadsabonnemang för webbplatser och appar. Det blir bättre för alla parter - både kunder och utvecklare.',
            featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            tags: ['Affärsmodell', 'Prenumeration', 'Prissättning', 'Strategi', 'Webbutveckling', 'SaaS'],
            categories: [{ id: 'foretagande', name: 'Företagande', slug: 'foretagande' }],
            admin_users: {
              full_name: 'Manne',
              email: 'manne@bearbetar.se'
            }
          },
          {
            id: '4',
            title: 'WordPress vs modern utveckling',
            slug: 'wordpress-vs-modern-utveckling',
            content: 'WordPress får mycket skit från utvecklare, men för många användningsområden är det fortfarande ett bra val. Vi förklarar när och varför du bör välja WordPress och när du bör satsa på modernare tekniker.',
            excerpt: 'WordPress får mycket skit från utvecklare, men för många användningsområden är det fortfarande ett bra val. Vi förklarar när och varför.',
            featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id-2',
            tags: ['WordPress', 'CMS', 'PHP', 'Webbutveckling'],
            categories: [{ id: 'webbutveckling', name: 'Webbutveckling', slug: 'webbutveckling' }],
            admin_users: {
              full_name: 'Adam',
              email: 'adam@bearbetar.se'
            }
          },
          {
            id: '5',
            title: 'Så undviker du vanliga designmisstag',
            slug: 'sa-undviker-du-vanliga-designmisstag',
            content: 'Vi har sett samma designmisstag om och om igen. Här är de vanligaste fällorna och hur du undviker dem i ditt nästa projekt. Från navigation till färgval - allt som kan gå snett.',
            excerpt: 'Vi har sett samma designmisstag om och om igen. Här är de vanligaste fällorna och hur du undviker dem i ditt nästa projekt.',
            featured_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id-2',
            tags: ['Design', 'UX', 'UI', 'Bästa praxis', 'Tips'],
            categories: [{ id: 'design', name: 'Design', slug: 'design' }],
            admin_users: {
              full_name: 'Adam',
              email: 'adam@bearbetar.se'
            }
          }
        ]
        setArticlesWithTags(mockArticles)
      }
    } else {
      console.log('Fetched articles:', articles?.length || 0)
      
      // Transform articles to include tags and categories arrays
      const transformedArticles = articles?.map(article => ({
        ...article,
        tags: article.article_tags?.map((at: any) => at.tags.name) || [],
        categories: article.article_categories?.map((ac: any) => ac.categories) || []
      })) || []
      
      setArticlesWithTags(transformedArticles)
    }
  } catch (err) {
    console.error('Supabase connection failed:', err)
    
    // Use mock data as fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock data as fallback...')
      const mockArticles = [
        {
          id: '1',
          title: 'Varför Next.js är vårt favoritramverk',
          slug: 'varfor-nextjs-ar-vart-favoritramverk',
          content: 'Vi har testat massor av ramverk genom åren, men Next.js har verkligen imponerat på oss. Här berättar vi varför det blivit vårt första val för nya projekt och vad som gör det så kraftfullt.',
          excerpt: 'Vi har testat massor av ramverk genom åren, men Next.js har verkligen imponerat på oss. Här berättar vi varför det blivit vårt första val för nya projekt.',
          featured_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center',
          published: true,
          published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          author_id: 'mock-author-id',
          tags: ['Next.js', 'React', 'JavaScript', 'Webbutveckling', 'Framework'],
          categories: [{ id: 'webbutveckling', name: 'Webbutveckling', slug: 'webbutveckling' }],
          admin_users: {
            full_name: 'Manne',
            email: 'manne@bearbetar.se'
          }
        },
        {
          id: '2',
          title: 'Så designar man för användbarhet',
          slug: 'sa-designar-man-for-anvandbarhet',
          content: 'Användarupplevelse handlar inte bara om att något ser snyggt ut. Det ska framför allt vara lätt att använda. Här är våra bästa tips för bättre UX och hur man skapar verkligt användbara gränssnitt.',
          excerpt: 'Användarupplevelse handlar inte bara om att något ser snyggt ut. Det ska framför allt vara lätt att använda. Här är våra bästa tips för bättre UX.',
          featured_image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center',
          published: true,
          published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          author_id: 'mock-author-id-2',
          tags: ['UX', 'Design', 'Användbarhet'],
          categories: [{ id: 'design', name: 'Design', slug: 'design' }],
          admin_users: {
            full_name: 'Adam',
            email: 'adam@bearbetar.se'
          }
        },
        {
          id: '3',
          title: 'Månadsabonnemang vs engångsköp',
          slug: 'manadsabonnemang-vs-engangskop',
          content: 'Varför vi tror på månadsabonnemang för webbplatser och appar. Det blir bättre för alla parter - både kunder och utvecklare. Vi förklarar fördelarna och hur modellen fungerar i praktiken.',
          excerpt: 'Varför vi tror på månadsabonnemang för webbplatser och appar. Det blir bättre för alla parter - både kunder och utvecklare.',
          featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center',
          published: true,
          published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          author_id: 'mock-author-id',
          tags: ['Affärsmodell', 'Prenumeration', 'Prissättning', 'Strategi', 'Webbutveckling', 'SaaS'],
          categories: [{ id: 'foretagande', name: 'Företagande', slug: 'foretagande' }],
          admin_users: {
            full_name: 'Manne',
            email: 'manne@bearbetar.se'
          }
        }
      ]
      setArticlesWithTags(mockArticles)
    }
  }
  
  setLoading(false)
}

const handleModalClose = () => {
  setModalOpen(false)
  setTimeout(() => setSelectedArticle(null), 300)
}

// Use all articles for the grid
const allArticlesForGrid = articlesWithTags || []

// Extract all unique tags from articles for filtering
const allTags = articlesWithTags.reduce((tags: string[], article: any) => {
  if (article.tags && Array.isArray(article.tags)) {
    article.tags.forEach((tag: string) => {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    })
  }
  return tags
}, [])

if (loading) {
  return (
    <PageWrapper>
      <div className="container py-24 text-center">
        <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Laddar artiklar...</p>
      </div>
    </PageWrapper>
  )
}

  return (
    <PageWrapper>
      <HeroSection>
        <h1 className="text-4xl font-bold tracking-tighter leading-relaxed sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          Vad vi{' '}
          <span className="text-primary">
            skriver om
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
          Tips, tankar och berättelser från vårt jobb som utvecklare. Plus lite random grejer vi tänker på.
          <br />
          <span className="text-sm text-muted-foreground/70">Alla artiklar som visas är exempel/mocktext för demonstrationsändamål.</span>
        </p>
      </HeroSection>


      {/* Filters */}
      <AnimatedSection animation="fade-in">
        <section className="container py-8">
          <ContentFilters
            config={{
              contentType: 'blog',
              enableSearch: true,
              enableCategories: true,
              enableTags: true,
              enableSort: true,
              enableViewToggle: true,
              enableDateFilter: true,
              enableAuthorFilter: true,
              searchPlaceholder: 'Sök i artiklar...',
              categoryTable: 'categories',
              sortOptions: [
                { value: 'newest', label: 'Senaste' },
                { value: 'oldest', label: 'Äldsta' },
                { value: 'title', label: 'Titel A-Ö' },
                { value: 'popular', label: 'Populära' }
              ]
            }}
            availableTags={allTags}
            onFiltersChange={setFilters}
          />
        </section>
      </AnimatedSection>

      {/* Articles Grid */}
      <AnimatedSection animation="scale-in-delayed">
        <section className="w-full py-16 px-4 md:px-6 lg:px-8">
          {!articlesWithTags || articlesWithTags.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Inget skrivet än</h3>
              <p className="text-muted-foreground mb-8">
                Vi håller på att skriva våra första inlägg. Håll utkik!
              </p>
              <Button asChild>
                <Link href="/">Tillbaka till startsidan</Link>
              </Button>
            </div>
          ) : (
            <ArticlesGrid 
              articles={allArticlesForGrid} 
              selectedTags={filters.tags}
              selectedCategory={filters.category}
              searchTerm={filters.search}
              sortBy={filters.sort}
              viewMode={filters.viewMode}
            />
          )}
        </section>
      </AnimatedSection>

      {/* Newsletter CTA */}
      <AnimatedSection animation="slide-up">
        <section className="bg-muted/50 py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter">
                Vill du veta när vi skriver något nytt?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Vi skickar inget spam, bara en notis när vi publicerat något som kanske kan intressera dig.
              </p>
              <div className="mt-8">
                <Button size="lg">
                  Få notiser
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Blog Modal */}
      <BlogModal 
        article={selectedArticle}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </PageWrapper>
  )
}