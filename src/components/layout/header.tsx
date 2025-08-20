'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Briefcase, BookOpen, FolderOpen, Users, LogIn } from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'


export function Header() {
  const { user, isAdmin } = useAuth()
  const [isFloating, setIsFloating] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const scrollingUp = scrollTop < lastScrollY
          
          // Three-stage transition: floating -> transitioning -> normal
          if (scrollingUp && scrollTop <= 25 && isFloating) {
            // Start transition phase - border fades first, then header grows
            setIsTransitioning(true)
            setTimeout(() => {
              setIsFloating(false)
              setIsTransitioning(false)
            }, 250) // Border fade duration - shorter for smoother feel
          } else if (!scrollingUp && scrollTop > 70 && !isFloating) {
            // Enter floating mode with slight delay for smoother entrance
            setIsFloating(true)
            setIsTransitioning(false)
          }
          
          setLastScrollY(scrollTop)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isFloating])

  return (
    <>
    <header role="banner" className={`fixed w-full z-40 transition-all duration-500 ease-in-out ${isFloating || isTransitioning ? 'md:top-4 top-0' : 'md:top-12 top-0'} [body:has(.modal-open)_&]:opacity-0 [body:has(.modal-open)_&]:pointer-events-none`} aria-label="Huvudnavigation">
      {/* Mobile Header - Simple with direct navigation */}
      <div className="md:hidden w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <div className="flex h-auto items-center justify-between w-full p-2">
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
              <Button variant="ghost" size="sm" asChild className="min-h-[44px]">
                <Link href="/om-oss" className="text-sm font-medium" style={{color: 'hsl(var(--foreground))'}}>
                  Om oss
                </Link>
              </Button>
            </SimpleTooltip>
            
            <SimpleTooltip text="Kontakt 📞" side="bottom">
              <Button variant="ghost" size="sm" asChild className="min-h-[44px]">
                <Link href="/kontakt" className="text-sm font-medium" style={{color: 'hsl(var(--foreground))'}}>
                  Kontakt
                </Link>
              </Button>
            </SimpleTooltip>

            {/* Auth button */}
            {!user ? (
              <SimpleTooltip text="Logga in 🔑" side="bottom">
                <Button variant="ghost" size="sm" asChild className="min-h-[44px] min-w-[44px]">
                  <Link href="/admin/login" aria-label="Logga in som administratör">
                    <LogIn className="h-5 w-5" style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                    <span className="sr-only">Logga in</span>
                  </Link>
                </Button>
              </SimpleTooltip>
            ) : isAdmin ? (
              <SimpleTooltip text="Admin 👑" side="bottom">
                <Button variant="ghost" size="sm" asChild className="min-h-[44px] min-w-[44px]">
                  <Link href="/admin" aria-label="Gå till adminpanelen">
                    <Users className="h-5 w-5" style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                    <span className="sr-only">Admin</span>
                  </Link>
                </Button>
              </SimpleTooltip>
            ) : null}
            
            {/* Theme Toggle - Mobile */}
            <SimpleTooltip text="Byt tema 🌙☀️" side="bottom">
              <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                <ThemeToggle />
              </div>
            </SimpleTooltip>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Header - With floating panel behavior */}
      <div className={`hidden md:block transition-all duration-500 ease-in-out w-fit mx-auto ${
        isFloating || isTransitioning 
          ? `bg-floating-header/40 text-floating-header-foreground backdrop-blur-xl shadow-2xl rounded-full px-4 py-2 ${
              isTransitioning ? 'floating-border-fade-out' : 'floating-border-visible'
            }` 
          : 'bg-background/45 backdrop-blur supports-[backdrop-filter]:bg-background/40 rounded-full px-4 py-2'
      }`}>
        <div className={`flex items-center transition-all duration-500 ease-in-out justify-center gap-2 ${isFloating || isTransitioning ? 'h-10' : 'h-14'}`}>
        
        {/* Logo - Left side - Hide when scrolled and hide on desktop/tablet (md+) where sidebar shows */}
        {!isFloating && !isTransitioning && (
          <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
            <Link href="/" className="flex items-center space-x-3 absolute left-2 top-1/2 -translate-y-1/2 md:hidden" aria-label={`Tillbaka till ${APP_NAME} startsida`}>
              <ThemeLogo 
                alt={`${APP_NAME} logotyp`}
                width={48}
                height={48}
                className="h-10 w-10"
                type="symbol"
                priority
              />
            </Link>
          </SimpleTooltip>
        )}

        {/* Desktop - Primary CTAs - Always centered */}
        <nav role="navigation" aria-label="Desktop huvudnavigation" className={`${isFloating || isTransitioning ? '' : 'mt-0'}`}>
          <div className={`hidden md:flex items-center transition-all duration-500 ease-in-out ${isFloating || isTransitioning ? 'justify-center gap-2' : 'gap-6'}`}>
            <SimpleTooltip text="Se alla våra tjänster och vad vi kan hjälpa dig med 🚀" side="bottom">
              <Button variant="outline" size={isFloating || isTransitioning ? "sm" : "default"} asChild>
                <Link href={PUBLIC_ROUTES.services} aria-describedby="services-desc">
                  <Briefcase className={`mr-2 ${isFloating || isTransitioning ? 'h-4 w-4' : 'h-5 w-5'}`} style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                  Våra Tjänster
                  <span id="services-desc" className="sr-only">Se alla våra tjänster och vad vi kan hjälpa dig med</span>
                </Link>
              </Button>
            </SimpleTooltip>
            
            <SimpleTooltip text="Utforska våra tidigare projekt 🎨" side="bottom">
              <Button variant="outline" size={isFloating || isTransitioning ? "sm" : "default"} asChild>
                <Link href="/portfolio" aria-describedby="portfolio-desc">
                  <FolderOpen className={`mr-2 ${isFloating || isTransitioning ? 'h-4 w-4' : 'h-5 w-5'}`} style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                  Portfolio
                  <span id="portfolio-desc" className="sr-only">Utforska våra tidigare projekt och case studies</span>
                </Link>
              </Button>
            </SimpleTooltip>
            
            <SimpleTooltip text="Läs våra senaste artiklar och insikter 📝" side="bottom">
              <Button variant="outline" size={isFloating || isTransitioning ? "sm" : "default"} asChild>
                <Link href={PUBLIC_ROUTES.blog} aria-describedby="blog-desc">
                  <BookOpen className={`mr-2 ${isFloating || isTransitioning ? 'h-4 w-4' : 'h-5 w-5'}`} style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
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