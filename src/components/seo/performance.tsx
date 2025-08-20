import Head from 'next/head'

interface PerformanceMetaProps {
  preconnect?: string[]
  dnsPrefetch?: string[]
  preload?: Array<{
    href: string
    as: string
    type?: string
    crossOrigin?: string
  }>
}

export function PerformanceMeta({
  preconnect = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com',
  ],
  dnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com',
  ],
        preload = [],
}: PerformanceMetaProps) {
  return (
    <Head>
      {/* Preconnect to external domains */}
      {preconnect.map((domain) => (
        <link key={domain} rel="preconnect" href={domain} crossOrigin="anonymous" />
      ))}

      {/* DNS prefetch */}
      {dnsPrefetch.map((domain) => (
        <link key={domain} rel="dns-prefetch" href={domain} />
      ))}

      {/* Preload critical resources */}
      {preload.map((resource, index) => (
        <link
          key={index}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin={resource.crossOrigin as 'anonymous' | 'use-credentials' | undefined}
        />
      ))}

      {/* Performance hints */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Disable automatic phone number detection on iOS */}
      <meta name="format-detection" content="telephone=no" />
      
      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#000000" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)" />
      
      {/* Apple touch icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Head>
  )
} 