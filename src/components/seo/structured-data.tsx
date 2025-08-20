'use client'

import Script from 'next/script'

interface OrganizationData {
  name: string
  url: string
  logo: string
  description: string
  address?: {
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
    email: string
  }
  sameAs?: string[]
}

interface ArticleData {
  headline: string
  description: string
  image: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
  datePublished: string
  dateModified: string
  url: string
}

interface ServiceData {
  name: string
  description: string
  provider: {
    name: string
    url: string
  }
  areaServed: string
  url: string
}

interface WebSiteData {
  name: string
  url: string
  description: string
  potentialAction: {
    target: string
    'query-input': string
  }
}

export function OrganizationStructuredData({ data }: { data: OrganizationData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    ...(data.address && {
      address: {
        '@type': 'PostalAddress',
        ...data.address,
      },
    }),
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...data.contactPoint,
      },
    }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  }

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function ArticleStructuredData({ data }: { data: ArticleData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author.name,
      ...(data.author.url && { url: data.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher.logo,
      },
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  }

  return (
    <Script
      id="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function ServiceStructuredData({ data }: { data: ServiceData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: data.provider.name,
      url: data.provider.url,
    },
    areaServed: {
      '@type': 'Country',
      name: data.areaServed,
    },
    url: data.url,
  }

  return (
    <Script
      id="service-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebSiteStructuredData({ data }: { data: WebSiteData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: data.potentialAction.target,
      'query-input': data.potentialAction['query-input'],
    },
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
} 