'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const BUCKET_NAME = 'resources'
const ADMIN_REG_NO = 'ADM00191'

// Get environment variables with fallbacks for safety
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const subjects = [
  'English',
  'Hindi',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Social Science',
  'Environmental Studies (EVS)',
  'Computer Science',
  'General Knowledge',
  'Art & Craft',
  'Physical Education'
] as const;

const grades = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10'
] as const;

const resourceTypes = [
  'Previous Year Question Papers',
  'Practice Worksheets',
  'Test Papers',
  'Study Materials',
  'NCERT Solutions',
  'Sample Papers',
  'Chapter Notes',
  'Important Questions',
  'Revision Notes',
  'Holiday Homework'
] as const;

type Subject = typeof subjects[number];
type Grade = typeof grades[number];
type ResourceType = typeof resourceTypes[number];

interface Resource {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  grade: Grade;
  type: ResourceType;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  download_count: number;
  created_at: string;
  uploaded_by: string;
}

export async function uploadResource(formData: FormData) {
  // Create Supabase clients - both normal and with service role for admin operations
  const supabase = createServerActionClient({ cookies })
  const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  
  try {
    console.log("Starting resource upload process...");
    
    // First check if admin-auth cookie exists as a fallback authentication method
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get('admin-auth');
    let isAdminBypassAuth = false;
    
    if (adminCookie && adminCookie.value === 'true') {
      console.log("Admin cookie found, bypassing session check");
      isAdminBypassAuth = true;
    }
    
    // Standard auth check if no admin cookie
    if (!isAdminBypassAuth) {
      console.log("Checking auth session...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session retrieval error:", sessionError);
        throw new Error('Authentication error: Failed to retrieve session');
      }
      
      if (!session) {
        console.error("No active session found");
        throw new Error('Authentication error: No active session found');
      }
      
      console.log("Session found, checking profile...");
      
      // Get user's registration number from metadata
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('registration_number, role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Profile retrieval error:", profileError);
          throw new Error('Failed to verify admin status: Profile error');
        }
        
        if (!profile) {
          console.error("No profile found for user");
          throw new Error('Failed to verify admin status: No profile found');
        }
        
        // Check if user is admin
        if (profile.role !== 'ADMIN' && profile.registration_number !== ADMIN_REG_NO) {
          console.error("User is not an admin:", profile);
          return { error: 'Only administrators can upload resources' };
        }
        
        console.log("Admin verification successful");
      } catch (profileCheckError) {
        console.error("Error during profile check:", profileCheckError);
        throw new Error('Authentication error: Profile check failed');
      }
    }

    console.log("Processing upload form data...");
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as typeof subjects[number];
    const grade = formData.get('grade') as string;
    const type = formData.get('type') as string;

    // Validate required fields
    if (!file || !title || !subject || !grade || !type) {
      console.error('Missing required fields:', { 
        file: !!file, 
        title: !!title, 
        subject: !!subject, 
        grade: !!grade, 
        type: !!type 
      });
      return { error: 'Please fill in all required fields' };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: 'File size must be less than 10MB' };
    }

    // Get file extension and validate
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'];
    
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      return { error: 'Invalid file type. Allowed types: PDF, DOC, DOCX, PPT, PPTX, TXT' };
    }

    // Generate unique filename with sanitized original name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileName = `${Date.now()}-${sanitizedName}`;
    
    try {
      console.log("Converting file for upload...");
      // Convert File to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);
      
      // Try with admin client first (with service role key)
      console.log("Attempting upload with admin privileges...");
      
      let uploadClient = adminSupabase;
      let uploadError;
      
      // Upload file to storage with admin client
      const uploadResult = await uploadClient.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
        
      uploadError = uploadResult.error;
      
      // If admin upload fails, try with regular client
      if (uploadError) {
        console.error('Admin storage upload error:', uploadError);
        console.log("Trying with regular client...");
        
        uploadClient = supabase;
        const regularUploadResult = await uploadClient.storage
          .from(BUCKET_NAME)
          .upload(fileName, fileBuffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });
          
        uploadError = regularUploadResult.error;
      }
      
      // If both clients failed, throw error
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage error: ${uploadError.message}`);
      }

      console.log("File uploaded successfully, getting public URL...");
      // Get file URL
      const { data: { publicUrl } } = uploadClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      console.log("Creating database record...");
      // Create resource record
      const dbClient = isAdminBypassAuth ? adminSupabase : supabase;
      
      // For admin uploads, remove the uploaded_by field entirely to avoid foreign key constraints
      const resourceData = {
        title,
        description: description || '',
        subject: subject.toLowerCase(),
        grade: grade.toLowerCase(),
        type: type.toLowerCase(),
        file_url: publicUrl,
        file_name: fileName,
        file_type: fileExt,
        file_size: file.size,
        download_count: 0,
        created_at: new Date().toISOString()
      };
      
      // Only add uploaded_by if we have a valid user ID from session
      if (!isAdminBypassAuth) {
        // Try to get the session to get a real user ID
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          // @ts-ignore - Add the field only if we have a valid user ID
          resourceData.uploaded_by = session.user.id;
        }
      }
      
      const { error: dbError } = await dbClient
        .from('resources')
        .insert(resourceData);

      if (dbError) {
        // If database insert fails, clean up the uploaded file
        console.error('Database error:', dbError);
        await uploadClient.storage.from(BUCKET_NAME).remove([fileName]);
        throw new Error(`Failed to save resource information: ${dbError.message}`);
      }

      console.log("Resource upload complete!");
      revalidatePath('/resources');
      revalidatePath('/admin/resources');
      
      return { success: true };
    } catch (error) {
      console.error('Upload process error:', error);
      return { error: `Upload failed: ${(error as Error).message}` };
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred while processing your request' };
  }
}

export async function getResources(
  subject?: string,
  grade?: string,
  type?: string,
  search?: string
): Promise<Resource[]> {
  const supabase = createServerActionClient({ cookies })
  
  let query = supabase.from('resources').select('*')
  
  if (subject) {
    query = query.eq('subject', subject.toLowerCase())
  }
  if (grade) {
    query = query.eq('grade', grade.toLowerCase())
  }
  if (type) {
    query = query.eq('type', type.toLowerCase())
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }

  // Convert the data back to proper case
  return (data || []).map(resource => {
    // Find the proper case versions from our constants
    const properSubject = subjects.find(s => s.toLowerCase() === resource.subject)
    const properGrade = grades.find(g => g.toLowerCase() === resource.grade)
    const properType = resourceTypes.find(t => t.toLowerCase() === resource.type)

    return {
      ...resource,
      subject: properSubject || resource.subject,
      grade: properGrade || resource.grade,
      type: properType || resource.type,
    }
  }) as Resource[]
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