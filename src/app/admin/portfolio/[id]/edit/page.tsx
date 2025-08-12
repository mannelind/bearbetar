import { Suspense } from 'react'
import { AdminPageWrapper } from '@/components/auth/admin-page-wrapper'
import { PortfolioForm } from '@/components/forms/portfolio-form'
import { createServerComponentClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import { notFound } from 'next/navigation'

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']

async function EditPortfolioForm({ id }: { id: string }) {
  const supabase = await createServerComponentClient()

  const { data: portfolioItem, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !portfolioItem) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Redigera Portfolio Item</h1>
        <p className="text-muted-foreground">
          Uppdatera ditt portfolioarbete eller case study
        </p>
      </div>
      
      <PortfolioForm portfolioItem={portfolioItem} />
    </div>
  )
}

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
  return (
    <AdminPageWrapper>
      <Suspense fallback={<div>Loading portfolio item...</div>}>
        <EditPortfolioForm id={params.id} />
      </Suspense>
    </AdminPageWrapper>
  )
}