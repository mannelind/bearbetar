import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createServerComponentClient } from '@/lib/supabase'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createServerComponentClient()
  
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      admin_users!articles_author_id_fkey (
        full_name,
        email
      )
    `)
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      {/* Back Navigation */}
      <section className="container py-8">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till bloggen
          </Link>
        </Button>
      </section>

      {/* Article Header */}
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
            <div className="flex items-center gap-2 text-muted-foreground mb-8">
              <User className="h-4 w-4" />
              <span>
                Av {article.admin_users.full_name || article.admin_users.email}
              </span>
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

      {/* Article Content */}
      <section className="container py-8">
        <div className="mx-auto max-w-4xl">
          <article className="prose prose-lg max-w-none dark:prose-invert">
            {/* Convert line breaks to proper HTML */}
            <div dangerouslySetInnerHTML={{ 
              __html: article.content
                .split('\n')
                .map((line: string) => line.trim())
                .filter((line: string) => line.length > 0)
                .map((line: string) => `<p>${line}</p>`)
                .join('')
            }} />
          </article>
        </div>
      </section>

      {/* Article Footer / CTA */}
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
    </div>
  )
}