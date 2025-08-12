'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface ThemeLogoProps {
  alt: string
  width: number
  height: number
  className?: string
  type?: 'symbol' | 'full'
}

export function ThemeLogo({ alt, width, height, className, type = 'symbol' }: ThemeLogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which logo to show based on theme
  const getLogoSrc = () => {
    if (!mounted) {
      // Return a default logo while mounting
      return type === 'symbol' ? '/images/logo-symbol-greenmode.svg' : '/images/logo-greenmode.svg'
    }
    
    if (theme === 'light') {
      return type === 'symbol' ? '/images/logo-symbol-pinkmode.svg' : '/images/logo-prinkmode.svg'
    } else {
      return type === 'symbol' ? '/images/logo-symbol-greenmode.svg' : '/images/logo-greenmode.svg'
    }
  }

  return (
    <Image 
      src={getLogoSrc()} 
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
} 