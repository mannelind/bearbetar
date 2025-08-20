'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'

interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const allItems = [
    { name: 'Hem', url: '/', current: false },
    ...items,
  ]

  return (
    <>
      <BreadcrumbStructuredData items={allItems} />
      <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
              )}
              {item.current ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-foreground transition-colors flex items-center"
                >
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
} 