import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createServerComponentClient } from '@/lib/supabase'
import { Calendar, User, ArrowRight, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

export default async function BlogPage() {
  // Fetch published articles
  const supabase = await createServerComponentClient()
  const { data: articles } = await supabase
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

  // Get latest article for featured section
  const featuredArticle = articles?.[0]
  const regularArticles = articles?.slice(1) || []

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-8">
            <Image 
              src="/images/logga.svg"
              alt="Bearbetar logotyp"
              width={200}
              height={80}
              className="w-auto h-16 md:h-20"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Vår{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Blogg
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Insikter, expertis och praktiska råd för att hjälpa ditt företag att växa och utvecklas.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight">Senaste Artikel</h2>
            <p className="text-muted-foreground">Vår allra senaste publikation</p>
          </div>
          
          <Card className="overflow-hidden max-w-4xl mx-auto">
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
                  
                  <CardTitle className="text-2xl">
                    <Link 
                      href={`/blog/${featuredArticle.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {featuredArticle.title}
                    </Link>
                  </CardTitle>
                  
                  {featuredArticle.excerpt && (
                    <CardDescription className="text-base">
                      {featuredArticle.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {featuredArticle.admin_users && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>
                        {featuredArticle.admin_users.full_name || featuredArticle.admin_users.email}
                      </span>
                    </div>
                  )}
                  
                  <Button asChild>
                    <Link href={`/blog/${featuredArticle.slug}`}>
                      Läs artikel
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Articles Grid */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Alla Artiklar</h2>
            <p className="text-muted-foreground">
              {articles?.length || 0} artikel{(articles?.length || 0) !== 1 ? 'ar' : ''} totalt
            </p>
          </div>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Inga artiklar ännu</h3>
            <p className="text-muted-foreground mb-8">
              Vi arbetar på att publicera vårt första innehåll. Kom tillbaka snart!
            </p>
            <Button asChild>
              <Link href="/">Tillbaka till startsidan</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularArticles.map((article: any) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/blog/${article.slug}`}>
                  {article.featured_image && (
                    <div className="aspect-video relative">
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Artikel</Badge>
                      {article.published_at && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(article.published_at), {
                            addSuffix: true,
                            locale: sv
                          })}
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>

                  {article.excerpt && (
                    <CardContent className="pt-0">
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardContent>
                  )}

                  {article.admin_users && (
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>
                          {article.admin_users.full_name || article.admin_users.email}
                        </span>
                      </div>
                    </CardContent>
                  )}
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Missa inga uppdateringar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Få våra senaste artiklar och insikter direkt i din inkorg.
            </p>
            <div className="mt-8">
              <Button size="lg">
                Prenumerera på nyhetsbrev
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}