import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { isAdminEmail, ensureAdminUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createRouteHandlerClient()
    
    try {
      // Exchange code for session
      const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/admin/login?error=auth_error`)
      }
      
      if (!user?.email) {
        console.error('No user email after authentication')
        return NextResponse.redirect(`${origin}/admin/login?error=no_email`)
      }
      
      // Check if user is authorized admin
      if (!isAdminEmail(user.email)) {
        console.warn(`Unauthorized login attempt by: ${user.email}`)
        
        // Sign out the unauthorized user
        await supabase.auth.signOut()
        
        return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`)
      }
      
      // Ensure admin user record exists
      try {
        await ensureAdminUser(user)
      } catch (adminError) {
        console.error('Error ensuring admin user:', adminError)
        // Continue anyway, this is not critical
      }
      
      console.log(`Successful admin login: ${user.email}`)
      
      // Redirect to requested page or admin dashboard
      return NextResponse.redirect(`${origin}${next}`)
      
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(`${origin}/admin/login?error=server_error`)
    }
  }

  // No code parameter - invalid callback
  console.error('Auth callback called without code parameter')
  return NextResponse.redirect(`${origin}/admin/login?error=missing_code`)
}