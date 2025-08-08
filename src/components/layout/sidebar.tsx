'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { 
  Home,
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Briefcase,
  UserCircle,
  Bell,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'

const navigation = [
  { name: 'Hem', href: PUBLIC_ROUTES.home, icon: Home },
  { name: 'Tjänster', href: PUBLIC_ROUTES.services, icon: Briefcase },
  { name: 'Blogg', href: PUBLIC_ROUTES.blog, icon: FileText },
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
  { name: 'Tjänster', href: '/admin/services', icon: Briefcase },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, signOut } = useAuth()

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

  // Remove the null return - show sidebar for all users

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-full transform border-r bg-background/95 backdrop-blur transition-all duration-200 ease-in-out md:translate-x-0",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex h-16 items-center border-b",
            isCollapsed ? "px-3 justify-center" : "px-6 justify-between"
          )}>
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl">{APP_NAME}</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isCollapsed ? "h-8 w-8" : ""
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* User Info / Login Section */}
          <div className={cn(
            "border-b p-4",
            isCollapsed && "flex justify-center"
          )}>
            {user ? (
              <div className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "space-x-3"
              )}>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
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
            ) : (
              <div className={cn(
                isCollapsed ? "flex justify-center" : "text-center"
              )}>
                {isCollapsed ? (
                  <Button asChild size="sm" variant="ghost" className="h-10 w-10 p-0">
                    <Link href="/admin/login">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <p className="text-sm font-medium mb-3">Inte inloggad</p>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/admin/login">
                        <User className="mr-2 h-4 w-4" />
                        Logga in
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 space-y-1",
            isCollapsed ? "px-2 py-4" : "p-4"
          )}>
            {/* Public Navigation */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Navigation
                </p>
              )}
              {navigation.map((item) => {
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
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>

            {/* Profile Navigation - Only for logged in users */}
            {user && (
              <div className="space-y-1 pt-4">
                {!isCollapsed && (
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
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Admin Navigation */}
            {isAdmin && (
              <div className="space-y-1 pt-4">
                {!isCollapsed && (
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
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className={cn(
            "border-t p-4 space-y-2",
            isCollapsed && "flex flex-col items-center"
          )}>
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && <span className="text-xs text-muted-foreground">Tema</span>}
              <ThemeToggle />
            </div>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isCollapsed 
                    ? "h-8 w-8 p-0" 
                    : "w-full justify-start"
                )}
                onClick={handleSignOut}
                title={isCollapsed ? "Logga ut" : undefined}
              >
                <LogOut className={cn(
                  "h-4 w-4",
                  !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && "Logga ut"}
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Content spacer for desktop */}
      <div className={cn(
        "hidden md:block flex-shrink-0",
        isCollapsed ? "md:w-16" : "md:w-64"
      )} />
    </>
  )
}