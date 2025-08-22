'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { useState, useEffect } from 'react'
import { Briefcase, BookOpen, FolderOpen, Wrench } from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'


export function Header() {
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
    <header role="banner" className={`fixed z-40 w-full transition-all duration-500 ease-in-out ${isFloating || isTransitioning ? 'md:top-4 top-0' : 'md:top-12 top-0'} [body:has(.modal-open)_&]:opacity-0 [body:has(.modal-open)_&]:pointer-events-none`} aria-label="Huvudnavigation">
      {/* Mobile Header - Logo left, snap zones distributed in remaining space */}
      <div className="md:hidden w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/40 relative">
        {/* Accessibility Widget Snap Zones */}
        <div className="accessibility-header-snap-zone accessibility-header-snap-zone-left" data-snap-position="header-left"></div>
        <div className="accessibility-header-snap-zone accessibility-header-snap-zone-center" data-snap-position="header-center"></div>
        <div className="accessibility-header-snap-zone accessibility-header-snap-zone-right" data-snap-position="header-right"></div>
        
        {/* Mobile Menu Widget Snap Zones */}
        <div className="mobile-menu-header-snap-zone mobile-menu-header-snap-zone-left" data-snap-position="header-left"></div>
        <div className="mobile-menu-header-snap-zone mobile-menu-header-snap-zone-center" data-snap-position="header-center"></div>
        <div className="mobile-menu-header-snap-zone mobile-menu-header-snap-zone-right" data-snap-position="header-right"></div>
        
        <div className="flex h-auto items-center justify-between w-full p-2 relative z-10">
          {/* Mobile Logo - Left aligned */}
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
          
          {/* Spacer for snap zones - takes remaining space */}
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Desktop Header - With floating panel behavior */}
      <div className="hidden md:flex transition-all duration-500 ease-in-out justify-center w-full">
        <div className={`w-fit transition-all duration-500 ease-in-out ${
          isFloating || isTransitioning 
            ? `bg-floating-header/40 text-floating-header-foreground backdrop-blur-xl shadow-2xl rounded-full px-4 py-2 ${
                isTransitioning ? 'floating-border-fade-out' : 'floating-border-visible'
              }` 
            : 'px-4 py-2'
        }`}>
        <div className={`flex items-center transition-all duration-500 ease-in-out justify-center md:gap-1 lg:gap-2 ${isFloating || isTransitioning ? 'h-10' : 'h-14'}`}>
        

        {/* Desktop - Primary CTAs - Always centered */}
        <nav role="navigation" aria-label="Desktop huvudnavigation" className={`${isFloating || isTransitioning ? '' : 'mt-0'}`}>
          <div className={`hidden md:flex items-center transition-all duration-500 ease-in-out justify-center ${isFloating || isTransitioning ? 'gap-2' : 'gap-6'}`}>
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
            
            <SimpleTooltip text="Använd våra kraftfulla verktyg för webbanalys 🔧" side="bottom">
              <Button variant="outline" size={isFloating || isTransitioning ? "sm" : "default"} asChild>
                <Link href="/verktyg" aria-describedby="tools-desc">
                  <Wrench className={`mr-2 ${isFloating || isTransitioning ? 'h-4 w-4' : 'h-5 w-5'}`} style={{color: 'hsl(var(--foreground))'}} aria-hidden="true" />
                  Verktyg
                  <span id="tools-desc" className="sr-only">Använd våra kraftfulla verktyg för webbanalys</span>
                </Link>
              </Button>
            </SimpleTooltip>
          </div>
        </nav>

        </div>
        </div>
      </div>
    </header>

    </>
  )
}