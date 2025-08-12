'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { useAuth } from '@/hooks/use-auth'
import { LogIn, Settings } from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'

// Navigation items for desktop
const navigation = [
  { name: 'Hem', href: PUBLIC_ROUTES.home },
  { name: 'Tjänster', href: PUBLIC_ROUTES.services },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blogg', href: PUBLIC_ROUTES.blog },
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Kontakt', href: '/kontakt' },
]

export function Header() {
  const { user, isAdmin, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center relative">
        {/* Logo - Left side on both mobile and desktop */}
        <Link href="/" className="flex items-center space-x-2 mr-8">
          <ThemeLogo 
            alt={`${APP_NAME} logotyp`}
            width={32}
            height={32}
            className="w-8 h-8"
            type="symbol"
          />
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Icons & Buttons - Right side on desktop, hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href={PUBLIC_ROUTES.services}>Våra Tjänster</Link>
          </Button>
          
          {!loading && (
            <>
              {!user ? (
                <Button asChild>
                  <Link href="/admin/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Logga in
                  </Link>
                </Button>
              ) : isAdmin ? (
                <Button asChild>
                  <Link href="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              ) : null}
            </>
          )}
        </div>

        {/* Mobile spacer - for hamburger menu positioning */}
        <div className="md:hidden absolute right-4" />
      </div>

      {/* No mobile navigation here - handled by sidebar */}
    </header>
  )
}