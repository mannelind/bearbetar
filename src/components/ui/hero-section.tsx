'use client'

import { ReactNode } from 'react'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { InteractiveOrbs } from '@/components/ui/interactive-orbs'

interface HeroSectionProps {
  children: ReactNode
  showLogo?: boolean
  className?: string
}

export function HeroSection({ children, showLogo = true, className = '' }: HeroSectionProps) {
  return (
    <section className={`relative futuristic-gradient gradient-mesh overflow-hidden ${className}`}>
      <InteractiveOrbs />
      
      <div className="container px-4 py-16 md:py-20 lg:py-32">
        <div className="mx-auto w-full">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-8 items-center text-center md:text-left">
            {/* Left side - Logo */}
            {showLogo && (
              <div className="flex justify-center animate-slide-in-left px-4 md:px-0">
                {/* Mobile/Small screens - Symbol logo */}
                <ThemeLogo 
                  alt="Bearbetar logotyp"
                  width={160}
                  height={160}
                  className="h-auto md:hidden"
                  type="symbol"
                  priority
                />
                {/* Desktop/Large screens - Full logo */}
                <ThemeLogo 
                  alt="Bearbetar logotyp"
                  width={600}
                  height={240}
                  className="h-auto hidden md:block md:max-h-[150px] lg:max-h-[200px]"
                  type="full"
                  priority
                />
              </div>
            )}
            
            {/* Right side - Content */}
            <div className={showLogo ? "animate-slide-up-delayed" : "col-span-2 text-center animate-slide-up-delayed"}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}