'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabase(): SupabaseClient {
  const [supabase] = useState(() => createClient())
  return supabase
}

export function useSupabaseQuery<T>(
  queryFn: (supabase: SupabaseClient) => Promise<{ data: T | null; error: any }>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = useSupabase()

  const refetch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await queryFn(supabase)
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [refetch, supabase, ...deps])

  return {
    data,
    error,
    loading,
    refetch,
  }
}