import { Metadata } from 'next'
import { SEO } from './constants'

export interface GenerateMetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export function generateMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const {
    title,
    description = SEO.description.default,
    keywords = [],
    image = '/og-image.svg',
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = SEO.author,
    section,
    tags = [],
  } = options

  const fullTitle = title ? `${title} | Bearbetar` : SEO.title.default
  const fullDescription = description || SEO.description.default
  const fullKeywords = [...SEO.keywords, ...keywords]
  const fullUrl = url ? `${process.env.NEXT_PUBLIC_SITE_URL}${url}` : process.env.NEXT_PUBLIC_SITE_URL

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: [{ name: author }],
    creator: SEO.creator,
    publisher: SEO.publisher,
    openGraph: {
      type,
      locale: 'sv_SE',
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: 'Bearbetar',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@bearbetar',
      creator: '@bearbetar',
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },
    robots: SEO.robots,
    alternates: {
      canonical: fullUrl,
    },
  }

  return metadata
}

// Predefined metadata for common pages
export const pageMetadata = {
  home: () => generateMetadata({
    title: 'Webbutveckling, Mobilappar & Design',
    description: SEO.description.home,
    url: '/',
  }),

  services: () => generateMetadata({
    title: 'Våra Tjänster',
    description: SEO.description.services,
    url: '/tjanster',
  }),

  about: () => generateMetadata({
    title: 'Om Oss',
    description: SEO.description.about,
    url: '/om-oss',
  }),

  blog: () => generateMetadata({
    title: 'Blogg',
    description: SEO.description.blog,
    url: '/blog',
  }),

  portfolio: () => generateMetadata({
    title: 'Portfolio',
    description: SEO.description.portfolio,
    url: '/portfolio',
  }),

  contact: () => generateMetadata({
    title: 'Kontakt',
    description: SEO.description.contact,
    url: '/kontakt',
  }),

  article: (title: string, description: string, slug: string, publishedTime?: string, modifiedTime?: string, author?: string, tags?: string[]) => generateMetadata({
    title,
    description,
    url: `/blog/${slug}`,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    tags,
    keywords: [...SEO.keywords, ...(tags || [])],
  }),

  service: (title: string, description: string, slug: string) => generateMetadata({
    title,
    description,
    url: `/tjanster/${slug}`,
  }),

  portfolioItem: (title: string, description: string, slug: string) => generateMetadata({
    title,
    description,
    url: `/portfolio/${slug}`,
  }),
} 