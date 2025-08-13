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
    <header className={`sticky z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'md:top-4 top-0' : 'md:top-10 top-0'}`}>
      {/* Mobile Header - Simple with direct navigation */}
      <div className="md:hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile Logo */}
          <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
            <Link href="/" className="flex items-center">
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
          <div className="flex items-center gap-2">
            <SimpleTooltip text="Om oss 👥" side="bottom">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/om-oss" className="text-sm font-medium">
                  Om oss
                </Link>
              </Button>
            </SimpleTooltip>
            
            <SimpleTooltip text="Kontakt 📞" side="bottom">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/kontakt" className="text-sm font-medium">
                  Kontakt
                </Link>
              </Button>
            </SimpleTooltip>

            {/* Auth button */}
            {!user ? (
              <SimpleTooltip text="Logga in 🔑" side="bottom">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/login">
                    <LogIn className="h-5 w-5" />
                  </Link>
                </Button>
              </SimpleTooltip>
            ) : isAdmin ? (
              <SimpleTooltip text="Admin 👑" side="bottom">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <Users className="h-5 w-5" />
                  </Link>
                </Button>
              </SimpleTooltip>
            ) : null}
          </div>
        </div>
      </div>

      {/* Desktop Header - With floating panel behavior */}
      <div className={`hidden md:block transition-all duration-500 ease-in-out ${isScrolled ? 'mx-auto max-w-fit bg-background/55 backdrop-blur border border-border rounded-xl shadow-lg px-6 py-2' : 'w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
        <div className={`flex items-center transition-all duration-500 ease-in-out ${isScrolled ? 'h-10 justify-center gap-2' : 'container h-20 justify-center'}`}>
        
        {/* Logo - Left side - Hide when scrolled */}
        {!isScrolled && (
          <SimpleTooltip text="Tillbaka till startsidan 🏠" side="bottom">
            <Link href="/" className="flex items-center space-x-3 absolute left-6 top-1/2 -translate-y-1/2">
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
        <div className={`hidden md:flex items-center transition-all duration-500 ease-in-out ${isScrolled ? 'justify-center gap-1' : 'gap-3'}`}>
          <SimpleTooltip text="Se alla våra tjänster och vad vi kan hjälpa dig med 🚀" side="bottom">
            <Button variant="outline" size={isScrolled ? "sm" : "default"} asChild className="glow-outline">
              <Link href={PUBLIC_ROUTES.services}>
                <Briefcase className={`mr-2 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Våra Tjänster
              </Link>
            </Button>
          </SimpleTooltip>
          
          <SimpleTooltip text="Utforska våra tidigare projekt 🎨" side="bottom">
            <Button variant="outline" size={isScrolled ? "sm" : "default"} asChild className="glow-outline">
              <Link href="/portfolio">
                <FolderOpen className={`mr-2 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Portfolio
              </Link>
            </Button>
          </SimpleTooltip>
          
          <SimpleTooltip text="Läs våra senaste artiklar och insikter 📝" side="bottom">
            <Button variant="outline" size={isScrolled ? "sm" : "default"} asChild className="glow-outline">
              <Link href={PUBLIC_ROUTES.blog}>
                <BookOpen className={`mr-2 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
                Blogg & Artiklar
              </Link>
            </Button>
          </SimpleTooltip>
        </div>

        </div>
      </div>
    </header>

    </>
  )
}