'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeLogo } from '@/components/ui/theme-logo'
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
            title: 'Digitalisering av småföretag - En praktisk guide',
            slug: 'digitalisering-av-smaforetag-praktisk-guide',
            excerpt: 'Lär dig hur ditt småföretag kan dra nytta av digitaliseringens möjligheter med praktiska tips och strategier.',
            published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            featured_image: null,
            tags: ['Digitalisering', 'Småföretag', 'Teknik'],
            admin_users: {
              full_name: 'Manne',
              email: 'manne@bearbetar.se',
              bio: 'Grundare och strateg med passion för affärsutveckling.',
              profile_image: null
            }
          },
          {
            id: '2',
            title: 'Säkerhetsrutiner för moderna webbapplikationer',
            slug: 'sakerhetsrutiner-moderna-webbapplikationer',
            excerpt: 'Grundläggande säkerhetsrutiner som alla utvecklare bör känna till för att skydda sina webbapplikationer.',
            published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            featured_image: null,
            tags: ['Säkerhet', 'Webbutveckling', 'Best Practices'],
            admin_users: {
              full_name: 'Adam',
              email: 'adam@bearbetar.se',
              bio: 'Expert inom teknisk utveckling och digitalisering.',
              profile_image: null
            }
          },
          {
            id: '3',
            title: 'AI och maskininlärning i affärsprocesser',
            slug: 'ai-maskininlarning-affarsprocesser',
            excerpt: 'Upptäck hur artificiell intelligens och maskininlärning kan automatisera och förbättra dina affärsprocesser.',
            published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            featured_image: null,
            tags: ['AI', 'Maskininlärning', 'Innovation'],
            admin_users: {
              full_name: 'Manne',
              email: 'manne@bearbetar.se',
              bio: 'Grundare och strateg med passion för affärsutveckling.',
              profile_image: null
            }
          },
          {
            id: '4',
            title: 'Molnmigration - Planering och genomförande',
            slug: 'molnmigration-planering-genomforande',
            excerpt: 'En steg-för-steg guide till att migrera dina system till molnet på ett säkert och effektivt sätt.',
            published_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            featured_image: null,
            tags: ['Molntjänster', 'DevOps', 'Infrastruktur'],
            admin_users: {
              full_name: 'Adam',
              email: 'adam@bearbetar.se',
              bio: 'Expert inom teknisk utveckling och digitalisering.',
              profile_image: null
            }
          }
        ]
        setArticlesWithTags(mockArticles)
      }
    } else {
      console.log('Fetched articles:', articles?.length || 0)
      
      // Transform articles to include tags array
      const transformedArticles = articles?.map(article => ({
        ...article,
        tags: article.article_tags?.map((at: any) => at.tags.name) || []
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
          title: 'Varför Next.js är så bra (och lite irriterande)',
          slug: 'varfor-nextjs-ar-sa-bra-och-lite-irriterande',
          excerpt: 'Vi har använt Next.js i flera år nu och älskar det mesta. Men det finns några saker som är riktigt irriterande också.',
          published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          featured_image: null,
          tags: ['Next.js', 'React', 'Tips'],
          admin_users: {
            full_name: 'Manne',
            email: 'manne@bearbetar.se',
            bio: 'Utvecklare som gillar att bygga saker.',
            profile_image: null
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
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-2 items-center text-center lg:text-left">
            {/* Left side - Logo */}
            <AnimatedSection animation="slide-in-left">
              <div className="flex justify-center">
                <ThemeLogo 
                  alt="Bearbetar logotyp"
                  width={400}
                  height={160}
                  className="w-auto h-24 md:h-32 lg:h-40"
                  type="full"
                />
              </div>
            </AnimatedSection>
            
            {/* Right side - Text content */}
            <AnimatedSection animation="slide-up-delayed">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                  Vad vi{' '}
                  <span className="text-primary">
                    skriver om
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
                  Tips, tankar och berättelser från vårt jobb som utvecklare. Plus lite random grejer vi tänker på.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* Filters */}
      <AnimatedSection animation="fade-in">
        <section className="container py-8">
          <ContentFilters
            config={{
              contentType: 'blog',
              enableSearch: true,
              enableCategories: false, // Blog använder taggar istället för kategorier
              enableTags: true,
              enableSort: true,
              enableViewToggle: true,
              enableDateFilter: true,
              enableAuthorFilter: true,
              searchPlaceholder: 'Sök i artiklar...',
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