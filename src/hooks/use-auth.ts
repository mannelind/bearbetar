'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session } from '@supabase/supabase-js'
import { useSupabase } from './use-supabase'
import { isAdminEmail } from '@/lib/auth'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
}

interface AuthHook extends AuthState {
  signOut: () => Promise<void>
}

export function useAuth(): AuthHook {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
  })
  
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      }
      
      const user = session?.user || null
      const isAdmin = user?.email ? isAdminEmail(user.email) : false
      
      setAuthState({
        user,
        session,
        loading: false,
        isAdmin,
      })
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null
        const isAdmin = user?.email ? isAdminEmail(user.email) : false
        
        setAuthState({
          user,
          session,
          loading: false,
          isAdmin,
        })

        // Handle auth events
        if (event === 'SIGNED_IN') {
          router.refresh()
        } else if (event === 'SIGNED_OUT') {
          router.push('/admin/login')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  return {
    ...authState,
    signOut,
  }
}

export function useRequireAuth(requireAdmin = true) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.loading) {
      if (!auth.user) {
        router.push('/admin/login')
      } else if (requireAdmin && !auth.isAdmin) {
        router.push('/admin/login?error=unauthorized')
      }
    }
  }, [auth.loading, auth.user, auth.isAdmin, requireAdmin, router])

  return auth
}

export async function signOut() {
  const { createClient } = await import('@/lib/supabase')
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}