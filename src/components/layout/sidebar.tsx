'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { 
  Home,
  FileText, 
  Settings, 
  LogOut,
  LogIn,
  Menu,
  X,
  Briefcase,
  UserCircle,
  Bell,
  Heart,
  ChevronLeft,
  ChevronRight,
  Mail,
  FolderOpen
} from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'

const navigation = [
  { name: 'Hem', href: PUBLIC_ROUTES.home, icon: Home },
  { name: 'Tjänster', href: PUBLIC_ROUTES.services, icon: Briefcase },
  { name: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { name: 'Blogg', href: PUBLIC_ROUTES.blog, icon: FileText },
  { name: 'Om oss', href: '/om-oss', icon: UserCircle },
  { name: 'Kontakt', href: '/kontakt', icon: Mail },
]

const profileNavigation = [
  { name: 'Min Profil', href: '/profil', icon: UserCircle },
  { name: 'Inställningar', href: '/installningar', icon: Settings },
  { name: 'Meddelanden', href: '/meddelanden', icon: Bell },
  { name: 'Favoriter', href: '/favoriter', icon: Heart },
]

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Settings },
  { name: 'Artiklar', href: '/admin/articles', icon: FileText },
  { name: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
  { name: 'Tjänster', href: '/admin/services', icon: Briefcase },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true) // Start collapsed
  const [isExpanded, setIsExpanded] = useState(false) // For hover/click state
  const pathname = usePathname()
  const { user, isAdmin, signOut } = useAuth()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserInitials = (email: string | undefined) => {
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  // Handle hover expand
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsExpanded(true)
  }

  // Handle hover collapse with delay
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 300) // 300ms delay before closing
  }

  // Handle click to toggle permanent expanded state
  const handleClick = () => {
    setIsCollapsed(!isCollapsed)
    setIsExpanded(!isCollapsed) // If expanding permanently, also set expanded
  }

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // If sidebar is temporarily expanded via hover (collapsed but expanded), close it
        if (isExpanded && isCollapsed) {
          setIsExpanded(false)
        }
        // If sidebar is permanently expanded (not collapsed), collapse it
        else if (!isCollapsed) {
          setIsCollapsed(true)
          setIsExpanded(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, isCollapsed])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Determine if sidebar should show expanded content
  // On mobile (when isOpen is true), always show expanded content
  // On desktop, use the collapse/expand logic
  const showExpandedContent = isOpen || !isCollapsed || isExpanded

  // Remove the null return - show sidebar for all users

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-[70] md:hidden"
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
          "fixed z-[60] transform bg-background/95 backdrop-blur transition-all duration-300 ease-in-out cyber-border cyber-glow",
          // Mobile positioning and sizing
          isOpen 
            ? "top-0 left-0 w-full h-full translate-y-0" 
            : "top-0 left-0 w-full h-full -translate-y-full",
          // Desktop positioning and sizing (always visible)
          "md:top-0 md:left-0 md:h-full md:translate-y-0 md:translate-x-0",
          (showExpandedContent && !isOpen) ? "md:w-64" : "md:w-16",
          // Desktop styling - add right border and rounded corners
          "md:border-r-[3px] md:border-r-[rgba(139,176,129,0.6)] md:rounded-r-xl"
        )}
        style={{ 
          // Mobile: no special borders when full screen, Desktop: right border accent
          border: '1px solid rgba(139, 176, 129, 0.4)',
          borderRight: isOpen ? '1px solid rgba(139, 176, 129, 0.4)' : '1px solid rgba(139, 176, 129, 0.4)',
          borderRadius: isOpen ? '0' : '0',
          background: 'linear-gradient(135deg, transparent, rgba(139, 176, 129, 0.05), transparent 50%, rgba(151, 191, 133, 0.03))',
          boxShadow: '0 0 8px rgba(139, 176, 129, 0.25), 0 0 18px rgba(139, 176, 129, 0.12), 0 0 35px rgba(139, 176, 129, 0.06), inset 0 1px 0 rgba(205, 228, 204, 0.1)',
          backdropFilter: 'blur(1px)'
        }}
        onMouseEnter={!isOpen ? handleMouseEnter : undefined}
        onMouseLeave={!isOpen ? handleMouseLeave : undefined}
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
              </Link>
            )}
            {/* Only show collapse/expand button on desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              className={cn(
                "hidden md:flex text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110",
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

          {/* User Info / Login Section - Only show when logged in */}
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
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
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
            {/* Public Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg text-sm font-medium transition-colors relative",
                      !showExpandedContent 
                        ? "justify-center py-3 px-2" 
                        : "space-x-3 px-3 py-2",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsOpen(false)}
                    title={!showExpandedContent ? item.name : undefined}
                  >
                    <item.icon className="h-4 w-4 tech-icon" />
                    {showExpandedContent && <span className="transition-all duration-200">{item.name}</span>}
                  </Link>
                )
              })}
            </div>

            {/* Profile Navigation - Only for logged in users */}
            {user && (
              <div className="space-y-1 pt-4">
                {showExpandedContent && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Profil & Inställningar
                  </p>
                )}
                {profileNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-colors relative",
                        isCollapsed 
                          ? "justify-center py-3 px-2" 
                          : "space-x-3 px-3 py-2",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                      title={!showExpandedContent ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4 tech-icon" />
                      {showExpandedContent && <span className="transition-all duration-200">{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Admin Navigation */}
            {isAdmin && (
              <div className="space-y-1 pt-4">
                {showExpandedContent && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Administration
                  </p>
                )}
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-colors relative",
                        isCollapsed 
                          ? "justify-center py-3 px-2" 
                          : "space-x-3 px-3 py-2",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                      title={!showExpandedContent ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4 tech-icon" />
                      {showExpandedContent && <span className="transition-all duration-200">{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Login/Auth Section - Only show when not logged in */}
            {!user && (
              <div className="space-y-1 pt-4">
                {showExpandedContent && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Konto
                  </p>
                )}
                <Link
                  href="/admin/login"
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-colors relative",
                    !showExpandedContent 
                      ? "justify-center py-3 px-2" 
                      : "space-x-3 px-3 py-2",
                    "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                  title={!showExpandedContent ? "Logga in" : undefined}
                >
                  <LogIn className="h-4 w-4 tech-icon" />
                  {showExpandedContent && <span className="transition-all duration-200">Logga in</span>}
                </Link>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className={cn(
            "border-t p-4 space-y-2",
            !showExpandedContent && "flex flex-col items-center"
          )}>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 hover:bg-destructive/10",
                  !showExpandedContent 
                    ? "h-8 w-8 p-0" 
                    : "w-full justify-start"
                )}
                onClick={handleSignOut}
                title={!showExpandedContent ? "Logga ut" : undefined}
              >
                <LogOut className={cn(
                  "h-4 w-4 tech-icon",
                  showExpandedContent && "mr-3"
                )} />
                {showExpandedContent && <span className="transition-all duration-200">Logga ut</span>}
              </Button>
            )}
            <div className={cn(
              "flex items-center",
              !showExpandedContent ? "justify-center" : "justify-between"
            )}>
              {showExpandedContent && <span className="text-xs text-muted-foreground">Tema</span>}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Content spacer for desktop */}
      <div className={cn(
        "hidden md:block flex-shrink-0",
        (showExpandedContent && !isOpen) ? "md:w-64" : "md:w-16"
      )} />
    </>
  )
}