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
      
      <div className="container px-4 py-16 md:py-20">
        <div className="mx-auto w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-8 items-center text-center lg:text-left">
            {/* Left side - Logo */}
            {showLogo && (
              <div className="flex justify-center animate-slide-in-left">
                <ThemeLogo 
                  alt="Bearbetar logotyp"
                  width={600}
                  height={240}
                  className="h-auto"
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