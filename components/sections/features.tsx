"use client"

import { motion } from "framer-motion"
import { Book, Users, Brain, Heart, BarChart } from 'lucide-react'
import { Logo } from "@/components/shared/logo"

const features = [
  {
    icon: Book,
    title: "K-12 & All Subjects",
    description: "All academic subjects"
  },
  {
    icon: Users,
    title: "1-1 and Group Tutoring",
    description: "Personalized attention"
  },
  {
    icon: Brain,
    title: "Researched-Based Approach",
    description: "Proven methods"
  },
  {
    icon: Logo,
    title: "Standard-Aligned",
    description: "Board-aligned curriculum"
  },
  {
    icon: Heart,
    title: "Social Learning",
    description: "Holistic development"
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description: "Regular assessments"
  }
]

export function Features() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl"
          >
            Scalable Solutions for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Unfinished Learning
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-3xl text-sm text-slate-600 md:text-base"
          >
            Tuition Rider provides schools with quality educators, comprehensive resources, including detailed reporting, instructional tools, and top-quality materials. Our seamless setup process and dedicated support ensure that Tuition Rider empowers every classroom effectively.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col items-center rounded-xl border border-white/50 bg-white/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-3 flex size-12 items-center justify-center rounded-lg border border-white/50 bg-gradient-to-br from-blue-50 to-emerald-50 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-6 text-blue-600 transition-colors duration-300 group-hover:text-emerald-600" />
                </div>
                <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">{feature.title}</h3>
                <p className="line-clamp-2 text-xs text-slate-500">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
