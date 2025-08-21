'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { LogIn, Home, Users, Phone } from 'lucide-react'
import { PUBLIC_ROUTES } from '@/lib/constants'
import { useState, useEffect } from 'react'

export function TopBar() {
  const { user, isAdmin, loading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50) // Hide TopBar after 50px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't render TopBar when scrolled
  if (isScrolled) return null

  return (
    <div className="hidden md:block fixed top-0 z-[60] bg-header-accent/80 backdrop-blur supports-[backdrop-filter]:bg-header-accent/80 transition-all duration-300 ease-out md:left-16 md:[.sidebar-expanded_&]:left-64 md:right-0">
      <div className="container flex h-auto items-center justify-between text-sm text-header-accent-foreground px-2 md:px-4">
        {/* Left side - Secondary navigation */}
        <nav className="hidden md:flex items-center space-x-4 md:space-x-6">
          <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
            <Link
              href={PUBLIC_ROUTES.home}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Home className="h-3 w-3" />
              <span>Hem</span>
            </Link>
          </SimpleTooltip>
          
          <SimpleTooltip text="Lär känna teamet bakom Bearbetar 👥" side="bottom">
            <Link
              href="/om-oss"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Users className="h-3 w-3" />
              <span>Om oss</span>
            </Link>
          </SimpleTooltip>
          
          <SimpleTooltip text="Hör av dig till oss! 📞" side="bottom">
            <Link
              href="/kontakt"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>Kontakt</span>
            </Link>
          </SimpleTooltip>
        </nav>


        {/* Right side - Theme toggle and auth */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle - hidden on mobile */}
          <div className="hidden md:block">
            <SimpleTooltip text="Byt mellan ljust och mörkt tema ☀️🌙" side="bottom">
              <ThemeToggle />
            </SimpleTooltip>
          </div>
          
          {/* Auth */}
          {!loading && (
            <>
              {!user ? (
                <SimpleTooltip text="Snart illgänglig för våra kunder" side="bottom">
                  <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-xs text-header-accent-foreground hover:text-primary hover:bg-transparent">
                    <Link href="/admin/login">
                      <LogIn className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">Logga in</span>
                    </Link>
                  </Button>
                </SimpleTooltip>
              ) : isAdmin ? (
                <SimpleTooltip text="Gå till admin-panelen ⚙️" side="bottom">
                  <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-xs text-header-accent-foreground hover:text-primary hover:bg-transparent">
                    <Link href="/admin">
                      Admin
                    </Link>
                  </Button>
                </SimpleTooltip>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}