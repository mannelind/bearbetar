import { createServerComponentClient } from '@/lib/supabase'
import { ArticlesList } from '@/components/admin/articles-list'

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
  tags: string[] | null
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

  return <ArticlesList articles={articles || []} />
}