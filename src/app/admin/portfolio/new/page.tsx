import { AdminPageWrapper } from '@/components/auth/admin-page-wrapper'
import { PortfolioForm } from '@/components/forms/portfolio-form'

export default function NewPortfolioPage() {
  return (
    <AdminPageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Skapa Nytt Portfolio Item</h1>
          <p className="text-muted-foreground">
            Lägg till ett nytt portfolioarbete eller case study
          </p>
        </div>
        
        <PortfolioForm />
      </div>
    </AdminPageWrapper>
  )
}