import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminPageWrapper } from '@/components/auth/admin-page-wrapper'
import { createServerComponentClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import { Plus, Eye, Edit, Trash2, Image as ImageIcon, FileText } from 'lucide-react'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'] & {
  admin_users?: Database['public']['Tables']['admin_users']['Row']
  portfolio_categories?: Database['public']['Tables']['portfolio_categories']['Row'][]
  tags?: Database['public']['Tables']['tags']['Row'][]
}

async function PortfolioList() {
  const supabase = await createServerComponentClient()

  const { data: portfolioItems, error } = await supabase
    .from('portfolio_items')
    .select(`
      *,
      admin_users!portfolio_items_author_id_fkey (
        full_name,
        email
      ),
      portfolio_item_categories (
        portfolio_categories (
          id,
          name,
          slug
        )
      ),
      portfolio_item_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching portfolio items:', error)
    return <div>Error loading portfolio items</div>
  }

  // Transform the data to flatten categories and tags
  const transformedItems = portfolioItems?.map(item => ({
    ...item,
    portfolio_categories: item.portfolio_item_categories?.map((pc: any) => pc.portfolio_categories).filter(Boolean) || [],
    tags: item.portfolio_item_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">Hantera dina portfolioarbeten och case studies</p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="h-4 w-4 mr-2" />
            Nytt Portfolio Item
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {transformedItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Inga portfolio items än</h3>
                <p className="text-muted-foreground mb-4">
                  Skapa ditt första portfolioarbete eller case study
                </p>
                <Button asChild>
                  <Link href="/admin/portfolio/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Skapa Portfolio Item
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          transformedItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <Badge variant={item.project_type === 'case_study' ? 'default' : 'secondary'}>
                        {item.project_type === 'case_study' ? (
                          <>
                            <FileText className="h-3 w-3 mr-1" />
                            Case Study
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Portfolio
                          </>
                        )}
                      </Badge>
                      {!item.published && <Badge variant="outline">Opublicerad</Badge>}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Slug: {item.slug}</p>
                      {item.client_name && <p>Klient: {item.client_name}</p>}
                      {item.completion_date && (
                        <p>Slutförd: {new Date(item.completion_date).toLocaleDateString('sv-SE')}</p>
                      )}
                      <p>
                        Skapad: {new Date(item.created_at).toLocaleDateString('sv-SE')} 
                        av {item.admin_users?.full_name || item.admin_users?.email}
                      </p>
                    </div>

                    {item.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.excerpt}
                      </p>
                    )}

                    {/* Categories */}
                    {item.portfolio_categories && item.portfolio_categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.portfolio_categories.map((category: any) => (
                          <Badge key={category.id} variant="outline" className="text-xs">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.map((tag: any) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            #{tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {item.published && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/portfolio/${item.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/portfolio/${item.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {item.featured_image && (
                <CardContent className="pt-0">
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={item.featured_image} 
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default function AdminPortfolioPage() {
  return (
    <AdminPageWrapper>
      <Suspense fallback={<div>Loading portfolio items...</div>}>
        <PortfolioList />
      </Suspense>
    </AdminPageWrapper>
  )
}