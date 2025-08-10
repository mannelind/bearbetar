import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Admin Login | ${APP_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}