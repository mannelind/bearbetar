import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createRouteHandlerClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: 'Kunde inte logga ut' },
        { status: 500 }
      )
    }
    
    return NextResponse.redirect(new URL('/admin/login', request.url))
  } catch (error) {
    console.error('Unexpected logout error:', error)
    return NextResponse.json(
      { error: 'Ett oväntat fel inträffade' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}