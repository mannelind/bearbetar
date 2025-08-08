'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'
import { AdminLayout } from './admin-layout'
import { Sidebar } from './sidebar'
import { useAuth } from '@/hooks/use-auth'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const { loading } = useAuth()
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/admin/login'

  // Don't show anything while loading auth state
  if (loading) {
    return null
  }

  // Admin routes use AdminLayout (with sidebar)
  if (isAdminRoute && !isLoginRoute) {
    return <AdminLayout>{children}</AdminLayout>
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