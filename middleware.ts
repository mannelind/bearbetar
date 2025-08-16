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

  const url = request.nextUrl.clone()
  const isAdminRoute = url.pathname.startsWith('/admin')
  const isLoginPage = url.pathname === '/admin/login'

  // Allow login page to load without Supabase validation
  if (isLoginPage) {
    return response
  }

  // Check if Supabase is properly configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    // Redirect admin routes to login if Supabase not configured
    if (isAdminRoute) {
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'config_error')
      return NextResponse.redirect(url)
    }
    return response
  }

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
  const result = await supabase.auth.getUser()
  const user = result.data.user
  const error = result.error

  // If accessing admin routes (except login page)
  if (isAdminRoute && !isLoginPage) {
    // No user session - redirect to login
    if (!user || error) {
      url.pathname = '/admin/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // User exists but not admin email - redirect to login with error
    const isAdminEmail = ADMIN_EMAILS.includes(user.email || '')
    if (!user.email || !isAdminEmail) {
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }

    // Admin user - allow access
    return response
  }

  // If accessing login page and already authenticated admin
  const isUserAdmin = ADMIN_EMAILS.includes(user?.email || '')
  if (isLoginPage && user?.email && isUserAdmin) {
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