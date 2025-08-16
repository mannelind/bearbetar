import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createServerComponentClient } from '@/lib/supabase'
import { AnimatedSection, PageWrapper } from '@/components/ui/page-animations'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import { HtmlContent } from '@/components/ui/html-content'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  let article: any = null

  // Try to fetch from Supabase, fallback to mock data in development
  try {
    const supabase = await createServerComponentClient()
    
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        admin_users!articles_author_id_fkey (
          full_name,
          email,
          bio,
          profile_image
        )
      `)
      .eq('slug', params.slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('Error fetching article:', error)
      
      // Use mock data in development
      if (process.env.NODE_ENV === 'development') {
        const mockArticles: any = {
          'digitalisering-av-smaforetag-praktisk-guide': {
            id: '1',
            title: 'Digitalisering av småföretag - En praktisk guide',
            slug: 'digitalisering-av-smaforetag-praktisk-guide',
            excerpt: 'Lär dig hur ditt småföretag kan dra nytta av digitaliseringens möjligheter med praktiska tips och strategier.',
            content: `# Digitalisering av småföretag - En praktisk guide

Digitalisering är inte längre en luxury utan en nödvändighet för småföretag som vill vara konkurrenskraftiga. I denna guide går vi igenom de viktigaste stegen för att digitalisera ditt företag.

## Varför digitalisera?

Digitalisering erbjuder flera fördelar:
- Ökad effektivitet i arbetssätt
- Bättre kundupplevelse
- Tillgång till värdefull data
- Konkurrensfördelar

## Första stegen

1. **Kartlägg nuvarande processer** - Dokumentera hur arbetet fungerar idag
2. **Identifiera flaskhalsar** - Hitta områden som kan förbättras
3. **Prioritera förändringar** - Fokusera på det som ger störst effekt

## Tekniska lösningar

Några grundläggande verktyg att överväga:
- Molntjänster för lagring och samarbete
- CRM-system för kundhantering
- Automatiserade faktureringssystem
- E-handelslösningar

## Sammanfattning

Digitalisering behöver inte vara komplicerat. Börja smått, fokusera på användarnytta och bygg vidare steg för steg.`,
            published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            featured_image: null,
            admin_users: {
              full_name: 'Manne',
              email: 'manne@bearbetar.se',
              bio: 'Grundare och strateg med passion för affärsutveckling.',
              profile_image: null
            }
          }
        }
        
        article = mockArticles[params.slug]
      }
    } else {
      article = data
    }
  } catch (err) {
    console.error('Supabase connection failed:', err)
  }

  if (!article) {
    notFound()
  }

  return (
    <PageWrapper>
      {/* Back Navigation */}
      <AnimatedSection animation="fade-in">
        <section className="container py-8">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till bloggen
            </Link>
          </Button>
        </section>
      </AnimatedSection>

      {/* Article Header */}
      <AnimatedSection animation="slide-up">
        <section className="container py-8">
          <div className="mx-auto max-w-4xl">
            {/* Meta info */}
            <div className="flex items-center gap-4 mb-6">
              <Badge>Artikel</Badge>
              {article.published_at && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Publicerad {formatDistanceToNow(new Date(article.published_at), {
                    addSuffix: true,
                    locale: sv
                  })}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Author */}
            {article.admin_users && (
              <div className="flex items-center gap-3 text-muted-foreground mb-8">
                {article.admin_users.profile_image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                    <Image
                      src={article.admin_users.profile_image}
                      alt={article.admin_users.full_name || article.admin_users.email}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <User className="h-4 w-4" />
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {article.admin_users.full_name || article.admin_users.email}
                  </div>
                  {article.admin_users.bio && (
                    <div className="text-xs text-muted-foreground">
                      {article.admin_users.bio}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Featured Image */}
            {article.featured_image && (
              <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Article Content */}
      <AnimatedSection animation="scale-in">
        <section className="container py-8">
          <div className="mx-auto max-w-4xl">
            <HtmlContent 
              content={article.content}
              className="prose-lg"
            />
          </div>
        </section>
      </AnimatedSection>

      {/* Article Footer / CTA */}
      <AnimatedSection animation="slide-up-delayed">
        <section className="bg-muted/50 py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tighter">
                Behöver du hjälp med liknande utmaningar?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Kontakta oss för att diskutera hur vi kan hjälpa ditt företag.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/tjanster">
                    Se våra tjänster
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/blog">
                    Läs fler artiklar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </PageWrapper>
  )
}