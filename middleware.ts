import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Admin email list
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get user session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAdminRoute = url.pathname.startsWith('/admin')
  const isLoginPage = url.pathname === '/admin/login'

  // If accessing admin routes (except login page)
  if (isAdminRoute && !isLoginPage) {
    // No user session - redirect to login
    if (!user || error) {
      url.pathname = '/admin/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // User exists but not admin email - redirect to login with error
    if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }

    // Admin user - allow access
    return response
  }

  // If accessing login page and already authenticated admin
  if (isLoginPage && user?.email && ADMIN_EMAILS.includes(user.email)) {
    const redirectTo = url.searchParams.get('redirectTo')
    url.pathname = redirectTo || '/admin'
    url.searchParams.delete('redirectTo')
    return NextResponse.redirect(url)
  }

  // For all other routes, just return the response
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images in the public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}