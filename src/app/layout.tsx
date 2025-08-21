import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/main.scss'
import { ConditionalLayout } from '@/components/layout/conditional-layout'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SEO } from '@/lib/constants'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description.default,
  keywords: [...SEO.keywords],
  authors: [{ name: SEO.author }],
  creator: SEO.creator,
  publisher: SEO.publisher,
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: SEO.title.default,
    description: SEO.description.default,
    siteName: 'Bearbetar',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bearbetar - Webbutveckling, Mobilappar & Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bearbetar',
    creator: '@bearbetar',
    title: SEO.title.default,
    description: SEO.description.default,
  },
  robots: SEO.robots,
  alternates: SEO.alternates,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(theme);
                  if (theme === 'dark') {
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}