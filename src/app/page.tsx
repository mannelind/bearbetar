import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArticleCarousel } from '@/components/ui/article-carousel'
import { PortfolioCarousel } from '@/components/ui/portfolio-carousel'
import { HeroSection } from '@/components/ui/hero-section'
import { createServerComponentClient } from '@/lib/supabase'
import { Article } from '@/types'
import { Code, Globe, Smartphone, Coffee } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { OrganizationStructuredData, WebSiteStructuredData } from '@/components/seo/structured-data'
import { FAQStructuredData } from '@/components/seo/faq-structured-data'
import { ConstructionBanner } from '@/components/ui/construction-banner'

export const metadata: Metadata = pageMetadata.home()

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
      content: 'Vi har testat massor av ramverk genom åren, men Next.js har verkligen imponerat på oss. Här berättar vi varför det blivit vårt första val för nya projekt och vad som gör det så kraftfullt.',
      excerpt: 'Vi har testat massor av ramverk genom åren, men Next.js har verkligen imponerat på oss. Här berättar vi varför det blivit vårt första val för nya projekt.',
      featured_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      post_type: 'artikel',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
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
      content: 'Användarupplevelse handlar inte bara om att något ser snyggt ut. Det ska framför allt vara lätt att använda. Här är våra bästa tips för bättre UX och hur man skapar verkligt användbara gränssnitt.',
      excerpt: 'Användarupplevelse handlar inte bara om att något ser snyggt ut. Det ska framför allt vara lätt att använda. Här är våra bästa tips för bättre UX.',
      featured_image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      post_type: 'guide',
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id-2',
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
      content: 'Varför vi tror på månadsabonnemang för webbplatser och appar. Det blir bättre för alla parter - både kunder och utvecklare. Vi förklarar fördelarna och hur modellen fungerar i praktiken.',
      excerpt: 'Varför vi tror på månadsabonnemang för webbplatser och appar. Det blir bättre för alla parter - både kunder och utvecklare.',
      featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
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
      content: 'WordPress får mycket skit från utvecklare, men för många användningsområden är det fortfarande ett bra val. Vi förklarar när och varför du bör välja WordPress och när du bör satsa på modernare tekniker.',
      excerpt: 'WordPress får mycket skit från utvecklare, men för många användningsområden är det fortfarande ett bra val. Vi förklarar när och varför.',
      featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id-2',
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
      content: 'Vi har sett samma designmisstag om och om igen. Här är de vanligaste fällorna och hur du undviker dem i ditt nästa projekt. Från navigation till färgval - allt som kan gå snett.',
      excerpt: 'Vi har sett samma designmisstag om och om igen. Här är de vanligaste fällorna och hur du undviker dem i ditt nästa projekt.',
      featured_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop&crop=center',
      published: true,
      published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id-2',
      tags: ['Design', 'UX', 'UI', 'Bästa praxis', 'Tips'],
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
      title: 'E-handelsplattform för lokal butik',
      slug: 'e-handelsplattform-lokal-butik',
      description: 'En modern e-handelsplattform byggd för en lokal butik som ville ta steget in i digitala världen. Responsiv design och enkel administration.',
      content: 'En modern e-handelsplattform byggd för en lokal butik som ville ta steget in i digitala världen. Responsiv design och enkel administration.',
      excerpt: 'En modern e-handelsplattform byggd för en lokal butik som ville ta steget in i digitala världen.',
      featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
      project_type: 'E-handel',
      client_name: 'Lokal Butik AB',
      project_url: null,
      completion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'En modern e-handelsplattform byggd för en lokal butik som ville ta steget in i digitala världen. Responsiv design och enkel administration.',
      technologies_used: 'Next.js, Stripe, PostgreSQL, Tailwind CSS',
      published: true,
      published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
      tags: [
        { id: '1', name: 'E-handel', slug: 'e-handel', created_at: new Date().toISOString() },
        { id: '2', name: 'Webbutveckling', slug: 'webbutveckling', created_at: new Date().toISOString() },
        { id: '3', name: 'Responsiv', slug: 'responsiv', created_at: new Date().toISOString() },
        { id: '4', name: 'CMS', slug: 'cms', created_at: new Date().toISOString() }
      ],
      category: 'E-handel'
    },
    {
      id: '2',
      title: 'Bokningssystem för frisörsalong',
      slug: 'bokningssystem-frisorsalong',
      description: 'Ett enkelt och smidigt bokningssystem för en frisörsalong som ville digitalisera sin bokningsprocess. Kunder kan boka tider online och salongen får notifikationer.',
      content: 'Ett enkelt och smidigt bokningssystem för en frisörsalong som ville digitalisera sin bokningsprocess. Kunder kan boka tider online och salongen får notifikationer.',
      excerpt: 'Ett enkelt och smidigt bokningssystem för en frisörsalong som ville digitalisera sin bokningsprocess.',
      featured_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center',
      project_type: 'Bokningssystem',
      client_name: 'Frisörsalong Vackra',
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
      title: 'Fitness-app för träning hemma',
      slug: 'fitness-app-traning-hemma',
      description: 'En mobilapp för träning hemma med videor, scheman och spårning av framsteg. Byggd för att hjälpa folk hålla sig i form utan att behöva gå till gymmet.',
      content: 'En mobilapp för träning hemma med videor, scheman och spårning av framsteg. Byggd för att hjälpa folk hålla sig i form utan att behöva gå till gymmet.',
      excerpt: 'En mobilapp för träning hemma med videor, scheman och spårning av framsteg.',
      featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
      project_type: 'Mobilapp',
      client_name: null,
      project_url: null,
      completion_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'En mobilapp för träning hemma med videor, scheman och spårning av framsteg.',
      technologies_used: 'React Native, Firebase, TypeScript',
      published: true,
      published_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['React Native', 'Firebase', 'TypeScript'],
      tags: [
        { id: '10', name: 'Fitness', slug: 'fitness', created_at: new Date().toISOString() },
        { id: '11', name: 'Träning', slug: 'traning', created_at: new Date().toISOString() },
        { id: '12', name: 'Mobilapp', slug: 'mobilapp', created_at: new Date().toISOString() },
        { id: '13', name: 'Spårning', slug: 'sparning', created_at: new Date().toISOString() }
      ],
      category: 'Mobilutveckling'
    },
    {
      id: '4',
      title: 'Företagshemsida för konsultbolag',
      slug: 'foretagshemsida-konsultbolag',
      description: 'En professionell hemsida för ett konsultbolag som ville visa sina tjänster och kompetens på ett tydligt sätt. Fokus på konvertering och användarvänlighet.',
      content: 'En professionell hemsida för ett konsultbolag som ville visa sina tjänster och kompetens på ett tydligt sätt. Fokus på konvertering och användarvänlighet.',
      excerpt: 'En professionell hemsida för ett konsultbolag som ville visa sina tjänster och kompetens.',
      featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      project_type: 'Företagshemsida',
      client_name: 'Konsultbolag Pro',
      project_url: null,
      completion_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'En professionell hemsida för ett konsultbolag som ville visa sina tjänster och kompetens.',
      technologies_used: 'WordPress, PHP, MySQL, SCSS',
      published: true,
      published_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['WordPress', 'PHP', 'MySQL', 'SCSS'],
      tags: [
        { id: '2', name: 'Företag', slug: 'foretag', created_at: new Date().toISOString() },
        { id: '14', name: 'CMS', slug: 'cms', created_at: new Date().toISOString() },
        { id: '15', name: 'SEO', slug: 'seo', created_at: new Date().toISOString() },
        { id: '16', name: 'Responsiv', slug: 'responsiv', created_at: new Date().toISOString() },
        { id: '17', name: 'WordPress', slug: 'wordpress', created_at: new Date().toISOString() },
        { id: '18', name: 'Prestanda', slug: 'prestanda', created_at: new Date().toISOString() }
      ],
      category: 'Webbutveckling'
    },
    {
      id: '5',
      title: 'Läroplattform för distansutbildning',
      slug: 'laroplattform-distansutbildning',
      description: 'En digital läroplattform för distansutbildning med videolektioner, quiz och progressspårning. Byggd för att göra distansutbildning mer engagerande.',
      content: 'En digital läroplattform för distansutbildning med videolektioner, quiz och progressspårning. Byggd för att göra distansutbildning mer engagerande.',
      excerpt: 'En digital läroplattform för distansutbildning med videolektioner, quiz och progressspårning.',
      featured_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&crop=center',
      project_type: 'Läroplattform',
      client_name: 'Distansutbildning AB',
      project_url: null,
      completion_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      case_study_content: 'En digital läroplattform för distansutbildning med videolektioner, quiz och progressspårning.',
      technologies_used: 'Vue.js, Laravel, PostgreSQL, Docker',
      published: true,
      published_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      author_id: 'mock-author-id',
      technologies: ['Vue.js', 'Laravel', 'PostgreSQL', 'Docker'],
      tags: [
        { id: '19', name: 'Utbildning', slug: 'utbildning', created_at: new Date().toISOString() },
        { id: '20', name: 'Lärande', slug: 'larande', created_at: new Date().toISOString() },
        { id: '21', name: 'Plattform', slug: 'plattform', created_at: new Date().toISOString() },
        { id: '22', name: 'Interaktiv', slug: 'interaktiv', created_at: new Date().toISOString() }
      ],
      category: 'EdTech'
    }
  ]


  return (
    <>
      <OrganizationStructuredData
        data={{
          name: 'Bearbetar',
          url: 'https://bearbetar.se',
          logo: 'https://bearbetar.se/images/logo-lightmode.svg',
          description: 'Vi hjälper företag av alla storlekar med webbutveckling, mobilappar och design.',
          address: {
            streetAddress: 'Stockholm',
            addressLocality: 'Stockholm',
            postalCode: '10000',
            addressCountry: 'SE',
          },
          contactPoint: {
            telephone: '+46-70-123-4567',
            contactType: 'customer service',
            email: 'hej@bearbetar.se',
          },
          sameAs: [
            'https://twitter.com/bearbetar',
            'https://linkedin.com/company/bearbetar',
          ],
        }}
      />
      <WebSiteStructuredData
        data={{
          name: 'Bearbetar',
          url: 'https://bearbetar.se',
          description: 'Webbutveckling, mobilappar och design för moderna företag',
          potentialAction: {
            target: 'https://bearbetar.se/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <FAQStructuredData
        items={[
          {
            question: 'Vad erbjuder Bearbetar för tjänster?',
            answer: 'Vi erbjuder webbutveckling, mobilappar, skräddarsydd utveckling och designrådgivning för företag av alla storlekar.',
          },
          {
            question: 'Arbetar ni med alla typer av företag?',
            answer: 'Ja, vi hjälper företag av alla storlekar - från småföretag till större företag och privatpersoner.',
          },
          {
            question: 'Vilka tekniker använder ni?',
            answer: 'Vi använder moderna tekniker som React, Next.js, WordPress, React Native och andra moderna ramverk.',
          },
          {
            question: 'Tar ni emot kunder redan nu?',
            answer: 'Ja, vi tar emot kunder redan nu även om hemsidan fortfarande utvecklas!',
          },
          {
            question: 'Hur fungerar månadsabonnemanget?',
            answer: 'Vi erbjuder månadsabonnemang för webbplatser som gör professionell webbutveckling tillgänglig för fler företag.',
          },
        ]}
      />
      <div className="flex flex-col">
      <HeroSection>
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-secondary/20 backdrop-blur-sm rounded-full animate-slide-down no-border-override">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium text-secondary-foreground">Vi tar emot uppdrag!</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tighter leading-loose sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl animate-slide-up">
          Vi bygger{' '}
          <span className="text-primary">
            snygga grejer på nätet
          </span>
        </h1>
        <p className="mt-6 text-base text-muted-foreground sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none animate-slide-up-delayed">
          Webbutveckling, appar och design – vi fixar det mesta! Denna sida är fortfarande under konstruktion, 
          men vi tar gärna emot uppdrag redan nu. Säg vad du behöver så löser vi det.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up-delayed-2">
          <Button asChild size="lg" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/kontakt">Hör av dig</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/tjanster">Vad vi kan</Link>
          </Button>
        </div>
      </HeroSection>

      {/* Construction Banner */}
      <ConstructionBanner />

      {/* Features Section */}
      <section className="relative py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container">
          <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl animate-slide-up">
            Vad vi kan hjälpa dig med
          </h2>
          <p className="mt-4 text-center text-muted-foreground animate-slide-up-delayed">
            Från enkla webbsidor till komplicerade system - vi tar emot kunder redan nu! 
            <br />
            <span className="text-sm text-muted-foreground/70">Allt innehåll på denna sida är exempel/mocktext för demonstrationsändamål.</span>
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
                  Moderna, responsiva webbsidor som fungerar perfekt på alla enheter. Från enkla WordPress-sidor till avancerade React-applikationer.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-8 w-8 text-primary" />
                  <CardTitle>Mobilappar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  React Native för mobil och moderna webbappar. Vi hjälper från idé till färdig produkt - ingen app-butik-byråkrati om det inte behövs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="animate-card-3">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-8 w-8 text-primary" />
                  <CardTitle>Skräddarsydd utveckling</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Har du något specifikt du vill bygga? Vi kan utveckla allt från enkla verktyg till komplexa system. Säg vad du behöver så fixar vi det.
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
                  Kompetens inom pedagogik, UX-design och grafisk formgivning. Vi hjälper dig hitta rätt lösning och undvika dyra misstag.
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
          title="Senaste projekten"
          description="Här kommer vi visa projekt vi jobbar på. Än så länge är det tomt här, men det kommer fyllas på efterhand! Alla projekt som visas är exempel/mocktext."
        />
      </section>

      {/* Article Carousel */}
      <section className="container py-16 animate-scale-in-delayed">
        <ArticleCarousel
          articles={typedArticlesToShow}
          title="Senaste artiklarna"
          description="Tips, tankar och berättelser från vårt jobb som utvecklare. Plus lite random grejer vi tänker på. Alla artiklar som visas är exempel/mocktext."
        />
      </section>

      {/* Demo Notice */}
      <section className="bg-primary/10 py-8">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-lg font-semibold text-construction-banner-foreground mb-2">
              🚧 Demo/Utvecklingsversion
            </h3>
            <p className="text-sm text-construction-banner-foreground">
              Denna hemsida är under utveckling. Allt innehåll (artiklar, projekt, texter) är exempel/mocktext för demonstrationsändamål. 
              Verksamheten är igång och vi tar emot kunder redan nu!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Har du ett projekt i åtanke?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hör av dig så tar vi en kaffe och pratar om vad vi kan hjälpa dig med. Vi tar emot kunder redan nu!
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
    </>
  )
}