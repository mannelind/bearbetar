import { requireAdminAuth, getAdminProfile } from '@/lib/auth'
import { AdminNavigation } from '@/components/layout/admin-navigation'

interface AdminPageWrapperProps {
  children: React.ReactNode
}

export default async function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  // This will redirect to login if not authenticated
  const user = await requireAdminAuth()
  
  // Get admin profile data
  const adminProfile = await getAdminProfile(user.id)
  
  const userData = {
    email: user.email,
    full_name: adminProfile?.full_name || null,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavigation user={userData} />
      <div className="flex-1 lg:pl-64">
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  )
}