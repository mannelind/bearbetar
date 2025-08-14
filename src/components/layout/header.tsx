'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Briefcase, BookOpen, FolderOpen, Users, LogIn } from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'


export function Header() {
  const { user, isAdmin } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50) // Hide logo after 50px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    {/* Skip navigation link for accessibility */}
    <a href="#main-content" className="skip-link">
      Hoppa till huvudinnehåll
    </a>
    
    <header role="banner" className={`sticky z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'md:top-4 top-0' : 'md:top-10 top-0'}`} aria-label="Huvudnavigation">
      {/* Mobile Header - Simple with direct navigation */}
      <div className="md:hidden w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile Logo */}
          <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
            <Link href="/" className="flex items-center" aria-label={`Tillbaka till ${APP_NAME} startsida`}>
              <ThemeLogo 
                alt={`${APP_NAME} logotyp`}
                width={32}
                height={32}
                className="h-8 w-8"
                type="symbol"
                priority
              />
            </Link>
          </SimpleTooltip>
          
          {/* Mobile Navigation Links */}
          <nav role="navigation" aria-label="Mobil huvudnavigation">
            <div className="flex items-center gap-2">
            <SimpleTooltip text="Om oss 👥" side="bottom">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/om-oss" className="text-sm font-medium" style={{color: 'hsl(var(--foreground))'}}>
                  Om oss
                </Link>
              </Button>
            </SimpleTooltip>
            
            <SimpleTooltip text="Kontakt 📞" side="bottom">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/kontakt" className="text-sm font-medium" style={{color: 'hsl(var(--foreground))'}}>
                  Kontakt
                </Link>
              </Button>
            </SimpleTooltip>

            {/* Auth button */}
            {!user ? (
              <SimpleTooltip text="Logga in 🔑" side="bottom">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/login" aria-label="Logga in som administratör">
                    <LogIn className="h-5 w-5" style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                    <span className="sr-only">Logga in</span>
                  </Link>
                </Button>
              </SimpleTooltip>
            ) : isAdmin ? (
              <SimpleTooltip text="Admin 👑" side="bottom">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin" aria-label="Gå till adminpanelen">
                    <Users className="h-5 w-5" style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                    <span className="sr-only">Admin</span>
                  </Link>
                </Button>
              </SimpleTooltip>
            ) : null}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Header - With floating panel behavior */}
      <div className={`hidden md:block transition-all duration-500 ease-in-out ${isScrolled ? 'mx-auto max-w-fit bg-header-light/30 backdrop-blur rounded-xl px-6 py-2' : 'w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
        <div className={`flex items-center transition-all duration-500 ease-in-out ${isScrolled ? 'h-10 justify-center gap-2' : 'container h-20 justify-center'}`}>
        
        {/* Logo - Left side - Hide when scrolled */}
        {!isScrolled && (
          <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
            <Link href="/" className="flex items-center space-x-3 absolute left-6 top-1/2 -translate-y-1/2" aria-label={`Tillbaka till ${APP_NAME} startsida`}>
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
        )}

        {/* Desktop - Primary CTAs - Always centered */}
        <nav role="navigation" aria-label="Desktop huvudnavigation">
          <div className={`hidden md:flex items-center transition-all duration-500 ease-in-out ${isScrolled ? 'justify-center gap-2' : 'gap-3'}`}>
            <SimpleTooltip text="Se alla våra tjänster och vad vi kan hjälpa dig med 🚀" side="bottom">
              <Button variant="outline" size={isScrolled ? "sm" : "default"} asChild>
                <Link href={PUBLIC_ROUTES.services} aria-describedby="services-desc">
                  <Briefcase className={`mr-2 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                  Våra Tjänster
                  <span id="services-desc" className="sr-only">Se alla våra tjänster och vad vi kan hjälpa dig med</span>
                </Link>
              </Button>
            </SimpleTooltip>
            
            <SimpleTooltip text="Utforska våra tidigare projekt 🎨" side="bottom">
              <Button variant="outline" size={isScrolled ? "sm" : "default"} asChild>
                <Link href="/portfolio" aria-describedby="portfolio-desc">
                  <FolderOpen className={`mr-2 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                  Portfolio
                  <span id="portfolio-desc" className="sr-only">Utforska våra tidigare projekt och case studies</span>
                </Link>
              </Button>
            </SimpleTooltip>
            
            <SimpleTooltip text="Läs våra senaste artiklar och insikter 📝" side="bottom">
              <Button variant="outline" size={isScrolled ? "sm" : "default"} asChild>
                <Link href={PUBLIC_ROUTES.blog} aria-describedby="blog-desc">
                  <BookOpen className={`mr-2 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                  Blogg & Artiklar
                  <span id="blog-desc" className="sr-only">Läs våra senaste artiklar och branschinsikter</span>
                </Link>
              </Button>
            </SimpleTooltip>
          </div>
        </nav>

        </div>
      </div>
    </header>

    </>
  )
}