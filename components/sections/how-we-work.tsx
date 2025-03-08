"use client"

import { motion } from "framer-motion"
import { 
  ClipboardList, 
  UserCheck, 
  Sparkles, 
  GraduationCap, 
  ScrollText, 
  BellRing, 
  HandshakeIcon, 
  Trophy,
  ArrowRight
} from "lucide-react"

const studentSteps = [
  {
    title: "Post Free Requirements",
    description: "Post your learning requirement for free and get the best Home Tutors and Online Tutors near you.",
    icon: ScrollText
  },
  {
    title: "Instant Response",
    description: "As per your learning needs, get an instant response from experienced tutors and teachers near you.",
    icon: BellRing
  },
  {
    title: "Compare, Hire & Learn",
    description: "Take a free demo from our Home Tutors and Online Tutors. Compare amongst them and hire the best.",
    icon: HandshakeIcon
  },
  {
    title: "Free Online Learning Platform",
    description: "Start class with Perfect Tutor and get Free Online Learning Platform for your productive learning.",
    icon: Sparkles
  }
]

const teacherSteps = [
  {
    title: "Register as Tutor",
    description: "Create your profile for free and showcase your teaching expertise and experience.",
    icon: ClipboardList
  },
  {
    title: "Get Student Leads",
    description: "Receive instant notifications for student requirements matching your expertise.",
    icon: UserCheck
  },
  {
    title: "Connect & Demonstrate",
    description: "Connect with students, give demo classes and start your teaching journey.",
    icon: GraduationCap
  },
  {
    title: "Teach & Earn",
    description: "Use our platform to manage classes and receive timely payments.",
    icon: Trophy
  }
]

function ProcessStep({ step, index, isRight = false }: { step: typeof studentSteps[0], index: number, isRight?: boolean }) {
  const Icon = step.icon
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: isRight ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex items-center gap-8 ${isRight ? 'flex-row-reverse' : ''}`}
    >
      {/* Connection line */}
      <div className="absolute left-1/2 top-1/2 -z-10 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-blue-100 to-emerald-100 md:block"></div>
      
      {/* Icon */}
      <div className="flex flex-1 justify-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="group relative flex size-28 items-center justify-center rounded-2xl border border-white/50 bg-gradient-to-br from-blue-50 to-emerald-50 shadow-lg backdrop-blur-sm"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <Icon className="size-12 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -left-3 -top-3 flex size-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
            {index + 1}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-2xl font-semibold text-transparent"
        >
          {step.title}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="text-lg text-slate-600"
        >
          {step.description}
        </motion.p>
      </div>
    </motion.div>
  )
}

export function HowWeWork() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-24">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -right-4 -top-4 size-96 rounded-full bg-blue-100/30 opacity-70 mix-blend-multiply blur-3xl"></div>
        <div className="animate-blob animation-delay-2000 absolute -bottom-8 -left-4 size-96 rounded-full bg-emerald-100/30 opacity-70 mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-gradient-to-r from-blue-50 to-emerald-50 px-6 py-2 text-sm font-semibold text-blue-600 shadow-md backdrop-blur-sm"
          >
            <Sparkles className="size-4" />
            Our Process
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold text-slate-800 md:text-5xl lg:text-6xl"
          >
            How We Work
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl"
          >
            Simple and effective way to connect tutors with students
          </motion.p>
        </div>

        {/* For Students */}
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h3 className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-3 text-xl font-semibold text-white shadow-lg">
              <UserCheck className="size-5" />
              FOR STUDENTS
              <ArrowRight className="size-5" />
            </h3>
          </motion.div>
          
          <div className="space-y-24">
            {studentSteps.map((step, index) => (
              <ProcessStep 
                key={step.title} 
                step={step} 
                index={index}
                isRight={index % 2 === 1}
              />
            ))}
          </div>
        </div>

        {/* For Teachers */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h3 className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-3 text-xl font-semibold text-white shadow-lg">
              <GraduationCap className="size-5" />
              FOR TEACHERS
              <ArrowRight className="size-5" />
            </h3>
          </motion.div>
          
          <div className="space-y-24">
            {teacherSteps.map((step, index) => (
              <ProcessStep 
                key={step.title} 
                step={step} 
                index={index}
                isRight={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
