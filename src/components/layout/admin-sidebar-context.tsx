'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminSidebarContextType {
  isCollapsed: boolean
  isExpanded: boolean
  showExpandedContent: boolean
  sidebarWidth: string
  setSidebarState: (collapsed: boolean, expanded: boolean) => void
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined)

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const showExpandedContent = !isCollapsed || isExpanded
  
  // Calculate sidebar width based on state
  const sidebarWidth = showExpandedContent ? '16rem' : '4rem'
  
  const setSidebarState = (collapsed: boolean, expanded: boolean) => {
    setIsCollapsed(collapsed)
    setIsExpanded(expanded)
  }
  
  // Update CSS custom property for dynamic padding
  useEffect(() => {
    document.documentElement.style.setProperty('--admin-sidebar-width', sidebarWidth)
  }, [sidebarWidth])
  
  return (
    <AdminSidebarContext.Provider value={{
      isCollapsed,
      isExpanded,
      showExpandedContent,
      sidebarWidth,
      setSidebarState
    }}>
      {children}
    </AdminSidebarContext.Provider>
  )
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext)
  if (context === undefined) {
    throw new Error('useAdminSidebar must be used within an AdminSidebarProvider')
  }
  return context
} 