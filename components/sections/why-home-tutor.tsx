"use client"

import { BookOpen, Clock, Target, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export function WhyHomeTutor() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-bold text-slate-800"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Home Tutoring?
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-slate-600"
          >
            Personalized learning experience tailored to your child&apos;s unique needs and learning style
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* First Row */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="group rounded-xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 transition-transform duration-300 group-hover:scale-110">
              <UserCheck className="size-6 text-blue-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">Personalized Attention</h3>
            <p className="text-slate-600">
              One-on-one focused learning environment where your child receives undivided attention and customized teaching methods.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group rounded-xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 transition-transform duration-300 group-hover:scale-110">
              <Clock className="size-6 text-emerald-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-emerald-600">Flexible Timing</h3>
            <p className="text-slate-600">
              Schedule lessons at your convenience, making it easier to balance academics with other activities.
            </p>
          </motion.div>

          {/* Second Row */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group rounded-xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-50 transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="size-6 text-blue-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">Better Understanding</h3>
            <p className="text-slate-600">
              Focused approach helps in developing a deeper understanding of subjects and building strong foundations.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group rounded-xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-blue-50 transition-transform duration-300 group-hover:scale-110">
              <Target className="size-6 text-emerald-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-emerald-600">Tracked Progress</h3>
            <p className="text-slate-600">
              Regular assessment and feedback to monitor your child&apos;s improvement and adjust teaching strategies accordingly.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
