'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, 
  Accessibility, 
  Zap, 
  Smartphone, 
  Activity 
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const tools = [
  {
    name: 'SEO-check',
    href: '/verktyg/seo',
    icon: Search,
    description: 'Analysera din webbplats SEO-prestanda'
  },
  {
    name: 'Tillgänglighet',
    href: '/verktyg/tillganglighet',
    icon: Accessibility,
    description: 'WCAG-kompatibilitetstest'
  },
  {
    name: 'Hastighetstest',
    href: '/verktyg/hastighet',
    icon: Zap,
    description: 'Mät laddningstider och prestanda'
  },
  {
    name: 'Mobilvänlighet',
    href: '/verktyg/mobil',
    icon: Smartphone,
    description: 'Testa mobilanpassning'
  },
  {
    name: 'Status',
    href: '/verktyg/status',
    icon: Activity,
    description: 'Köstatus och senaste körningar'
  }
]

export default function VerktygLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Gratis webbverktyg</h1>
          <p className="text-muted-foreground text-lg">
            Analysera din webbplats med våra kostnadsfria verktyg för SEO, tillgänglighet, prestanda och mobilvänlighet.
          </p>
        </div>

        {pathname === '/verktyg' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.href} href={tool.href}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold">{tool.name}</h3>
                    </div>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="p-4">
                <h2 className="font-semibold mb-4">Verktyg</h2>
                <nav className="space-y-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon
                    const isActive = pathname === tool.href
                    return (
                      <Link key={tool.href} href={tool.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {tool.name}
                        </Button>
                      </Link>
                    )
                  })}
                </nav>
              </Card>
            </aside>

            <main className="flex-1">
              {children}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}