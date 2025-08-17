'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { ContentModal } from '@/components/ui/content-modal'
import { FileText, Info, Tag as TagIcon, ArrowRight } from 'lucide-react'

type Article = Database['public']['Tables']['articles']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
  author?: Database['public']['Tables']['admin_users']['Row']
}

interface BlogModalProps {
  article: Article | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BlogModal({ article, open, onOpenChange }: BlogModalProps) {
  console.log('BlogModal render:', { article: article?.title, open })
  console.log('Supabase env vars:', { 
    url: process.env.NEXT_PUBLIC_SUPABASE_URL, 
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing' 
  })
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const [fullArticle, setFullArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFullArticle = useCallback(async (articleId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_categories (
            categories (
              id,
              name,
              slug
            )
          ),
          article_tags (
            tags (
              id,
              name,
              slug
            )
          ),
          admin_users (
            id,
            email,
            full_name,
            bio,
            profile_image,
            avatar_url,
            created_at,
            updated_at
          )
        `)
        .eq('id', articleId)
        .single()

      if (error) {
        console.error('Error loading article:', error)
        
        // If this is development and we're using mock data, create a mock full article
        if (process.env.NODE_ENV === 'development' && article) {
          console.log('Using mock article data for development...')
          const mockFullArticle: Article = {
            ...article,
            content: `<div class="space-y-6">
              <p>Detta är mock-innehåll för artikeln "<strong>${article.title}</strong>" i utvecklingsläge.</p>
              
              <p>I en riktig miljö skulle detta innehåll komma från Supabase-databasen och innehålla den fullständiga artikeltexten med formatering. Detta är en mycket lång text som ska visa hur scrollbaren fungerar när innehållet är längre än vad som får plats i modal-fönstret.</p>
              
              <h2>Om denna artikel</h2>
              <p>${article.excerpt || 'Ingen sammanfattning tillgänglig.'}</p>
              
              <p>Detta är bara en demonstration av hur modal-fönstret fungerar när en artikel öppnas. Vi vill se till att scrollbaren visas korrekt när innehållet är för långt för att få plats i modal-fönstret.</p>
              
              <h2>Mer innehåll för att testa scrollning</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              
              <h2>Ännu mer text</h2>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              
              <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
              
              <h2>Tekniska detaljer</h2>
              <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
              
              <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?</p>
              
              <h2>Sammanfattning</h2>
              <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
              
              <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
              
              <blockquote class="border-l-4 border-primary pl-4 italic">
                "I produktionsmiljön kommer detta att ersättas med verkligt innehåll från databasen. Detta längre mock-innehåll hjälper oss att testa scrollning-funktionaliteten."
              </blockquote>
              
              <h2>Slutkommentar</h2>
              <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
              
              <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
            </div>`,
            categories: [],
            tags: [],
            author: {
              id: 'mock',
              email: 'demo@bearbetar.se',
              full_name: 'Demo Författare',
              bio: 'Detta är en demo-författare för utvecklingsläge.',
              profile_image: null,
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
          setFullArticle(mockFullArticle)
          setLoading(false)
          return
        }
        
        setError('Kunde inte ladda artikeln. Försök igen senare.')
        setLoading(false)
        return
      }

      if (data) {
        const transformedArticle: Article = {
          ...data,
          categories: data.article_categories?.map((ac: any) => ac.categories).filter(Boolean) || [],
          tags: data.article_tags?.map((at: any) => at.tags).filter(Boolean) || [],
          author: data.admin_users
        }
        setFullArticle(transformedArticle)
      }
    } catch (err) {
      console.error('Supabase connection failed:', err)
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development' && article) {
        console.log('Using mock article data as fallback...')
        const mockFullArticle: Article = {
          ...article,
          content: `<div class="space-y-6">
            <p>Detta är mock-innehåll för artikeln "<strong>${article.title}</strong>" (fallback-läge).</p>
            
            <p>Supabase-anslutningen misslyckades, så vi visar mock-data istället i utvecklingsläge. Detta är en mycket lång text som ska visa hur scrollbaren fungerar när innehållet är längre än vad som får plats i modal-fönstret.</p>
            
            <h2>Artikel-sammanfattning</h2>
            <p>${article.excerpt || 'Ingen sammanfattning tillgänglig.'}</p>
            
            <p>I produktionsmiljön skulle detta visa det verkliga innehållet från databasen. Vi vill se till att scrollbaren visas korrekt när innehållet är för långt för att få plats i modal-fönstret.</p>
            
            <h2>Ytterligare innehåll för scrolltest</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
            <h2>Mer test-innehåll</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            
            <h2>Fallback-läge information</h2>
            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?</p>
          </div>`,
          categories: [],
          tags: [],
          author: {
            id: 'mock',
            email: 'demo@bearbetar.se',
            full_name: 'Demo Författare',
            bio: 'Mock-författare för utvecklingsläge.',
            profile_image: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
        setFullArticle(mockFullArticle)
      } else {
        setError('Anslutningen misslyckades. Kontrollera din internetanslutning och försök igen.')
      }
    }

    setLoading(false)
  }, [supabase, article])

  useEffect(() => {
    if (open && article && !fullArticle) {
      loadFullArticle(article.id)
    }
    if (!open) {
      setFullArticle(null)
      setError(null)
    }
  }, [open, article, fullArticle, loadFullArticle])

  const handleRetry = () => {
    if (article) {
      loadFullArticle(article.id)
    }
  }

  // Create example related articles (in real app, this would come from admin/database)
  const relatedArticles = fullArticle ? [
    {
      id: 'article-2',
      title: 'Hur man optimerar React-applikationer för bättre prestanda',
      excerpt: 'Lär dig de bästa teknikerna för att förbättra din React-apps prestanda och användarupplevelse.',
      featured_image: '/images/react-optimization.jpg',
      type: 'article' as const,
      onClick: () => console.log('Navigate to article 2')
    },
    {
      id: 'portfolio-1', 
      title: 'E-handelsplattform för Skandinavisk Design',
      excerpt: 'Ett fullständigt e-handelsprojekt med modern design och avancerad funktionalitet.',
      featured_image: '/images/ecommerce-project.jpg',
      type: 'portfolio' as const,
      onClick: () => console.log('Navigate to portfolio 1')
    },
    {
      id: 'service-1',
      title: 'Webbutvecklingstjänster',
      excerpt: 'Professionell webbutveckling från koncept till lansering med modern teknologi.',
      type: 'service' as const,
      onClick: () => console.log('Navigate to service 1')
    }
  ] : []

  // Create quick links for article sections
  const quickLinks = fullArticle ? [
    { id: 'content-top', label: 'Tillbaka till toppen', icon: <FileText className="h-3 w-3" /> },
    { id: 'om-denna-artikel', label: 'Om denna artikel', icon: <Info className="h-3 w-3" /> },
    { id: 'mer-innehåll-för-att-testa-scrollning', label: 'Mer innehåll', icon: <FileText className="h-3 w-3" /> },
    { id: 'ännu-mer-text', label: 'Ännu mer text', icon: <FileText className="h-3 w-3" /> },
    { id: 'tekniska-detaljer', label: 'Tekniska detaljer', icon: <TagIcon className="h-3 w-3" /> },
    { id: 'sammanfattning', label: 'Sammanfattning', icon: <Info className="h-3 w-3" /> },
    { id: 'slutkommentar', label: 'Slutkommentar', icon: <FileText className="h-3 w-3" /> },
    ...(relatedArticles.length > 0 ? [{ id: 'relaterat-innehall', label: 'Relaterat innehåll', icon: <ArrowRight className="h-3 w-3" /> }] : [])
  ] : []

  // Transform article to ContentItem format
  const contentItem = fullArticle ? {
    id: fullArticle.id,
    title: fullArticle.title,
    excerpt: fullArticle.excerpt || undefined,
    featured_image: fullArticle.featured_image || undefined,
    created_at: fullArticle.created_at,
    updated_at: fullArticle.updated_at || undefined,
    content: fullArticle.content || undefined,
    categories: fullArticle.categories?.map(cat => ({ id: cat.id, name: cat.name })) || [],
    tags: fullArticle.tags?.map(tag => ({ id: tag.id, name: tag.name })) || [],
    author: fullArticle.author ? {
      full_name: fullArticle.author.full_name || undefined,
      email: fullArticle.author.email,
      avatar_url: fullArticle.author.avatar_url || undefined
    } : undefined
  } : null

  return (
    <ContentModal
      item={contentItem}
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      showReadingTime={true}
      showAuthor={true}
      showDates={true}
      showCategories={true}
      showTags={true}
      quickLinks={quickLinks}
      relatedItems={relatedArticles}
    />
  )
}