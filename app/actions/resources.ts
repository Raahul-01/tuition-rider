import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function uploadResource(formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const subject = formData.get('subject') as string
  const grade = formData.get('grade') as string
  const type = formData.get('type') as string

  if (!file || !title || !subject || !grade || !type) {
    return { error: 'Missing required fields' }
  }

  try {
    // Upload file to storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get file URL
    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(fileName)

    // Create resource record
    const { error: dbError } = await supabase
      .from('resources')
      .insert({
        title,
        description,
        subject,
        grade,
        type,
        file_url: publicUrl,
      })

    if (dbError) throw dbError

    revalidatePath('/resources')
    revalidatePath('/admin/resources')
    
    return { success: true }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Failed to upload resource' }
  }
}

export async function getResources(subject?: string, grade?: string, search?: string) {
  const supabase = createServerActionClient({ cookies })
  
  let query = supabase.from('resources').select('*')
  
  if (subject) {
    query = query.eq('subject', subject)
  }
  if (grade) {
    query = query.eq('grade', grade)
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }
  
  return data
}

export async function deleteResource(id: string) {
  const supabase = createServerActionClient({ cookies })
  
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/resources')
    revalidatePath('/admin/resources')
    
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { error: 'Failed to delete resource' }
  }
} 