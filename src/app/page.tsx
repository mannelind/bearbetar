import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArticleCarousel } from '@/components/ui/article-carousel'
import { PortfolioCarousel } from '@/components/ui/portfolio-carousel'
import { HeroSection } from '@/components/ui/hero-section'
import { createServerComponentClient } from '@/lib/supabase'
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
      title: 'Varför Next.js är vårt favoritramverk',
      slug: 'varfor-nextjs-ar-vart-favoritramverk',
      excerpt: 'Vi har testat massor av ramverk genom åren, men Next.js har verkligen imponerat på oss. Här berättar vi varför det blivit vårt första val för nya projekt.',
      featured_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center',
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Next.js', 'React', 'JavaScript', 'Webbutveckling', 'Framework'],
      admin_users: {
        full_name: 'Manne',
        email: 'manne@bearbetar.se'
      }
    },
    {
      id: '2',
      title: 'Så designar man för användbarhet',
      slug: 'sa-designar-man-for-anvandbarhet',
      excerpt: 'Användarupplevelse handlar inte bara om att något ser snyggt ut. Det ska framför allt vara lätt att använda. Här är våra bästa tips för bättre UX.',
      featured_image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center',
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['UX', 'Design', 'Användbarhet'],
      admin_users: {
        full_name: 'Adam',
        email: 'adam@bearbetar.se'
      }
    },
    {
      id: '3',
      title: 'Månadsabonnemang vs engångsköp',
      slug: 'manadsabonnemang-vs-engangskop',
      excerpt: 'Varför vi tror på månadsabonnemang för webbplatser och appar. Det blir bättre för alla parter - både kunder och utvecklare.',
      featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center',
      published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Affärsmodell', 'Prenumeration', 'Prissättning', 'Strategi', 'Webbutveckling', 'SaaS'],
      admin_users: {
        full_name: 'Manne',
        email: 'manne@bearbetar.se'
      }
    },
    {
      id: '4',
      title: 'WordPress vs modern utveckling',
      slug: 'wordpress-vs-modern-utveckling',
      excerpt: 'WordPress får mycket skit från utvecklare, men för många användningsområden är det fortfarande ett bra val. Vi förklarar när och varför.',
      featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center',
      published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['WordPress', 'CMS', 'PHP', 'Webbutveckling'],
      admin_users: {
        full_name: 'Adam',
        email: 'adam@bearbetar.se'
      }
    },
    {
      id: '5',
      title: 'Så undviker du vanliga designmisstag',
      slug: 'sa-undviker-du-vanliga-designmisstag',
      excerpt: 'Vi har sett samma designmisstag om och om igen. Här är de vanligaste fällorna och hur du undviker dem i ditt nästa projekt.',
      featured_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop&crop=center',
      published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Design', 'UX', 'UI', 'Bästa praxis', 'Tips'],
      admin_users: {
        full_name: 'Adam',
        email: 'adam@bearbetar.se'
      }
    }
  ]

  // Use mock articles if no real articles found
  const articlesToShow = recentArticles && recentArticles.length > 0 ? recentArticles : mockArticles

  // Mock portfolio projects for demonstration
  const mockProjects = [
    {
      id: '1',
      title: 'E-handelsplattform för lokalföretag',
      slug: 'e-handelsplattform-lokalforetag',
      description: 'Modern e-handelslösning med fokus på användarvänlighet och snabba laddningstider. Integrerad betalning och lagerhantering.',
      featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
      project_url: null,
      github_url: null,
      technologies: ['Next.js', 'Stripe', 'Supabase', 'Tailwind CSS'],
      tags: ['E-handel', 'Företag', 'Betalning', 'Lager'],
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Webbutveckling'
    },
    {
      id: '2',
      title: 'Bokningssystem för frisörsalong',
      slug: 'bokningssystem-frisor',
      description: 'Digitalt bokningssystem som gjorde det enkelt för kunder att boka tid och för personalen att hantera schema.',
      featured_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center',
      project_url: null,
      github_url: null,
      technologies: ['React', 'Node.js', 'MongoDB', 'Calendly API'],
      tags: ['Bokning', 'Schema', 'Frisör', 'Tjänster', 'Automation'],
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Systemutveckling'
    },
    {
      id: '3',
      title: 'Mobilapp för träningslogg',
      slug: 'mobilapp-traningslogg',
      description: 'Enkel och intuitiv app för att logga träningspass och följa framsteg över tid. Fokus på användbarhet och motivation.',
      featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
      project_url: null,
      github_url: null,
      technologies: ['React Native', 'Firebase', 'TypeScript'],
      tags: ['Träning', 'Hälsa', 'Mobilapp', 'Motivation'],
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Mobilutveckling'
    },
    {
      id: '4',
      title: 'Företagshemsida med CMS',
      slug: 'foretagshemsida-cms',
      description: 'Responsiv företagswebbplats med enkelt innehållshanteringssystem. Optimerad för SEO och snabba laddningstider.',
      featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      project_url: null,
      github_url: null,
      technologies: ['WordPress', 'PHP', 'MySQL', 'SCSS'],
      tags: ['Företag', 'CMS', 'SEO', 'Responsiv', 'WordPress', 'Snabbhet'],
      created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Webbutveckling'
    },
    {
      id: '5',
      title: 'Pedagogisk lärplattform',
      slug: 'pedagogisk-larplattform',
      description: 'Interaktiv lärplattform med fokus på pedagogik och användbarhet. Framtagen med lärares input för bästa resultat.',
      featured_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&crop=center',
      project_url: null,
      github_url: null,
      technologies: ['Vue.js', 'Laravel', 'PostgreSQL', 'Docker'],
      tags: ['Utbildning', 'Lärare', 'Pedagogik', 'Interaktiv'],
      created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'EdTech'
    }
  ]


  return (
    <div className="flex flex-col">
      <HeroSection>
        <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl animate-slide-up">
          Välkommen till{' '}
          <span className="text-primary">
            Bearbetar
          </span>
        </h1>
        <p className="mt-6 text-base text-muted-foreground sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none animate-slide-up-delayed">
          Vi är öppna för kunder och tar redan emot projekt! Webbplatser, appar och systemlösningar. 
          Kompetens inom utveckling, design, pedagogik och UX - allt för att skapa lösningar som verkligen fungerar.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up-delayed-2">
          <Button asChild size="lg" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/kontakt">Hör av dig</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/tjanster">Våra tjänster</Link>
          </Button>
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="relative py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container">
          <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl animate-slide-up">
            Vad vi gör
          </h2>
          <p className="mt-4 text-center text-muted-foreground animate-slide-up-delayed">
            Det här erbjuder vi redan idag - hemsidan håller vi på att färdigställa!
          </p>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="animate-card-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-8 w-8 text-primary" />
                  <CardTitle>Webbsidor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Modern webbutveckling med WordPress, React och Next.js. Månadsabonnemang för att göra professionell design tillgänglig för fler.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-8 w-8 text-primary" />
                  <CardTitle>Appar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mobilappar och webappar som löser verkliga problem. Från enkla verktyg till avancerade systemlösningar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-3">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-8 w-8 text-primary" />
                  <CardTitle>Utveckling</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Skräddarsydd mjukvara, automatisering och system som passar dina behov. Vi gillar att hitta smarta lösningar på krångliga problem.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-4">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Coffee className="h-8 w-8 text-primary" />
                  <CardTitle>Rådgivning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  UX-design, grafisk formgivning och rådgivning inom teknik och pedagogik. Vi hjälper dig hitta rätt väg framåt.
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
          title="Senaste projekt"
          description="Ett urval av projekt vi arbetat med - från webbplatser till mobilappar"
        />
      </section>

      {/* Article Carousel */}
      <section className="container py-16 animate-scale-in-delayed">
        <ArticleCarousel
          articles={articlesToShow}
          title="Senaste inläggen"
          description="Tips, tankar och berättelser från vårt dagliga liv som utvecklare"
        />
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Har du ett projekt i åtanke?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hör av dig så tar vi en kaffe och pratar om vad vi kan hjälpa dig med.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="min-h-[44px] w-full sm:w-auto">
                <Link href="/kontakt">Hör av dig</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}