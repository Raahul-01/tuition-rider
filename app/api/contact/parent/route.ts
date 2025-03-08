import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const parentContact = await prisma.parentContact.create({
      data: {
        parentName: data.parentName,
        parentOccupation: data.parentOccupation,
        phoneNumber: data.phoneNumber,
        discountCode: data.discountCode,
        studentDetails: data.studentDetails,
        schoolName: data.schoolName,
        previousMarks: data.previousMarks,
        subjects: data.subjects,
        challenges: data.challenges,
        preferredTimeSlot: data.preferredTimeSlot,
        sessionsPerWeek: parseInt(data.sessionsPerWeek),
        classMode: data.classMode,
        tutorGenderPreference: data.tutorGenderPreference,
        tutorGoals: data.tutorGoals,
        address: data.address,
        city: data.city,
      },
    })

    return NextResponse.json({ success: true, data: parentContact })
  } catch (error) {
    console.error('Error creating parent contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    )
  }
} 