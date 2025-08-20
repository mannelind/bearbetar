import Head from 'next/head'

interface SocialMetaProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  twitterHandle?: string
  siteName?: string
}

export function SocialMeta({
  title,
  description,
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  twitterHandle = '@bearbetar',
  siteName = 'Bearbetar',
}: SocialMetaProps) {
  const fullUrl = url ? `${process.env.NEXT_PUBLIC_SITE_URL}${url}` : process.env.NEXT_PUBLIC_SITE_URL
  const fullImageUrl = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_SITE_URL}${image}`

  return (
    <Head>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="sv_SE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:site" content={twitterHandle} />
      <meta property="twitter:creator" content={twitterHandle} />

      {/* Additional meta tags */}
      <meta name="author" content="Bearbetar" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Head>
  )
} 