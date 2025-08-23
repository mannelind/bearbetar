'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, Briefcase, BookOpen, FolderOpen, Users, LogIn, Wrench, Home, Info, Phone, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useMobileWidgetState } from '@/hooks/use-mobile-widget-state'


export function MobileMenuWidget() {
  const { activeWidget, setActiveWidget } = useMobileWidgetState()
  const isOpen = activeWidget === 'mobile-menu'
  const { user, isAdmin } = useAuth()

  const menuItems = [
    { href: '/', label: 'Hem', icon: Home },
    { href: '/om-oss', label: 'Om oss', icon: Info },
    { href: '/tjanster', label: 'Våra Tjänster', icon: Briefcase },
    { href: '/portfolio', label: 'Portfolio', icon: FolderOpen },
    { href: '/blog', label: 'Blogg & Artiklar', icon: BookOpen },
    { href: '/verktyg', label: 'Verktyg', icon: Wrench },
    { href: '/kontakt', label: 'Kontakt', icon: Phone },
  ]

  return (
    <>
      {/* Flik-knapp - endast synlig på mobil */}
      <button
        onClick={() => setActiveWidget(isOpen ? null : 'mobile-menu')}
        className={`fixed left-0 top-32 z-50 bg-primary text-primary-foreground px-2 py-4 rounded-r-lg shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden ${
          isOpen ? '-translate-x-full opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Öppna meny"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Widget-panel */}
      <div
        className={`fixed left-0 top-32 z-50 bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '280px', maxHeight: '80vh' }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Meny</h2>
            <button
              onClick={() => setActiveWidget(null)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Stäng"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Innehåll */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveWidget(null)}
                    className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}

              {/* Auth section */}
              <div className="border-t border-border mt-2 pt-2">
                {!user ? (
                  <Link
                    href="/admin/login"
                    onClick={() => setActiveWidget(null)}
                    className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <LogIn className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Logga in</span>
                  </Link>
                ) : isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setActiveWidget(null)}
                    className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Admin</span>
                  </Link>
                ) : null}
              </div>
            </nav>
          </div>

          {/* Footer med tema-toggle */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Byt tema</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay när widgeten är öppen */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setActiveWidget(null)}
        />
      )}
    </>
  )
}