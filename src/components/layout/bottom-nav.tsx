'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SimpleTooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { 
  Briefcase,
  FileText,
  FolderOpen
} from 'lucide-react'
import { PUBLIC_ROUTES } from '@/lib/constants'

const bottomNavItems = [
  {
    name: 'Tjänster',
    href: PUBLIC_ROUTES.services,
    icon: Briefcase,
    tooltip: 'Se våra tjänster 💼'
  },
  {
    name: 'Portfolio',
    href: '/portfolio',
    icon: FolderOpen,
    tooltip: 'Våra projekt 🎨'
  },
  {
    name: 'Blogg',
    href: PUBLIC_ROUTES.blog,
    icon: FileText,
    tooltip: 'Läs artiklar 📝'
  }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bottom-nav">
      <div className="flex items-center justify-around px-2 py-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <SimpleTooltip key={item.href} text={item.tooltip} side="top">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 sidebar-btn-hover",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] leading-none">{item.name}</span>
              </Link>
            </SimpleTooltip>
          )
        })}
      </div>
    </nav>
  )
}