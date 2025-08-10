import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// Get the list of admin emails from environment variables
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []

/**
 * Check if an email is in the admin list
 */
export function isAdminEmail(email: string): boolean {
  // Temporary bypass for development - accept any email
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  return ADMIN_EMAILS.includes(email)
}

/**
 * Get current user session (server-side)
 */
export async function getUser(): Promise<User | null> {
  // Development mode bypass - return mock user
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'dev-user-123',
      email: 'dev@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {},
      app_metadata: {}
    } as User
  }

  const supabase = await createServerComponentClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Get current session (server-side)
 */
export async function getSession() {
  const supabase = await createServerComponentClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser()
  
  if (!user?.email) {
    return false
  }
  
  return isAdminEmail(user.email)
}

/**
 * Require admin authentication - redirect to login if not admin
 */
export async function requireAdminAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/admin/login')
  }
  
  if (!user.email || !isAdminEmail(user.email)) {
    redirect('/admin/login?error=unauthorized')
  }
  
  return user
}

/**
 * Check if user exists in admin_users table
 */
export async function ensureAdminUser(user: User) {
  const supabase = await createServerComponentClient()
  
  if (!user.email || !isAdminEmail(user.email)) {
    throw new Error('User is not authorized as admin')
  }
  
  // Check if admin user exists
  const { data: existingUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()
  
  // Create admin user record if it doesn't exist
  if (!existingUser) {
    const { error } = await supabase
      .from('admin_users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
      })
    
    if (error) {
      console.error('Error creating admin user:', error)
    }
  }
}

/**
 * Sign in with magic link
 */
export async function signInWithMagicLink(email: string, redirectTo?: string) {
  const supabase = await createServerComponentClient()
  
  if (!isAdminEmail(email)) {
    throw new Error('Email is not authorized for admin access')
  }
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  })
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = await createServerComponentClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
  
  redirect('/admin/login')
}

/**
 * Get admin user profile
 */
export async function getAdminProfile(userId: string) {
  const supabase = await createServerComponentClient()
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching admin profile:', error)
    return null
  }
  
  return data
}