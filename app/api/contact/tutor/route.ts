import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const tutorContact = await prisma.tutorContact.create({
      data: {
        name: data.name,
        age: parseInt(data.age),
        currentOccupation: data.currentOccupation,
        phoneNumber: data.phoneNumber,
        email: data.email,
        tenthPercentage: parseFloat(data.tenthPercentage),
        tenthBoard: data.tenthBoard,
        twelfthPercentage: parseFloat(data.twelfthPercentage),
        twelfthBoard: data.twelfthBoard,
        hasTeachingExperience: data.hasTeachingExperience,
        hasSchoolExperience: data.hasSchoolExperience,
        maxClassLevel: data.maxClassLevel,
        subjects: data.subjects,
        teachingPreference: data.teachingPreference,
        currentAddress: data.currentAddress,
        city: data.city,
        state: data.state,
      },
    })

    return NextResponse.json({ success: true, data: tutorContact })
  } catch (error) {
    console.error('Error creating tutor contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    )
  }
} 