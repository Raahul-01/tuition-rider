import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get resource details
    const { data: resource } = await supabase
      .from('resources')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!resource) {
      return new NextResponse('Resource not found', { status: 404 })
    }

    // Get download URL from storage
    const { data: fileData } = await supabase
      .storage
      .from('resources')
      .createSignedUrl(resource.file_path, 60) // URL valid for 60 seconds

    if (!fileData?.signedUrl) {
      return new NextResponse('Download URL creation failed', { status: 500 })
    }

    // Update download count
    await supabase
      .from('resources')
      .update({ download_count: (resource.download_count || 0) + 1 })
      .eq('id', params.id)

    // Redirect to signed URL
    return NextResponse.redirect(fileData.signedUrl)
  } catch (error) {
    console.error('Download error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 