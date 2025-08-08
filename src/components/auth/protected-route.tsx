import { requireAdminAuth } from '@/lib/auth'
import { PageLoading } from '@/components/ui/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export async function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  if (!requireAuth) {
    return <>{children}</>
  }

  try {
    await requireAdminAuth()
    return <>{children}</>
  } catch (error) {
    // This will trigger the middleware to redirect
    return <PageLoading />
  }
}