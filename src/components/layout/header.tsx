'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Menu, X, Briefcase, BookOpen, FolderOpen, Home, Users, Phone, LogIn } from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'

// Mobile navigation items (secondary)
const mobileNavigation = [
  { name: 'Hem', href: PUBLIC_ROUTES.home, icon: Home },
  { name: 'Om oss', href: '/om-oss', icon: Users },
  { name: 'Kontakt', href: '/kontakt', icon: Phone },
]

export function Header() {
  const { user, isAdmin, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-10 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo - Left side */}
        <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
          <Link href="/" className="flex items-center space-x-3">
            <ThemeLogo 
              alt={`${APP_NAME} logotyp`}
              width={48}
              height={48}
              className="h-10 w-10 md:h-12 md:w-12"
              type="symbol"
              priority
            />
          </Link>
        </SimpleTooltip>

        {/* Desktop - Primary CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <SimpleTooltip text="Se alla våra tjänster och vad vi kan hjälpa dig med 🚀" side="bottom">
            <Button variant="outline" size="default" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href={PUBLIC_ROUTES.services}>
                <Briefcase className="mr-2 h-5 w-5" />
                Våra Tjänster
              </Link>
            </Button>
          </SimpleTooltip>
          
          <SimpleTooltip text="Utforska våra tidigare projekt 🎨" side="bottom">
            <Button variant="outline" size="default" asChild className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Link href="/portfolio">
                <FolderOpen className="mr-2 h-5 w-5" />
                Portfolio
              </Link>
            </Button>
          </SimpleTooltip>
          
          <SimpleTooltip text="Läs våra senaste artiklar och insikter 📝" side="bottom">
            <Button variant="outline" size="default" asChild className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Link href={PUBLIC_ROUTES.blog}>
                <BookOpen className="mr-2 h-5 w-5" />
                Blogg & Artiklar
              </Link>
            </Button>
          </SimpleTooltip>
        </div>

        {/* Mobile hamburger menu */}
        <SimpleTooltip text={mobileMenuOpen ? "Stäng menyn ✖️" : "Öppna menyn 📱"} side="bottom">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Stäng mobilmeny" : "Öppna mobilmeny"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </SimpleTooltip>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-6 space-y-3">
            {/* Primary actions first on mobile */}
            <div className="space-y-3 pb-4 border-b">
              <Button size="lg" asChild className="w-full justify-start">
                <Link href={PUBLIC_ROUTES.services} onClick={() => setMobileMenuOpen(false)}>
                  <Briefcase className="mr-3 h-5 w-5" />
                  Våra Tjänster
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="w-full justify-start">
                <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)}>
                  <FolderOpen className="mr-3 h-5 w-5" />
                  Portfolio
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="w-full justify-start">
                <Link href={PUBLIC_ROUTES.blog} onClick={() => setMobileMenuOpen(false)}>
                  <BookOpen className="mr-3 h-5 w-5" />
                  Blogg & Artiklar
                </Link>
              </Button>
            </div>
            
            {/* Secondary navigation */}
            <div className="space-y-2">
              {mobileNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Auth section */}
            {!loading && (
              <div className="pt-4 border-t space-y-2">
                {!user ? (
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="mr-3 h-4 w-4" />
                      Logga in
                    </Link>
                  </Button>
                ) : isAdmin ? (
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      Admin
                    </Link>
                  </Button>
                ) : null}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}