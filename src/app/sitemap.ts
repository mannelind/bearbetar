import { MetadataRoute } from 'next'
import { createServerComponentClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bearbetar.se'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tjanster`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/om-oss`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  try {
    // Fetch published articles
    const supabase = await createServerComponentClient()
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, published_at, updated_at')
      .eq('published', true)
      .order('published_at', { ascending: false })

    const articlePages = articles?.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updated_at || article.published_at || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []

    // Fetch published services
    const { data: services } = await supabase
      .from('services')
      .select('slug, updated_at')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    const servicePages = services?.map((service) => ({
      url: `${baseUrl}/tjanster/${service.slug}`,
      lastModified: new Date(service.updated_at || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })) || []

    // Fetch published portfolio items
    const { data: portfolioItems } = await supabase
      .from('portfolio_items')
      .select('slug, updated_at')
      .eq('published', true)
      .order('completion_date', { ascending: false })

    const portfolioPages = portfolioItems?.map((item) => ({
      url: `${baseUrl}/portfolio/${item.slug}`,
      lastModified: new Date(item.updated_at || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []

    return [...staticPages, ...articlePages, ...servicePages, ...portfolioPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return only static pages if database is not available
    return staticPages
  }
} 