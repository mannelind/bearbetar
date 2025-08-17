'use client'

import { usePathname } from 'next/navigation'
import { TopBar } from './top-bar'
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import { ConstructionBanner } from '@/components/ui/construction-banner'
import { useAuth } from '@/hooks/use-auth'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SimpleTooltip } from '@/components/ui/tooltip'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/admin/login'
  
  const { loading } = useAuth()

  // Skip auth loading for login page - render immediately
  if (isLoginRoute) {
    return (
      <ErrorBoundary>
        <ConstructionBanner />
        {children}
      </ErrorBoundary>
    )
  }

  // Don't show anything while loading auth state (for other pages)
  if (loading) {
    return null
  }

  // Admin routes get no additional layout (they use AdminPageWrapper internally)
  if (isAdminRoute && !isLoginRoute) {
    return (
      <ErrorBoundary>
        <ConstructionBanner />
        {children}
      </ErrorBoundary>
    )
  }

  // Public routes with sidebar for all users
  return (
    <ErrorBoundary>
      <ConstructionBanner />
      {/* Skip links for accessibility */}
      <div className="skip-links">
        <a href="#main-content" className="skip-link">
          Hoppa till huvudinnehåll
        </a>
        <a href="#navigation" className="skip-link">
          Hoppa till navigation
        </a>
      </div>
      
      {/* Mobile Theme Toggle - Global */}
      <div className="md:hidden fixed top-6 right-4 z-50">
        <SimpleTooltip text="Byt tema ☀️🌙" side="left">
          <div className="opacity-60 hover:opacity-100 transition-all duration-200 cursor-pointer p-2 rounded-full hover:bg-background/20 backdrop-blur-sm">
            <ThemeToggle />
          </div>
        </SimpleTooltip>
      </div>
      
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex flex-1 flex-col transition-all duration-300 overflow-auto">
            <TopBar />
            <Header />
            <main id="main-content" className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
      <BottomNav />
    </ErrorBoundary>
  )
}