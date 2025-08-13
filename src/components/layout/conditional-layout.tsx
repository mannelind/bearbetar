'use client'

import { usePathname } from 'next/navigation'
import { TopBar } from './top-bar'
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { useAuth } from '@/hooks/use-auth'
import { ErrorBoundary } from '@/components/ui/error-boundary'

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
    return <ErrorBoundary>{children}</ErrorBoundary>
  }

  // Don't show anything while loading auth state (for other pages)
  if (loading) {
    return null
  }

  // Admin routes get no additional layout (they use AdminPageWrapper internally)
  if (isAdminRoute && !isLoginRoute) {
    return <ErrorBoundary>{children}</ErrorBoundary>
  }

  // Public routes with sidebar for all users
  return (
    <ErrorBoundary>
      {/* Skip links for accessibility */}
      <div className="skip-links">
        <a href="#main-content" className="skip-link">
          Hoppa till huvudinnehåll
        </a>
        <a href="#navigation" className="skip-link">
          Hoppa till navigation
        </a>
      </div>
      
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  )
}