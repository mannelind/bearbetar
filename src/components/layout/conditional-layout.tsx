'use client'

import { usePathname } from 'next/navigation'
import { TopBar } from './top-bar'
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import { useAuth } from '@/hooks/use-auth'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ConstructionBanner } from '@/components/ui/construction-banner'

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
      
      <div className="flex min-h-screen flex-col">
        <Sidebar />
        <div className="flex flex-1 flex-col transition-all duration-300 overflow-auto md:ml-16 md:[.sidebar-expanded_&]:ml-64">
          <TopBar />
          <Header />
          <main id="main-content" className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
        </div>
      </div>
      <BottomNav />
    </ErrorBoundary>
  )
}