import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArticleCarousel } from '@/components/ui/article-carousel'
import { createServerComponentClient } from '@/lib/supabase'
import { TrendingUp, Users, Target, BarChart3 } from 'lucide-react'

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
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Välkommen till{' '}
            <span className="bg-gradient-to-r from-primary-300 to-primary-800 bg-clip-text text-transparent">
              Bearbetar
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Vi hjälper företag att utvecklas och växa genom strategisk rådgivning, 
            affärsutveckling och professionella konsulttjänster.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/tjanster">Våra Tjänster</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/blog">Läs Mer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Våra Specialområden
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            Vi erbjuder professionella tjänster inom flera områden
          </p>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <CardTitle>Tillväxt</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Strategier för hållbar tillväxt och expansion av ditt företag.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Ledning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Utveckling av ledarskap och organisatorisk förmåga.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle>Strategi</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Affärsstrategier som driver resultat och konkurrensfördelar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <CardTitle>Analys</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Djupgående analys och datadriven beslutsfattning.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Article Carousels */}
      {recentArticles && recentArticles.length > 0 && (
        <section className="container py-16">
          <ArticleCarousel
            articles={recentArticles}
            title="Senaste Artiklar"
            description="Håll dig uppdaterad med våra senaste insikter och expertis"
          />
        </section>
      )}

      {featuredArticles && featuredArticles.length > 0 && (
        <section className="container py-16">
          <ArticleCarousel
            articles={featuredArticles}
            title="Utvalda Artiklar"
            description="Läs våra mest lästa och populära artiklar"
          />
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Redo att ta nästa steg?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Kontakta oss idag för att diskutera hur vi kan hjälpa ditt företag att nå sina mål.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/tjanster">Utforska Tjänster</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}