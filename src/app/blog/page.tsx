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
            title: 'Lorem ipsum dolor sit amet consectetur',
            slug: 'lorem-ipsum-dolor-sit-amet',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            featured_image: 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            tags: ['Lorem', 'Ipsum', 'Dolor', 'Consectetur', 'Adipiscing'],
            categories: [{ id: 'lorem', name: 'Lorem', slug: 'lorem' }],
            admin_users: {
              full_name: 'Manne',
              email: 'manne@bearbetar.se'
            }
          },
          {
            id: '2',
            title: 'Sed do eiusmod tempor incididunt ut',
            slug: 'sed-do-eiusmod-tempor-incididunt',
            content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            excerpt: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
            featured_image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id-2',
            tags: ['Tempor', 'Incididunt', 'Labore'],
            categories: [{ id: 'ipsum', name: 'Ipsum', slug: 'ipsum' }],
            admin_users: {
              full_name: 'Adam',
              email: 'adam@bearbetar.se'
            }
          },
          {
            id: '3',
            title: 'Duis aute irure dolor in reprehenderit',
            slug: 'duis-aute-irure-dolor-reprehenderit',
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
            excerpt: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id',
            tags: ['Voluptate', 'Reprehenderit', 'Cupidatat', 'Occaecat', 'Excepteur', 'Proident'],
            categories: [{ id: 'dolor', name: 'Dolor', slug: 'dolor' }],
            admin_users: {
              full_name: 'Manne',
              email: 'manne@bearbetar.se'
            }
          },
          {
            id: '4',
            title: 'Excepteur sint occaecat cupidatat non',
            slug: 'excepteur-sint-occaecat-cupidatat',
            content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error.',
            excerpt: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            featured_image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id-2',
            tags: ['Officia', 'Deserunt', 'Mollit', 'Laborum'],
            categories: [{ id: 'excepteur', name: 'Excepteur', slug: 'excepteur' }],
            admin_users: {
              full_name: 'Adam',
              email: 'adam@bearbetar.se'
            }
          },
          {
            id: '5',
            title: 'Ut enim ad minim veniam quis nostrud',
            slug: 'ut-enim-ad-minim-veniam-quis',
            content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.',
            excerpt: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            featured_image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=600&fit=crop&crop=center',
            published: true,
            published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'mock-author-id-2',
            tags: ['Veniam', 'Exercitation', 'Ullamco', 'Consequat', 'Aliquip'],
            categories: [{ id: 'veniam', name: 'Veniam', slug: 'veniam' }],
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
          title: 'Lorem ipsum dolor sit amet consectetur',
          slug: 'lorem-ipsum-dolor-sit-amet',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          featured_image: 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=800&h=600&fit=crop&crop=center',
          published: true,
          published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          author_id: 'mock-author-id',
          tags: ['Lorem', 'Ipsum', 'Dolor', 'Consectetur', 'Adipiscing'],
          categories: [{ id: 'lorem', name: 'Lorem', slug: 'lorem' }],
          admin_users: {
            full_name: 'Manne',
            email: 'manne@bearbetar.se'
          }
        },
        {
          id: '2',
          title: 'Sed do eiusmod tempor incididunt ut',
          slug: 'sed-do-eiusmod-tempor-incididunt',
          content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          excerpt: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
          featured_image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop&crop=center',
          published: true,
          published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          author_id: 'mock-author-id-2',
          tags: ['Tempor', 'Incididunt', 'Labore'],
          categories: [{ id: 'ipsum', name: 'Ipsum', slug: 'ipsum' }],
          admin_users: {
            full_name: 'Adam',
            email: 'adam@bearbetar.se'
          }
        },
        {
          id: '3',
          title: 'Duis aute irure dolor in reprehenderit',
          slug: 'duis-aute-irure-dolor-reprehenderit',
          content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
          excerpt: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&crop=center',
          published: true,
          published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          author_id: 'mock-author-id',
          tags: ['Voluptate', 'Reprehenderit', 'Cupidatat', 'Occaecat', 'Excepteur', 'Proident'],
          categories: [{ id: 'dolor', name: 'Dolor', slug: 'dolor' }],
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