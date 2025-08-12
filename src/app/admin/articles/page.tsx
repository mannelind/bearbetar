import { createServerComponentClient } from '@/lib/supabase'
import { ArticlesList } from '@/components/admin/articles-list'
import AdminPageWrapper from '@/components/auth/admin-page-wrapper'

export default async function ArticlesPage() {
  const supabase = await createServerComponentClient()
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      *,
      admin_users!articles_author_id_fkey (
        full_name,
        email
      ),
      article_tags (
        tags (
          name
        )
      )
    `)
    .order('updated_at', { ascending: false })

  // Transform articles to include tags array
  const articlesWithTags = articles?.map(article => ({
    ...article,
    tags: article.article_tags?.map((at: any) => at.tags.name) || []
  })) || []

  if (error) {
    console.error('Error fetching articles:', error)
  }

  return (
    <AdminPageWrapper>
      <ArticlesList articles={articlesWithTags} />
    </AdminPageWrapper>
  )
}