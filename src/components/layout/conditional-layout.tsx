'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { useAuth } from '@/hooks/use-auth'

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
    return <>{children}</>
  }

  // Don't show anything while loading auth state (for other pages)
  if (loading) {
    return null
  }

  // Admin routes get no additional layout (they use AdminPageWrapper internally)
  if (isAdminRoute && !isLoginRoute) {
    return <>{children}</>
  }

  // Login page gets no layout
  if (isLoginRoute) {
    return <>{children}</>
  }

  // Public routes with sidebar for all users
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}