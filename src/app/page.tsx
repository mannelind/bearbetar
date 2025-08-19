import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArticleCarousel } from '@/components/ui/article-carousel'
import { PortfolioCarousel } from '@/components/ui/portfolio-carousel'
import { HeroSection } from '@/components/ui/hero-section'
import { createServerComponentClient } from '@/lib/supabase'
import { Article } from '@/types'
import { Code, Globe, Smartphone, Coffee } from 'lucide-react'

export default async function HomePage() {
  // Fetch articles for carousels
  const supabase = await createServerComponentClient()
  
  const { data: recentArticles } = await supabase
    .from('articles')
    .select(`
      *,
      admin_users!articles_author_id_fkey (
        full_name,
        email
      )
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  // Mock articles for demonstration
  const mockArticles = [
    {
      id: '1',
      title: 'Lorem Ipsum Dolor Sit Amet',
      slug: 'lorem-ipsum-dolor-sit-amet',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      featured_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      post_type: 'artikel',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      tags: ['Lorem', 'Ipsum', 'Dolor', 'Consectetur', 'Adipiscing'],
      admin_users: {
        full_name: 'Lorem Ipsum',
        email: 'lorem@example.com'
      }
    },
    {
      id: '2',
      title: 'Consectetur Adipiscing Elite',
      slug: 'consectetur-adipiscing-elite',
      content: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      excerpt: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      featured_image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      post_type: 'guide',
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id-2',
      tags: ['Consectetur', 'Adipiscing', 'Tempor'],
      admin_users: {
        full_name: 'Dolor Sit',
        email: 'dolor@example.com'
      }
    },
    {
      id: '3',
      title: 'Sed Do Eiusmod Tempor Incididunt',
      slug: 'sed-do-eiusmod-tempor-incididunt',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      tags: ['Business', 'Strategy', 'Pricing', 'Development', 'Technology', 'SaaS'],
      admin_users: {
        full_name: 'Manne',
        email: 'manne@bearbetar.se'
      }
    },
    {
      id: '4',
      title: 'Ut Enim Ad Minim Veniam',
      slug: 'ut-enim-ad-minim-veniam',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      excerpt: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id-2',
      tags: ['WordPress', 'CMS', 'PHP', 'Development'],
      admin_users: {
        full_name: 'Adam',
        email: 'adam@bearbetar.se'
      }
    },
    {
      id: '5',
      title: 'Excepteur Sint Occaecat Cupidatat',
      slug: 'excepteur-sint-occaecat-cupidatat',
      content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      excerpt: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      featured_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id-2',
      tags: ['Design', 'UX', 'UI', 'Best Practices', 'Tips'],
      admin_users: {
        full_name: 'Adam',
        email: 'adam@bearbetar.se'
      }
    }
  ]

  // Use mock articles if no real articles found, and ensure post_type is set
  const articlesToShow = recentArticles && recentArticles.length > 0 
    ? recentArticles.map(article => ({ ...article, post_type: article.post_type || 'artikel' }))
    : mockArticles
  
  // Ensure type consistency
  const typedArticlesToShow = articlesToShow as Article[]

  // Mock portfolio projects for demonstration
  const mockProjects = [
    {
      id: '1',
      title: 'Lorem Ipsum Project Alpha',
      slug: 'lorem-ipsum-project-alpha',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
      featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
      project_type: 'Lorem Type',
      client_name: 'Lorem Client AB',
      project_url: null,
      completion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      technologies_used: 'Lorem, Ipsum, Dolor, Consectetur',
      published: true,
      published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['Lorem', 'Ipsum', 'Dolor', 'Consectetur'],
      tags: [
        { id: '1', name: 'Lorem', slug: 'lorem', created_at: new Date().toISOString() },
        { id: '2', name: 'Ipsum', slug: 'ipsum', created_at: new Date().toISOString() },
        { id: '3', name: 'Dolor', slug: 'dolor', created_at: new Date().toISOString() },
        { id: '4', name: 'Sit', slug: 'sit', created_at: new Date().toISOString() }
      ],
      category: 'Lorem Category'
    },
    {
      id: '2',
      title: 'Lorem Ipsum Project Beta',
      slug: 'lorem-ipsum-project-beta',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      excerpt: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      featured_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center',
      project_type: 'Ipsum Type',
      client_name: 'Dolor Client Inc',
      project_url: null,
      completion_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'Analys av användning och effektivisering av bokningsprocessen.',
      technologies_used: 'React, Node.js, MongoDB, Calendly API',
      published: true,
      published_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['React', 'Node.js', 'MongoDB', 'Calendly API'],
      tags: [
        { id: '5', name: 'Bokning', slug: 'bokning', created_at: new Date().toISOString() },
        { id: '6', name: 'Schema', slug: 'schema', created_at: new Date().toISOString() },
        { id: '7', name: 'Frisör', slug: 'frisor', created_at: new Date().toISOString() },
        { id: '8', name: 'Tjänster', slug: 'tjanster', created_at: new Date().toISOString() },
        { id: '9', name: 'Automation', slug: 'automation', created_at: new Date().toISOString() }
      ],
      category: 'Systemutveckling'
    },
    {
      id: '3',
      title: 'Mobile Application Lorem Ipsum',
      slug: 'mobile-application-lorem-ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.',
      featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
      project_type: 'Mobile App',
      client_name: null,
      project_url: null,
      completion_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit et dolore magna aliqua.',
      technologies_used: 'React Native, Firebase, TypeScript',
      published: true,
      published_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['React Native', 'Firebase', 'TypeScript'],
      tags: [
        { id: '10', name: 'Health', slug: 'health', created_at: new Date().toISOString() },
        { id: '11', name: 'Fitness', slug: 'fitness', created_at: new Date().toISOString() },
        { id: '12', name: 'Mobile', slug: 'mobile', created_at: new Date().toISOString() },
        { id: '13', name: 'Tracking', slug: 'tracking', created_at: new Date().toISOString() }
      ],
      category: 'Mobile Development'
    },
    {
      id: '4',
      title: 'Corporate Website Lorem Ipsum',
      slug: 'corporate-website-lorem-ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.',
      featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      project_type: 'Corporate Website',
      client_name: 'Professional Services AB',
      project_url: null,
      completion_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit et dolore magna aliqua.',
      technologies_used: 'WordPress, PHP, MySQL, SCSS',
      published: true,
      published_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['WordPress', 'PHP', 'MySQL', 'SCSS'],
      tags: [
        { id: '2', name: 'Corporate', slug: 'corporate', created_at: new Date().toISOString() },
        { id: '14', name: 'CMS', slug: 'cms', created_at: new Date().toISOString() },
        { id: '15', name: 'SEO', slug: 'seo', created_at: new Date().toISOString() },
        { id: '16', name: 'Responsive', slug: 'responsive', created_at: new Date().toISOString() },
        { id: '17', name: 'WordPress', slug: 'wordpress', created_at: new Date().toISOString() },
        { id: '18', name: 'Performance', slug: 'performance', created_at: new Date().toISOString() }
      ],
      category: 'Web Development'
    },
    {
      id: '5',
      title: 'Educational Platform Lorem Ipsum',
      slug: 'educational-platform-lorem-ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.',
      featured_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&crop=center',
      project_type: 'Learning Platform',
      client_name: 'Education Center Lorem',
      project_url: null,
      completion_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit et dolore magna aliqua.',
      technologies_used: 'Vue.js, Laravel, PostgreSQL, Docker',
      published: true,
      published_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['Vue.js', 'Laravel', 'PostgreSQL', 'Docker'],
      tags: [
        { id: '19', name: 'Education', slug: 'education', created_at: new Date().toISOString() },
        { id: '20', name: 'Learning', slug: 'learning', created_at: new Date().toISOString() },
        { id: '21', name: 'Platform', slug: 'platform', created_at: new Date().toISOString() },
        { id: '22', name: 'Interactive', slug: 'interactive', created_at: new Date().toISOString() }
      ],
      category: 'EdTech'
    }
  ]


  return (
    <div className="flex flex-col">
      <HeroSection>
        <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl animate-slide-up">
          Welcome to{' '}
          <span className="text-primary">
            Bearbetar
          </span>
        </h1>
        <p className="mt-6 text-base text-muted-foreground sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none animate-slide-up-delayed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up-delayed-2">
          <Button asChild size="lg" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/kontakt">Get in Touch</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/tjanster">Our Services</Link>
          </Button>
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="relative py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container">
          <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl animate-slide-up">
            What We Do
          </h2>
          <p className="mt-4 text-center text-muted-foreground animate-slide-up-delayed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor!
          </p>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="animate-card-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-8 w-8 text-primary" />
                  <CardTitle>Websites</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-8 w-8 text-primary" />
                  <CardTitle>Applications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-3">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-8 w-8 text-primary" />
                  <CardTitle>Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-4">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Coffee className="h-8 w-8 text-primary" />
                  <CardTitle>Consulting</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </section>

      {/* Portfolio Carousel */}
      <section className="container py-16 animate-scale-in">
        <PortfolioCarousel
          projects={mockProjects}
          title="Latest Projects"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor"
        />
      </section>

      {/* Article Carousel */}
      <section className="container py-16 animate-scale-in-delayed">
        <ArticleCarousel
          articles={typedArticlesToShow}
          title="Latest Articles"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor"
        />
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Do You Have a Project in Mind?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="min-h-[44px] w-full sm:w-auto">
                <Link href="/kontakt">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}