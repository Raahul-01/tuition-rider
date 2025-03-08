import { createAdminUser } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await createAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Admin user created successfully', user })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 