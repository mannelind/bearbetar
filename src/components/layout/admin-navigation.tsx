'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase
} from 'lucide-react'
import { ADMIN_ROUTES, APP_NAME } from '@/lib/constants'
import { useSupabase } from '@/hooks/use-supabase'
import { useAdminSidebar } from './admin-sidebar-context'

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
    icon: Briefcase,
  },
  {
    name: 'Profil',
    href: '/admin/profile',
    icon: User,
  },
  {
    name: 'Inställningar',
    href: '/admin/settings',
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
  const { setSidebarState, showExpandedContent } = useAdminSidebar()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true) // Start collapsed
  const [isExpanded, setIsExpanded] = useState(false) // For hover/click state
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle hover expand
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsExpanded(true)
    setSidebarState(isCollapsed, true)
  }

  // Handle hover collapse with delay
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
      setSidebarState(isCollapsed, false)
    }, 300) // 300ms delay before closing
  }

  // Handle click to toggle permanent expanded state
  const handleClick = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    setIsExpanded(newCollapsed ? false : true)
    setSidebarState(newCollapsed, newCollapsed ? false : true)
  }

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // If sidebar is temporarily expanded via hover (collapsed but expanded), close it
        if (isExpanded && isCollapsed) {
          setIsExpanded(false)
          setSidebarState(isCollapsed, false)
        }
        // If sidebar is permanently expanded (not collapsed), collapse it
        else if (!isCollapsed) {
          setIsCollapsed(true)
          setIsExpanded(false)
          setSidebarState(true, false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, isCollapsed, setSidebarState])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Use showExpandedContent from context instead of local calculation

  const getUserInitials = (email: string | undefined) => {
    if (!email) return 'A'
    return email.substring(0, 2).toUpperCase()
  }

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
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-[70] md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "z-[60] transform bg-background/95 backdrop-blur transition-all duration-300 ease-in-out cyber-border cyber-glow flex-shrink-0",
          // Mobile: fixed overlay positioning, Desktop: sticky positioning
          "fixed left-0 top-0 h-screen md:sticky md:left-auto md:top-0 md:h-[100vh]",
          showExpandedContent ? "w-64" : "w-16", 
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ 
          border: '1px solid rgba(139, 176, 129, 0.4)', 
          borderRight: '3px solid rgba(139, 176, 129, 0.6)',
          borderRadius: '0 12px 12px 0',
          background: 'linear-gradient(135deg, transparent, rgba(139, 176, 129, 0.05), transparent 50%, rgba(151, 191, 133, 0.03))',
          boxShadow: '0 0 8px rgba(139, 176, 129, 0.25), 0 0 18px rgba(139, 176, 129, 0.12), 0 0 35px rgba(139, 176, 129, 0.06), inset 0 1px 0 rgba(205, 228, 204, 0.1)',
          backdropFilter: 'blur(1px)'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex h-16 items-center border-b",
            showExpandedContent ? "px-6 justify-between" : "px-3 justify-center"
          )}>
            {showExpandedContent && (
              <Link href="/" className="flex items-center space-x-2">
                <ThemeLogo 
                  alt={`${APP_NAME} logotyp`}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  type="symbol"
                />
                <span className="font-bold text-xl">{APP_NAME}</span>
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-all duration-200 sidebar-btn-hover",
                !showExpandedContent ? "h-8 w-8" : ""
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 tech-icon" />
              ) : (
                <ChevronLeft className="h-4 w-4 tech-icon" />
              )}
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className={cn(
              "border-b p-4",
              !showExpandedContent && "flex justify-center"
            )}>
              <div className={cn(
                "flex items-center",
                !showExpandedContent ? "justify-center" : "space-x-3"
              )}>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                {showExpandedContent && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.full_name || user.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={cn(
            "flex-1 space-y-1",
            !showExpandedContent ? "px-2 py-4" : "p-4"
          )}>
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== ADMIN_ROUTES.dashboard && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-colors relative sidebar-btn-hover",
                    !showExpandedContent 
                      ? "justify-center py-3 px-2" 
                      : "space-x-3 px-3 py-2",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title={!showExpandedContent ? item.name : undefined}
                >
                  <item.icon className="h-4 w-4 tech-icon" />
                  {showExpandedContent && <span className="transition-all duration-200">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer - Logout */}
          <div className={cn(
            "border-t p-4",
            !showExpandedContent && "flex justify-center"
          )}>
            <Button
              variant="ghost"
              className={cn(
                "w-full transition-all duration-200 sidebar-btn-hover",
                !showExpandedContent ? "h-10 w-10 p-0" : "justify-start"
              )}
              onClick={handleLogout}
              disabled={isLoggingOut}
              title={!showExpandedContent ? "Logga ut" : undefined}
            >
              <LogOut className="h-4 w-4 tech-icon" />
              {showExpandedContent && (
                <span className="ml-3">
                  {isLoggingOut ? 'Loggar ut...' : 'Logga ut'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}