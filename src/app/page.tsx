import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArticleCarousel } from '@/components/ui/article-carousel'
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

  const { data: featuredArticles } = await supabase
    .from('articles')
    .select(`
      *,
      admin_users!articles_author_id_fkey (
        full_name,
        email
      )
    `)
    .eq('published', true)
    .not('featured_image', 'is', null)
    .order('published_at', { ascending: false })
    .limit(6)

  return (
    <div className="flex flex-col">
      <HeroSection>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl animate-slide-up">
          Välkommen till{' '}
          <span className="text-primary">
            Bearbetar
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none animate-slide-up-delayed">
          Vi byggger webbplatser, appar och allt däremellan. Här delar vi också våra tankar, 
          tips och berättelser från livet som utvecklare och företagare.
        </p>
        <div className="mt-8 flex gap-4 justify-center lg:justify-start animate-slide-up-delayed-2">
          <Button asChild size="lg">
            <Link href="/kontakt">Hör av dig</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/tjanster">Våra tjänster</Link>
          </Button>
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="relative py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container">
          <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-slide-up">
            Vad vi gör
          </h2>
          <p className="mt-4 text-center text-muted-foreground animate-slide-up-delayed">
            Från enkla hemsidor till avancerade appar - vi hjälper dig att få det gjort
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
                  Snygga och snabba webbsidor som bara fungerar. Månadsabonnemang från 399 kr/mån.
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
                  Mobilappar och webappar som gör livet enklare för dig och dina kunder.
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
                  Skräddarsydd mjukvara, automatisering och allt annat du kan tänka dig.
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
                  Behöver du bara prata igenom en idé? Vi hjälper gärna till över en kopp kaffe.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </section>

      {/* Article Carousels */}
      {recentArticles && recentArticles.length > 0 && (
        <section className="container py-16 animate-scale-in">
          <ArticleCarousel
            articles={recentArticles}
            title="Senaste inläggen"
            description="Tips, tankar och berättelser från vårt dagliga liv som utvecklare"
          />
        </section>
      )}

      {featuredArticles && featuredArticles.length > 0 && (
        <section className="container py-16 animate-scale-in-delayed">
          <ArticleCarousel
            articles={featuredArticles}
            title="Populära inlägg"
            description="Det här gillar folk att läsa mest"
          />
        </section>
      )}

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
              <Button asChild size="lg">
                <Link href="/kontakt">Hör av dig</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}