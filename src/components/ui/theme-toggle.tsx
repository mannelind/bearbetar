'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0 hover:bg-transparent" title="Växla till ljust läge">
        <Sun className="h-5 w-5 text-primary" />
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
      title={`Växla till ${theme === 'light' ? 'mörkt läge' : 'ljust läge'}`}
    >
      {theme === 'light' ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
    </Button>
  )
}