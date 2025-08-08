'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { ADMIN_ROUTES, APP_NAME } from '@/lib/constants'
import { useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'

const navigation = [
  {
    name: 'Dashboard',
    href: ADMIN_ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    name: 'Artiklar',
    href: ADMIN_ROUTES.articles,
    icon: FileText,
  },
  {
    name: 'Tjänster',
    href: ADMIN_ROUTES.services,
    icon: Settings,
  },
]

interface AdminNavigationProps {
  user?: {
    email?: string
    full_name?: string | null
  }
}

export function AdminNavigation({ user }: AdminNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useSupabase()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback to API route
      window.location.href = '/api/auth/logout'
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg">{APP_NAME}</span>
              <Badge variant="secondary" className="text-xs">
                Admin
              </Badge>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== ADMIN_ROUTES.dashboard && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="border-t p-4 space-y-2">
            {user && (
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Inloggad som
                </p>
                <p className="text-sm font-medium truncate">
                  {user.full_name || user.email}
                </p>
                {user.full_name && (
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </div>
            )}
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              {isLoggingOut ? 'Loggar ut...' : 'Logga ut'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}