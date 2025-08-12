import { redirect } from 'next/navigation'
import { AdminPageWrapper } from '@/components/auth/admin-page-wrapper'
import { CompanySettingsForm } from '@/components/admin/company-settings-form'
import { createServerComponentClient } from '@/lib/supabase'

export default async function SettingsPage() {
  const supabase = await createServerComponentClient()
  
  // Hämta nuvarande användare
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    redirect('/admin/login')
  }

  // Kontrollera att användaren är admin
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (adminError || !adminUser) {
    console.error('Error fetching admin user:', adminError)
    redirect('/admin/login')
  }

  // Hämta företagsinställningar
  let settings: Record<string, any> = {}
  
  try {
    const { data: companySettings, error: settingsError } = await supabase
      .from('company_settings')
      .select('key, value')

    if (!settingsError && companySettings) {
      settings = companySettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, any>)
    }
  } catch (error) {
    console.error('Error fetching company settings:', error)
  }

  return (
    <AdminPageWrapper>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Företagsinställningar</h1>
          <p className="text-muted-foreground">
            Hantera allmän information om företaget
          </p>
        </div>

        <CompanySettingsForm settings={settings} />
      </div>
    </AdminPageWrapper>
  )
}