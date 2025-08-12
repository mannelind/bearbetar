import { redirect } from 'next/navigation'
import { AdminPageWrapper } from '@/components/auth/admin-page-wrapper'
import { ProfileForm } from '@/components/admin/profile-form'
import { createServerComponentClient } from '@/lib/supabase'

export default async function ProfilePage() {
  const supabase = await createServerComponentClient()
  
  // Hämta nuvarande användare
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    redirect('/admin/login')
  }

  // Hämta admin-användardata
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (adminError || !adminUser) {
    console.error('Error fetching admin user:', adminError)
    redirect('/admin/login')
  }

  return (
    <AdminPageWrapper>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profilinställningar</h1>
          <p className="text-muted-foreground">
            Hantera din profilinformation och bild
          </p>
        </div>

        <ProfileForm user={adminUser} />
      </div>
    </AdminPageWrapper>
  )
}