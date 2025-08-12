import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Eye } from 'lucide-react'
import { ADMIN_ROUTES } from '@/lib/constants'
import { createServerComponentClient } from '@/lib/supabase'
import { ArticleForm } from '@/components/forms/article-form'
import AdminPageWrapper from '@/components/auth/admin-page-wrapper'

interface EditArticlePageProps {
  params: {
    id: string
  }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const supabase = await createServerComponentClient()
  
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_tags!inner (
        tags (
          name
        )
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !article) {
    notFound()
  }

  // Transform article to include tags array
  const articleWithTags = {
    ...article,
    tags: article.article_tags?.map((at: any) => at.tags.name) || []
  }

  return (
    <AdminPageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ADMIN_ROUTES.articles}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tillbaka till artiklar
              </Link>
            </Button>
          </div>
          
          {article.published && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${article.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Visa publicerad
              </Link>
            </Button>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Redigera Artikel</h1>
          <p className="text-muted-foreground">
            {article.title}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Artikeldetaljer</CardTitle>
          </CardHeader>
          <CardContent>
            <ArticleForm article={articleWithTags} />
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  )
}