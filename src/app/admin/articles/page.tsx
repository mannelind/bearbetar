import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createServerComponentClient } from '@/lib/supabase'
import { ADMIN_ROUTES } from '@/lib/constants'
import { 
  Plus, 
  Edit, 
  Eye, 
  Calendar,
  FileText
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author_id: string
  admin_users: {
    full_name: string | null
    email: string
  }
}

export default async function ArticlesPage() {
  const supabase = await createServerComponentClient()
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      *,
      admin_users!articles_author_id_fkey (
        full_name,
        email
      )
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
  }

  const publishedCount = articles?.filter(a => a.published).length || 0
  const draftCount = articles?.filter(a => !a.published).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artiklar</h1>
          <p className="text-muted-foreground">
            Hantera blogginlägg och artiklar
          </p>
        </div>
        <Button asChild>
          <Link href={ADMIN_ROUTES.newArticle}>
            <Plus className="mr-2 h-4 w-4" />
            Ny Artikel
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicerade</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utkast</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Alla Artiklar</CardTitle>
          <CardDescription>
            {articles?.length || 0} artikel{(articles?.length || 0) !== 1 ? 'ar' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!articles || articles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Inga artiklar än</h3>
              <p className="text-muted-foreground">
                Skapa din första artikel för att komma igång.
              </p>
              <Button asChild className="mt-4">
                <Link href={ADMIN_ROUTES.newArticle}>
                  <Plus className="mr-2 h-4 w-4" />
                  Skapa första artikeln
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article: Article) => (
                <div 
                  key={article.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{article.title}</h3>
                      <Badge variant={article.published ? "default" : "secondary"}>
                        {article.published ? "Publicerad" : "Utkast"}
                      </Badge>
                    </div>
                    
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Av {article.admin_users?.full_name || article.admin_users?.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(article.updated_at), { 
                          addSuffix: true, 
                          locale: sv 
                        })}
                      </span>
                      {article.published && article.published_at && (
                        <span>
                          Publicerad {formatDistanceToNow(new Date(article.published_at), { 
                            addSuffix: true, 
                            locale: sv 
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {article.published && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}