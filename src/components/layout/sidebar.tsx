'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { 
  Home,
  FileText, 
  Settings, 
  LogOut,
  LogIn,
  Briefcase,
  UserCircle,
  Bell,
  Heart,
  Pin,
  PinOff,
  Mail,
  FolderOpen
} from 'lucide-react'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'

const navigation = [
  { name: 'Hem', href: PUBLIC_ROUTES.home, icon: Home, tooltip: 'Tillbaka till startsidan 🏠' },
  { name: 'Tjänster', href: PUBLIC_ROUTES.services, icon: Briefcase, tooltip: 'Se vad vi kan hjälpa dig med 💼' },
  { name: 'Portfolio', href: '/portfolio', icon: FolderOpen, tooltip: 'Utforska våra tidigare projekt 🎨' },
  { name: 'Blogg', href: PUBLIC_ROUTES.blog, icon: FileText, tooltip: 'Läs våra senaste artiklar 📝' },
  { name: 'Om oss', href: '/om-oss', icon: UserCircle, tooltip: 'Lär känna teamet bakom Bearbetar 👥' },
  { name: 'Kontakt', href: '/kontakt', icon: Mail, tooltip: 'Hör av dig till oss! 📞' },
]

const profileNavigation = [
  { name: 'Min Profil', href: '/profil', icon: UserCircle, tooltip: 'Hantera din profil och inställningar 👤' },
  { name: 'Inställningar', href: '/installningar', icon: Settings, tooltip: 'Konfigurera dina inställningar ⚙️' },
  { name: 'Meddelanden', href: '/meddelanden', icon: Bell, tooltip: 'Se dina notiser och meddelanden 🔔' },
  { name: 'Favoriter', href: '/favoriter', icon: Heart, tooltip: 'Dina sparade favoriter ❤️' },
]

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Settings, tooltip: 'Administrationspanel för hantering 👑' },
  { name: 'Artiklar', href: '/admin/articles', icon: FileText, tooltip: 'Hantera blogginlägg och artiklar ✍️' },
  { name: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen, tooltip: 'Hantera portfolioprojekt 📁' },
  { name: 'Tjänster', href: '/admin/services', icon: Briefcase, tooltip: 'Hantera tjänster och erbjudanden 🛠️' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true) // Start collapsed
  const [isExpanded, setIsExpanded] = useState(false) // For hover/click state
  const [isPinned, setIsPinned] = useState(false) // Pin state
  const pathname = usePathname()
  const { user, isAdmin, signOut } = useAuth()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hoverOpenTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // Handle hover expand (only if not pinned)
  const handleMouseEnter = () => {
    if (isPinned) return // Don't expand on hover if pinned
    
    // Clear any pending close timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    
    // Clear any existing open timeout
    if (hoverOpenTimeoutRef.current) {
      clearTimeout(hoverOpenTimeoutRef.current)
      hoverOpenTimeoutRef.current = null
    }
    
    // Set a delay before opening (hover delay)
    hoverOpenTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true)
    }, 500) // 500ms delay before opening
  }

  // Handle hover collapse with delay (only if not pinned)
  const handleMouseLeave = () => {
    if (isPinned) return // Don't collapse on hover leave if pinned
    
    // Clear any pending open timeout since we're leaving
    if (hoverOpenTimeoutRef.current) {
      clearTimeout(hoverOpenTimeoutRef.current)
      hoverOpenTimeoutRef.current = null
    }
    
    // Set delay before closing
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 300) // 300ms delay before closing
  }

  // Handle pin toggle
  const handlePinToggle = () => {
    setIsPinned(!isPinned)
    if (!isPinned) {
      // When pinning, ensure sidebar is expanded
      setIsCollapsed(false)
      setIsExpanded(true)
    } else {
      // When unpinning, collapse sidebar
      setIsCollapsed(true)
      setIsExpanded(false)
    }
  }

  // Handle outside click (only if not pinned)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPinned) return // Don't handle outside clicks if pinned
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
  }, [isExpanded, isCollapsed, isPinned])


  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (hoverOpenTimeoutRef.current) {
        clearTimeout(hoverOpenTimeoutRef.current)
      }
    }
  }, [])

  // Determine if sidebar should show expanded content
  // On mobile (when isOpen is true), always show expanded content
  // On desktop, use the collapse/expand logic or pin state
  const showExpandedContent = isOpen || !isCollapsed || isExpanded || isPinned

  // Remove the null return - show sidebar for all users

  return (
    <>

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
          "bg-background/55 backdrop-blur transition-all duration-300 ease-out border-r border-input cyber-glow flex-shrink-0",
          // Mobile positioning and sizing (fixed for mobile overlay)
          isOpen 
            ? "fixed top-0 left-0 w-full h-full translate-y-0 z-[65]" 
            : "fixed top-0 left-0 w-full h-screen -translate-y-full z-[65]",
          // Desktop positioning and sizing (sticky positioning for push effect + follows scroll)
          "md:sticky md:top-0 md:left-auto md:translate-y-0 md:h-[100vh]",
          (showExpandedContent && !isOpen) ? "md:w-64" : "md:w-16"
        )}
        style={{ 
          // Let Tailwind border class handle borders
          background: 'linear-gradient(135deg, transparent, rgba(139, 176, 129, 0.03), transparent 50%, rgba(151, 191, 133, 0.02))',
          boxShadow: '0 0 3px rgba(139, 176, 129, 0.08), 0 0 6px rgba(139, 176, 129, 0.04), 0 0 12px rgba(139, 176, 129, 0.02), inset 0 1px 0 rgba(205, 228, 204, 0.03)',
          backdropFilter: 'blur(1px)'
        }}
        onMouseEnter={!isOpen ? handleMouseEnter : undefined}
        onMouseLeave={!isOpen ? handleMouseLeave : undefined}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto">
          {/* Top section - Header, User Info, and Navigation */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="h-16 relative">
              {/* Logo - always at fixed position (left side when collapsed) */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Link href="/" className="flex items-center justify-center">
                  <ThemeLogo 
                    alt={`${APP_NAME} logotyp`}
                    width={40}
                    height={40}
                    className={cn(
                      "w-10 h-10 transition-transform duration-300 ease-out",
                      showExpandedContent ? "rotate-180" : "rotate-0"
                    )}
                    type="symbol"
                  />
                </Link>
              </div>
              {/* Pin/Unpin button on desktop - only show when expanded */}
              {showExpandedContent && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <SimpleTooltip text={isPinned ? "Koppla loss sidofältet 📌" : "Fäst sidofältet 📌"} side="right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePinToggle}
                      className={cn(
                        "hidden md:flex text-foreground sidebar-btn-hover hover:scale-110 rounded-full",
                        isPinned && "text-primary hover:text-primary/80"
                      )}
                    >
                      {isPinned ? (
                        <Pin className="h-4 w-4 tech-icon" />
                      ) : (
                        <PinOff className="h-4 w-4 tech-icon" />
                      )}
                    </Button>
                  </SimpleTooltip>
                </div>
              )}
            </div>

            {/* User Info / Login Section - Only show when logged in */}
            {user && (
              <div className={cn(
                "border-b p-4 border-border",
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
            <nav 
              id="navigation"
              aria-label="Huvudnavigation"
              className={cn(
                "flex flex-col space-y-1",
                !showExpandedContent ? "px-2 py-4 items-center" : "p-4"
              )}>
            {/* Public Navigation */}
            <div className="flex flex-col space-y-1" role="group" aria-label="Huvudsidor">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SimpleTooltip key={item.href} text={item.tooltip} side="right" disabled={showExpandedContent}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-full text-sm font-medium transition-all duration-200 ease-out relative",
                        !showExpandedContent 
                          ? "justify-center h-10 w-10 p-0" 
                          : "space-x-3 px-3 py-2",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground sidebar-btn-hover"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4 tech-icon" />
                      {showExpandedContent && <span className="transition-all duration-300 ease-out">{item.name}</span>}
                    </Link>
                  </SimpleTooltip>
                )
              })}
            </div>

            {/* Profile Navigation - Only for logged in users */}
            {user && (
              <div className={cn(
                "flex flex-col space-y-1 pt-4",
                !showExpandedContent && "items-center"
              )} role="group" aria-label="Profil och inställningar">
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
                        "flex items-center rounded-full text-sm font-medium transition-all duration-200 ease-out relative",
                        !showExpandedContent 
                          ? "justify-center h-10 w-10 p-0" 
                          : "space-x-3 px-3 py-2",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground sidebar-btn-hover"
                      )}
                      onClick={() => setIsOpen(false)}
                      title={!showExpandedContent ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4 tech-icon" />
                      {showExpandedContent && <span className="transition-all duration-300 ease-out">{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Admin Navigation */}
            {isAdmin && (
              <div className={cn(
                "flex flex-col space-y-1 pt-4",
                !showExpandedContent && "items-center"
              )} role="group" aria-label="Administration">
                {showExpandedContent && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Administration
                  </p>
                )}
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <SimpleTooltip key={item.href} text={item.tooltip} side="right" disabled={showExpandedContent}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-full text-sm font-medium transition-all duration-200 ease-out relative",
                          !showExpandedContent 
                            ? "justify-center h-10 w-10 p-0" 
                            : "space-x-3 px-3 py-2",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground hover:text-accent-foreground hover:bg-muted"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4 tech-icon" />
                        {showExpandedContent && <span className="transition-all duration-300 ease-out">{item.name}</span>}
                      </Link>
                    </SimpleTooltip>
                  )
                })}
              </div>
            )}

            {/* Login/Auth Section - Only show when not logged in */}
            {!user && (
              <div className={cn(
                "flex flex-col space-y-1 pt-4",
                !showExpandedContent && "items-center"
              )} role="group" aria-label="Inloggning">
                {showExpandedContent && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Konto
                  </p>
                )}
                <Link
                  href="/admin/login"
                  className={cn(
                    "flex items-center rounded-full text-sm font-medium transition-all duration-200 ease-out relative",
                    !showExpandedContent 
                      ? "justify-center h-10 w-10 p-0" 
                      : "space-x-3 px-3 py-2",
                    "text-foreground sidebar-btn-hover"
                  )}
                  onClick={() => setIsOpen(false)}
                  title={!showExpandedContent ? "Logga in" : undefined}
                >
                  <LogIn className="h-4 w-4 tech-icon" />
                  {showExpandedContent && <span className="transition-all duration-300 ease-out">Logga in</span>}
                </Link>
              </div>
            )}
            </nav>
          </div>

          {/* Footer */}
          <div className={cn(
            "p-4 space-y-2",
            !showExpandedContent && "flex flex-col items-center"
          )}>
            {user && (
              <SimpleTooltip text="Logga ut från kontot 👋" side="right" disabled={showExpandedContent}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-foreground hover:text-accent-foreground transition-all duration-300 ease-out hover:scale-105 hover:bg-destructive/10 rounded-full",
                    !showExpandedContent 
                      ? "h-8 w-8 p-0" 
                      : "w-full justify-start"
                  )}
                  onClick={handleSignOut}
                >
                  <LogOut className={cn(
                    "h-4 w-4 tech-icon",
                    showExpandedContent && "mr-3"
                  )} />
                  {showExpandedContent && <span className="transition-all duration-300 ease-out">Logga ut</span>}
                </Button>
              </SimpleTooltip>
            )}
            <div className={cn(
              "flex items-center",
              !showExpandedContent ? "justify-center" : "justify-between"
            )}>
              {showExpandedContent && <span className="text-xs text-muted-foreground">Tema</span>}
              <SimpleTooltip text="Byt mellan ljust och mörkt tema ☀️🌙" side="right" disabled={showExpandedContent}>
                <ThemeToggle />
              </SimpleTooltip>
            </div>
          </div>
        </div>
      </aside>

    </>
  )
}