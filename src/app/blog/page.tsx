'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { ArticlesGrid } from '@/components/blog/articles-grid'
import { BlogModal } from '@/components/blog/blog-modal'
import { ColoredBadge } from '@/components/ui/colored-badge'
import { AnimatedSection, PageWrapper } from '@/components/ui/page-animations'
import { Calendar, User, ArrowRight, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

export default function BlogPage() {
  const [articlesWithTags, setArticlesWithTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

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

const handleFeaturedArticleClick = () => {
  if (featuredArticle) {
    setSelectedArticle(featuredArticle)
    setModalOpen(true)
  }
}

const handleModalClose = () => {
  setModalOpen(false)
  setTimeout(() => setSelectedArticle(null), 300)
}

// Get latest article for featured section
const featuredArticle = articlesWithTags[0]
const regularArticles = articlesWithTags.slice(1) || []

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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Logo */}
            <AnimatedSection animation="slide-in-left">
              <div className="flex justify-center lg:justify-center">
                <div className="text-center lg:text-left">
                  <ThemeLogo 
                    alt="Bearbetar logotyp"
                    width={400}
                    height={160}
                    className="w-auto h-24 md:h-32 lg:h-40"
                    type="full"
                  />
                </div>
              </div>
            </AnimatedSection>
            
            {/* Right side - Text content */}
            <AnimatedSection animation="slide-up-delayed">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                  Vad vi{' '}
                  <span className="text-primary">
                    skriver om
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl lg:max-w-none">
                  Tips, tankar och berättelser från vårt jobb som utvecklare. Plus lite random grejer vi tänker på.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <AnimatedSection animation="scale-in">
          <section className="container py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight">Senaste inlägget</h2>
              <p className="text-muted-foreground">Det vi skrev senast</p>
            </div>
            
            <Card 
              className="overflow-hidden max-w-4xl mx-auto cursor-pointer hover:shadow-xl transition-shadow"
              onClick={handleFeaturedArticleClick}
            >
            <div className="md:flex">
              {featuredArticle.featured_image && (
                <div className="md:w-1/2">
                  <div className="aspect-video md:aspect-square relative">
                    <Image
                      src={featuredArticle.featured_image}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              )}
              <div className={featuredArticle.featured_image ? "md:w-1/2" : "w-full"}>
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge>Senaste</Badge>
                    {featuredArticle.published_at && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(featuredArticle.published_at), {
                          addSuffix: true,
                          locale: sv
                        })}
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-2xl hover:text-primary transition-colors cursor-pointer">
                    {featuredArticle.title}
                  </CardTitle>
                  
                  {featuredArticle.excerpt && (
                    <CardDescription className="text-base">
                      {featuredArticle.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tags */}
                  {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featuredArticle.tags.map((tag: string, index: number) => (
                        <ColoredBadge key={index} tag={tag} className="text-sm" />
                      ))}
                    </div>
                  )}

                  {featuredArticle.admin_users && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {featuredArticle.admin_users.profile_image ? (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border">
                          <Image
                            src={featuredArticle.admin_users.profile_image}
                            alt={featuredArticle.admin_users.full_name || featuredArticle.admin_users.email}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        </div>
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>
                        {featuredArticle.admin_users.full_name || featuredArticle.admin_users.email}
                      </span>
                    </div>
                  )}
                  
                  <Button>
                    Läs artikel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
          </section>
        </AnimatedSection>
      )}

      {/* Articles Grid */}
      <AnimatedSection animation="scale-in-delayed">
        <section className="container py-16">
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
            <ArticlesGrid articles={regularArticles} />
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