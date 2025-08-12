import { requireAdminAuth, getAdminProfile } from '@/lib/auth'
import { AdminNavigation } from '@/components/layout/admin-navigation'
import { AdminSidebarProvider } from '@/components/layout/admin-sidebar-context'

interface AdminPageWrapperProps {
  children: React.ReactNode
}

async function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  // This will redirect to login if not authenticated
  const user = await requireAdminAuth()
  
  // Get admin profile data
  const adminProfile = await getAdminProfile(user.id)
  
  const userData = {
    email: user.email,
    full_name: adminProfile?.full_name || null,
  }

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AdminNavigation user={userData} />
        <div className="flex-1 transition-all duration-300 ease-in-out lg:pl-[var(--admin-sidebar-width)]">
          <main className="container py-6">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}

export default AdminPageWrapper
export { AdminPageWrapper }