'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Leaf, Heart } from 'lucide-react'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0 hover:bg-transparent" title="Växla till green mode">
        <Heart className="h-5 w-5 text-primary" />
      </Button>
    )
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 px-0 hover:bg-transparent"
      onClick={toggleTheme}
      title={`Växla till ${theme === 'light' ? 'green mode' : 'pink mode'}`}
    >
      {theme === 'light' ? <Heart className="h-5 w-5 text-primary" /> : <Leaf className="h-5 w-5 text-primary" />}
    </Button>
  )
}