const { PrismaClient, UserRole, TeachingMode, GenderType } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create 5 tutors
  const tutors = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      contactNumber: '+91-9876543210',
      address: '123 Main St, Mumbai',
      gender: GenderType.MALE,
      dateOfBirth: new Date('1990-01-15'),
      subjects: ['Mathematics', 'Physics'],
      customSubjects: ['Advanced Calculus'],
      qualification: 'M.Sc. in Physics',
      experience: '5 years',
      teachingMode: TeachingMode.BOTH,
      location: 'Mumbai',
      availability: ['Monday', 'Wednesday', 'Friday'],
      hourlyRate: 1000,
      bio: 'Experienced tutor specializing in Mathematics and Physics',
      idProofUrl: 'https://example.com/id/john-doe',
      qualificationCertificatesUrl: ['https://example.com/cert/john-doe-1'],
    },
    {
      email: 'sarah.smith@example.com',
      name: 'Sarah Smith',
      firstName: 'Sarah',
      lastName: 'Smith',
      contactNumber: '+91-9876543211',
      address: '456 Park Ave, Delhi',
      gender: GenderType.FEMALE,
      dateOfBirth: new Date('1992-03-20'),
      subjects: ['Chemistry', 'Biology'],
      customSubjects: ['Organic Chemistry'],
      qualification: 'Ph.D. in Chemistry',
      experience: '3 years',
      teachingMode: TeachingMode.ONLINE,
      location: 'Delhi',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      hourlyRate: 1200,
      bio: 'Passionate about making science easy to understand',
      idProofUrl: 'https://example.com/id/sarah-smith',
      qualificationCertificatesUrl: ['https://example.com/cert/sarah-smith-1'],
    },
    {
      email: 'raj.kumar@example.com',
      name: 'Raj Kumar',
      firstName: 'Raj',
      lastName: 'Kumar',
      contactNumber: '+91-9876543212',
      address: '789 Lake Road, Bangalore',
      gender: GenderType.MALE,
      dateOfBirth: new Date('1988-07-10'),
      subjects: ['Computer Science', 'Mathematics'],
      customSubjects: ['Python Programming'],
      qualification: 'B.Tech in Computer Science',
      experience: '7 years',
      teachingMode: TeachingMode.BOTH,
      location: 'Bangalore',
      availability: ['Monday', 'Tuesday', 'Wednesday'],
      hourlyRate: 1500,
      bio: 'Teaching programming and mathematics with practical examples',
      idProofUrl: 'https://example.com/id/raj-kumar',
      qualificationCertificatesUrl: ['https://example.com/cert/raj-kumar-1'],
    },
    {
      email: 'priya.patel@example.com',
      name: 'Priya Patel',
      firstName: 'Priya',
      lastName: 'Patel',
      contactNumber: '+91-9876543213',
      address: '321 Hill View, Chennai',
      gender: GenderType.FEMALE,
      dateOfBirth: new Date('1991-12-05'),
      subjects: ['English', 'History'],
      customSubjects: ['Creative Writing'],
      qualification: 'M.A. in English Literature',
      experience: '4 years',
      teachingMode: TeachingMode.OFFLINE,
      location: 'Chennai',
      availability: ['Wednesday', 'Friday', 'Sunday'],
      hourlyRate: 800,
      bio: 'Making language learning fun and interactive',
      idProofUrl: 'https://example.com/id/priya-patel',
      qualificationCertificatesUrl: ['https://example.com/cert/priya-patel-1'],
    },
    {
      email: 'amit.sharma@example.com',
      name: 'Amit Sharma',
      firstName: 'Amit',
      lastName: 'Sharma',
      contactNumber: '+91-9876543214',
      address: '567 Garden St, Pune',
      gender: GenderType.MALE,
      dateOfBirth: new Date('1989-09-25'),
      subjects: ['Physics', 'Chemistry'],
      customSubjects: ['IIT-JEE Preparation'],
      qualification: 'M.Tech in Applied Physics',
      experience: '6 years',
      teachingMode: TeachingMode.BOTH,
      location: 'Pune',
      availability: ['Monday', 'Thursday', 'Saturday'],
      hourlyRate: 1300,
      bio: 'Specialized in IIT-JEE and competitive exam preparation',
      idProofUrl: 'https://example.com/id/amit-sharma',
      qualificationCertificatesUrl: ['https://example.com/cert/amit-sharma-1'],
    },
  ];

  // Create 5 students
  const students = [
    {
      email: 'rahul.singh@example.com',
      name: 'Rahul Singh',
      contactNumber: '+91-9876543215',
      address: '111 Student Housing, Mumbai',
      fullName: 'Rahul Singh',
      grade: '10th',
      subjects: ['Mathematics', 'Physics'],
      learningMode: TeachingMode.BOTH,
      location: 'Mumbai',
      learningGoals: 'Improve mathematics and physics for board exams',
      parentName: 'Rajesh Singh',
      parentPhone: '+91-9876543216',
    },
    {
      email: 'neha.gupta@example.com',
      name: 'Neha Gupta',
      contactNumber: '+91-9876543217',
      address: '222 College Road, Delhi',
      fullName: 'Neha Gupta',
      grade: '12th',
      subjects: ['Chemistry', 'Biology'],
      learningMode: TeachingMode.ONLINE,
      location: 'Delhi',
      learningGoals: 'Prepare for NEET examination',
      parentName: 'Sanjay Gupta',
      parentPhone: '+91-9876543218',
    },
    {
      email: 'arjun.reddy@example.com',
      name: 'Arjun Reddy',
      contactNumber: '+91-9876543219',
      address: '333 Tech Park, Bangalore',
      fullName: 'Arjun Reddy',
      grade: '11th',
      subjects: ['Computer Science', 'Mathematics'],
      learningMode: TeachingMode.BOTH,
      location: 'Bangalore',
      learningGoals: 'Learn programming and advanced mathematics',
      parentName: 'Krishna Reddy',
      parentPhone: '+91-9876543220',
    },
    {
      email: 'ananya.krishnan@example.com',
      name: 'Ananya Krishnan',
      contactNumber: '+91-9876543221',
      address: '444 Beach Road, Chennai',
      fullName: 'Ananya Krishnan',
      grade: '9th',
      subjects: ['English', 'History'],
      learningMode: TeachingMode.OFFLINE,
      location: 'Chennai',
      learningGoals: 'Improve English communication and writing skills',
      parentName: 'Raman Krishnan',
      parentPhone: '+91-9876543222',
    },
    {
      email: 'rohan.mehta@example.com',
      name: 'Rohan Mehta',
      contactNumber: '+91-9876543223',
      address: '555 College Lane, Pune',
      fullName: 'Rohan Mehta',
      grade: '12th',
      subjects: ['Physics', 'Chemistry'],
      learningMode: TeachingMode.BOTH,
      location: 'Pune',
      learningGoals: 'Prepare for IIT-JEE',
      parentName: 'Suresh Mehta',
      parentPhone: '+91-9876543224',
    },
  ];

  // Create users and profiles for tutors
  for (const tutor of tutors) {
    const user = await prisma.user.create({
      data: {
        email: tutor.email,
        name: tutor.name,
        role: UserRole.TUTOR,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        role: UserRole.TUTOR,
        email: tutor.email,
        contactNumber: tutor.contactNumber,
        address: tutor.address,
        userId: user.id,
      },
    });

    await prisma.tutor.create({
      data: {
        id: profile.id,
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        gender: tutor.gender,
        dateOfBirth: tutor.dateOfBirth,
        subjects: tutor.subjects,
        customSubjects: tutor.customSubjects,
        qualification: tutor.qualification,
        experience: tutor.experience,
        teachingMode: tutor.teachingMode,
        location: tutor.location,
        availability: tutor.availability,
        hourlyRate: tutor.hourlyRate,
        bio: tutor.bio,
        idProofUrl: tutor.idProofUrl,
        qualificationCertificatesUrl: tutor.qualificationCertificatesUrl,
      },
    });
  }

  // Create users and profiles for students
  for (const student of students) {
    const user = await prisma.user.create({
      data: {
        email: student.email,
        name: student.name,
        role: UserRole.STUDENT,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        role: UserRole.STUDENT,
        email: student.email,
        contactNumber: student.contactNumber,
        address: student.address,
        userId: user.id,
      },
    });

    await prisma.student.create({
      data: {
        id: profile.id,
        fullName: student.fullName,
        grade: student.grade,
        subjects: student.subjects,
        learningMode: student.learningMode,
        location: student.location,
        learningGoals: student.learningGoals,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
