"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, School, Calculator, Languages, FlaskConical, Globe2, Code2, BookText, Atom } from "lucide-react"
import { Logo } from "@/components/shared/logo"

const subjects = [
  { name: "Mathematics", icon: Calculator, color: "from-blue-600 to-emerald-400" },
  { name: "English", icon: Languages, color: "from-emerald-600 to-blue-400" },
  { name: "Science", icon: FlaskConical, color: "from-blue-500 to-emerald-500" },
  { name: "Social Studies", icon: Globe2, color: "from-emerald-500 to-blue-500" },
  { name: "Computer Science", icon: Code2, color: "from-blue-600 to-emerald-600" },
  { name: "Literature", icon: BookText, color: "from-emerald-600 to-blue-600" },
  { name: "Physics", icon: Atom, color: "from-blue-500 to-emerald-400" },
]

const classes = [
  { id: "L", name: "LKG", color: "from-blue-500 to-emerald-400", href: "#" },
  { id: "U", name: "UKG", color: "from-emerald-500 to-blue-400", href: "#" },
  { id: "I", name: "Class I", color: "from-blue-600 to-emerald-500", href: "#" },
  { id: "II", name: "Class II", color: "from-emerald-600 to-blue-500", href: "#" },
  { id: "III", name: "Class III", color: "from-blue-500 to-emerald-400", href: "#" },
  { id: "IV", name: "Class IV", color: "from-emerald-500 to-blue-400", href: "#" },
  { id: "V", name: "Class V", color: "from-blue-600 to-emerald-500", href: "#" },
  { id: "VI", name: "Class VI", color: "from-emerald-600 to-blue-500", href: "#" },
  { id: "VII", name: "Class VII", color: "from-blue-500 to-emerald-400", href: "#" },
  { id: "VIII", name: "Class VIII", color: "from-emerald-500 to-blue-400", href: "#" },
  { id: "IX", name: "Class IX", color: "from-blue-600 to-emerald-500", href: "#" },
  { id: "X", name: "Class X", color: "from-emerald-600 to-blue-500", href: "#" },
  { id: "XI", name: "Class XI", color: "from-blue-500 to-emerald-400", href: "#" },
  { id: "XII", name: "Class XII", color: "from-emerald-500 to-blue-400", href: "#" },
]

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Syllabus",
    description: "Covering all major boards and competitive exams"
  },
  {
    icon: Logo,
    title: "Expert Teachers",
    description: "Learn from experienced educators"
  },
  {
    icon: School,
    title: "Structured Learning",
    description: "Well-planned curriculum for each class"
  }
]

export function CurriculumGrid() {
  return (
    <section className="relative py-24">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-emerald-50/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-100 to-emerald-100 px-4 py-1.5 text-sm font-semibold text-blue-600">
              Classes LKG to XII
            </span>
          </motion.div>
          <h2 className="mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent">
            Comprehensive Curriculum
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-600">
            Choose your class to explore our comprehensive curriculum designed for academic excellence
          </p>

          {/* Popular Subjects */}
          <div className="mx-auto mb-16 max-w-5xl">
            <h3 className="mb-6 text-xl font-semibold text-slate-800">Popular Subjects</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                >
                  <div className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                    <div className={`mb-3 size-12 rounded-xl bg-gradient-to-br ${subject.color} p-2.5 transition-transform duration-300 group-hover:scale-110`}>
                      <subject.icon className="size-full text-white" />
                    </div>
                    <span className="text-center text-sm font-medium text-slate-700 transition-colors duration-300 group-hover:text-blue-600">
                      {subject.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Features */}
          <div className="mx-auto mb-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col items-center rounded-2xl border border-white/50 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4 size-10 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-600">
                  <feature.icon className="size-full" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">{feature.title}</h3>
                <p className="text-center text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem, index) => (
            <Link
              key={classItem.id}
              href={classItem.href}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="h-full"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${classItem.color} opacity-10 transition-opacity group-hover:opacity-15`} />
                  <div className="relative flex items-center p-6">
                    <div className={`flex size-16 items-center justify-center rounded-xl bg-gradient-to-br ${classItem.color} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                      <span className="text-xl font-bold text-white">{classItem.id}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
                        {classItem.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 transition-colors group-hover:text-emerald-600">Explore curriculum →</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
