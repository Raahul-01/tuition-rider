'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface ParentFormData {
  parentName: string
  parentOccupation: string
  phoneNumber: string
  discountCode?: string
  studentDetails: string
  schoolName: string
  previousMarks: string
  subjects: string
  challenges: string
  preferredTimeSlot: string
  sessionsPerWeek: string
  classMode: string
  tutorGenderPreference: string
  tutorGoals: string
  address: string
  city: string
}

interface TutorFormData {
  name: string
  age: string
  phone: string
  email: string
  currentOccupation: string
  tenthPercentage: string
  tenthBoard: string
  twelfthPercentage: string
  twelfthBoard: string
  qualification: string
  hasTeachingExperience: string
  hasSchoolExperience: string
  maxClassLevel: string
  subjects: string
  teachingPreference: string
  currentAddress: string
  city: string
  state: string
  message: string
}

export async function submitParentForm(formData: ParentFormData) {
  const supabase = createServerActionClient({ cookies })

  try {
    // Log the form data for debugging
    console.log('Submitting parent form data:', formData)

    // Save to Supabase with the correct column name
    const { data, error: dbError } = await supabase
      .from('parent_submissions')
      .insert({
        parent_name: formData.parentName,
        parent_occupation: formData.parentOccupation,
        phone_number: formData.phoneNumber,
        discount_code: formData.discountCode,
        student_details: formData.studentDetails,
        school_name: formData.schoolName,
        previous_marks: formData.previousMarks,
        subjects: formData.subjects,
        challenges: formData.challenges,
        preferred_time_slot: formData.preferredTimeSlot,
        sessions_per_week: formData.sessionsPerWeek,
        class_mode: formData.classMode,
        tutor_gender_preference: formData.tutorGenderPreference,
        tutor_goals: formData.tutorGoals,
        address: formData.address,
        city: formData.city,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()

    if (dbError) {
      console.error('Database error details:', {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint
      })
      throw dbError
    }

    console.log('Successfully inserted parent submission:', data)

    // Send WhatsApp notification
    const whatsappMessage = `
🔔 New Parent Enquiry

👤 Parent Information:
Name: ${formData.parentName}
Occupation: ${formData.parentOccupation}
Phone: ${formData.phoneNumber}
${formData.discountCode ? `Discount Code: ${formData.discountCode}` : ''}

📚 Student Information:
Details: ${formData.studentDetails}
School: ${formData.schoolName}
Previous Marks: ${formData.previousMarks}

📝 Requirements:
Subjects: ${formData.subjects}
Challenges: ${formData.challenges}
Preferred Time: ${formData.preferredTimeSlot}
Sessions/Week: ${formData.sessionsPerWeek}
Class Mode: ${formData.classMode}
Tutor Preference: ${formData.tutorGenderPreference}
Goals: ${formData.tutorGoals}

📍 Location:
Address: ${formData.address}
City: ${formData.city}
    `.trim()

    // Send to WhatsApp using the WhatsApp Business API
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: process.env.ADMIN_WHATSAPP_NUMBER,
            type: "text",
            text: {
              body: whatsappMessage
            }
          })
        })

        if (!response.ok) {
          console.error('WhatsApp API error:', await response.text())
        }
      } catch (error) {
        console.error('WhatsApp notification error:', error)
        // Don't throw here, as we still want to return success if the form was saved
      }
    }

    revalidatePath('/contact')
    revalidatePath('/admin/contact')
    return { success: true }
  } catch (error) {
    console.error('Parent form submission error:', error)
    return { error: 'Failed to submit form' }
  }
}

export async function submitTutorForm(formData: TutorFormData) {
  const supabase = createServerActionClient({ cookies })

  try {
    // Log the form data for debugging
    console.log('Submitting tutor form data:', formData)

    // Save to Supabase with the correct column names
    const { data, error: dbError } = await supabase
      .from('tutor_submissions')
      .insert({
        name: formData.name,
        age: formData.age,
        phone: formData.phone,
        email: formData.email,
        current_occupation: formData.currentOccupation,
        tenth_percentage: formData.tenthPercentage,
        tenth_board: formData.tenthBoard,
        twelfth_percentage: formData.twelfthPercentage,
        twelfth_board: formData.twelfthBoard,
        qualification: formData.qualification,
        has_teaching_experience: formData.hasTeachingExperience,
        has_school_experience: formData.hasSchoolExperience,
        max_class_level: formData.maxClassLevel,
        subjects: formData.subjects,
        teaching_preference: formData.teachingPreference,
        current_address: formData.currentAddress,
        city: formData.city,
        state: formData.state,
        message: formData.message,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()

    if (dbError) {
      console.error('Database error details:', {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint
      })
      throw dbError
    }

    console.log('Successfully inserted tutor submission:', data)

    // Send WhatsApp notification
    const whatsappMessage = `
🔔 New Tutor Application

👤 Personal Information:
Name: ${formData.name}
Age: ${formData.age}
Phone: ${formData.phone}
Email: ${formData.email}
Current Occupation: ${formData.currentOccupation}

📚 Academic Information:
10th: ${formData.tenthPercentage}% (${formData.tenthBoard})
12th: ${formData.twelfthPercentage}% (${formData.twelfthBoard})
Qualification: ${formData.qualification}

👨‍🏫 Teaching Experience:
Teaching Experience: ${formData.hasTeachingExperience}
School Experience: ${formData.hasSchoolExperience}
Max Class Level: ${formData.maxClassLevel}
Subjects: ${formData.subjects}
Teaching Preference: ${formData.teachingPreference}

📍 Location:
Address: ${formData.currentAddress}
City: ${formData.city}
State: ${formData.state}

💬 Additional Message:
${formData.message}
    `.trim()

    // Send to WhatsApp using the WhatsApp Business API
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: process.env.ADMIN_WHATSAPP_NUMBER,
            type: "text",
            text: {
              body: whatsappMessage
            }
          })
        })

        if (!response.ok) {
          console.error('WhatsApp API error:', await response.text())
        }
      } catch (error) {
        console.error('WhatsApp notification error:', error)
        // Don't throw here, as we still want to return success if the form was saved
      }
    }

    revalidatePath('/contact')
    revalidatePath('/admin/contact')
    return { success: true }
  } catch (error) {
    console.error('Tutor form submission error:', error)
    return { error: 'Failed to submit form' }
  }
}

export async function getSubmissions(type: 'parent' | 'tutor', filters?: {
  status?: string
  search?: string
  startDate?: string
  endDate?: string
}) {
  const supabase = createServerActionClient({ cookies })
  
  const table = type === 'parent' ? 'parent_submissions' : 'tutor_submissions'
  let query = supabase.from(table).select('*')
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters?.search) {
    if (type === 'parent') {
      query = query.or(`parent_name.ilike.%${filters.search}%,student_details.ilike.%${filters.search}%,city.ilike.%${filters.search}%`)
    } else {
      query = query.or(`name.ilike.%${filters.search}%,subjects.ilike.%${filters.search}%,city.ilike.%${filters.search}%`)
    }
  }
  
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate)
  }
  
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.error(`Error fetching ${type} submissions:`, error)
    return []
  }
  
  return data
}

export async function updateSubmissionStatus(
  type: 'parent' | 'tutor',
  id: string,
  status: string
) {
  const supabase = createServerActionClient({ cookies })
  const table = type === 'parent' ? 'parent_submissions' : 'tutor_submissions'

  try {
    const { error } = await supabase
      .from(table)
      .update({ status })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/contact')
    return { success: true }
  } catch (error) {
    console.error(`Error updating ${type} submission status:`, error)
    return { error: 'Failed to update status' }
  }
}

export async function deleteSubmission(
  type: 'parent' | 'tutor',
  id: string
) {
  const supabase = createServerActionClient({ cookies })
  const table = type === 'parent' ? 'parent_submissions' : 'tutor_submissions'

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/contact')
    return { success: true }
  } catch (error) {
    console.error(`Error deleting ${type} submission:`, error)
    return { error: 'Failed to delete submission' }
  }
} 