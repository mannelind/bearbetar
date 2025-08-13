'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { LogIn, Home, Users, Phone } from 'lucide-react'
import { PUBLIC_ROUTES } from '@/lib/constants'

export function TopBar() {
  const { user, isAdmin, loading } = useAuth()

  return (
    <div className="sticky top-0 z-[60] border-b bg-muted/30 backdrop-blur supports-[backdrop-filter]:bg-muted/20">
      <div className="container flex h-10 items-center justify-between text-sm">
        {/* Left side - Secondary navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
            <Link
              href={PUBLIC_ROUTES.home}
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-3 w-3" />
              <span>Hem</span>
            </Link>
          </SimpleTooltip>
          
          <SimpleTooltip text="Lär känna teamet bakom Bearbetar 👥" side="bottom">
            <Link
              href="/om-oss"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-3 w-3" />
              <span>Om oss</span>
            </Link>
          </SimpleTooltip>
          
          <SimpleTooltip text="Hör av dig till oss! 📞" side="bottom">
            <Link
              href="/kontakt"
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>Kontakt</span>
            </Link>
          </SimpleTooltip>
        </nav>

        {/* Mobile - Show minimal items */}
        <div className="md:hidden">
          <SimpleTooltip text="Byt mellan ljust och mörkt tema ☀️🌙" side="bottom">
            <ThemeToggle />
          </SimpleTooltip>
        </div>

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
                  <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-xs">
                    <Link href="/admin/login">
                      <LogIn className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">Logga in</span>
                    </Link>
                  </Button>
                </SimpleTooltip>
              ) : isAdmin ? (
                <SimpleTooltip text="Gå till admin-panelen ⚙️" side="bottom">
                  <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-xs">
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