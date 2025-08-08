import { Metadata } from 'next'
import { requireAdminAuth, getAdminProfile } from '@/lib/auth'
import { AdminNavigation } from '@/components/layout/admin-navigation'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: {
    default: `Admin | ${APP_NAME}`,
    template: `%s | Admin | ${APP_NAME}`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if not authenticated
  const user = await requireAdminAuth()
  
  // Get admin profile data
  const adminProfile = await getAdminProfile(user.id)
  
  const userData = {
    email: user.email,
    full_name: adminProfile?.full_name || null,
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminNavigation user={userData} />
      <div className="flex-1 flex flex-col lg:pl-64">
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}