"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface CategoryCardProps {
  title: string
  description: string
  icon: string
  items: { name: string; description?: string }[]
}

function CategoryCard({ title, description, icon, items }: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
          <span className="text-3xl">{icon}</span>
        </div>
        <p className="mb-6 text-slate-600">{description}</p>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="group/item cursor-pointer rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 transition-colors group-hover/item:text-blue-600">
                    {typeof item === 'string' ? item : item.name}
                  </h4>
                  {typeof item !== 'string' && (
                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  )}
                </div>
                <div className="rounded-full bg-blue-50 p-2 text-blue-600">→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SubjectGrid() {
  const categories = [
    {
      title: "Classes",
      description: "Find the perfect learning path for your grade level",
      icon: "🎓",
      items: [
        { name: "Nur - KG", description: "Early childhood education" },
        { name: "1st - 3rd", description: "Foundation years" },
        { name: "4th - 5th", description: "Primary education" },
        { name: "6th - 8th", description: "Middle school" },
        { name: "9th - 10th", description: "Secondary education" }
      ]
    },
    {
      title: "Subjects",
      description: "Master core academic subjects with expert guidance",
      icon: "📚",
      items: [
        { name: "Mathematics", description: "Numbers & Problem Solving" },
        { name: "Science", description: "Discover the natural world" },
        { name: "English", description: "Language & Literature" },
        { name: "Social Studies", description: "Understanding society" },
        { name: "Computer", description: "Digital literacy & coding" }
      ]
    },
    {
      title: "Languages",
      description: "Learn new languages and expand your horizons",
      icon: "🌍",
      items: [
        { name: "English", description: "Global communication" },
        { name: "Spoken English", description: "Fluency & Communication skills" },
        { name: "Punjabi", description: "Cultural heritage" },
        { name: "Hindi", description: "National language" }
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-3 text-2xl font-bold lg:text-3xl">
          <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Explore Our Course Categories
          </span>
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-slate-600">
          Choose from our wide range of subjects and classes tailored to meet your educational needs
        </p>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 lg:w-40"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <CategoryCard {...category} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
