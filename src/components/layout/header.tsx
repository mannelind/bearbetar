'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/hooks/use-auth'
import { Menu, X, LogIn, Settings } from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'

// Navigation items for desktop and mobile
const navigation = [
  { name: 'Hem', href: PUBLIC_ROUTES.home },
  { name: 'Tjänster', href: PUBLIC_ROUTES.services },
  { name: 'Blogg', href: PUBLIC_ROUTES.blog },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAdmin, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/images/logo-symbol.svg" 
            alt={`${APP_NAME} logotyp`}
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-8">
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

        {/* Mobile actions */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Öppna meny</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* CTA Button & Theme Toggle - Desktop */}
        <div className="hidden md:flex ml-auto items-center gap-2">
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
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <Button variant="outline" asChild className="w-full">
                <Link href={PUBLIC_ROUTES.services}>Våra Tjänster</Link>
              </Button>
              
              {!loading && (
                <>
                  {!user ? (
                    <Button asChild className="w-full">
                      <Link href="/admin/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Logga in
                      </Link>
                    </Button>
                  ) : isAdmin ? (
                    <Button asChild className="w-full">
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}