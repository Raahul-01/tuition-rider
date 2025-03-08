'use client'

import { Metadata } from "next"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calculator, TestTube, BookOpen, Globe, Sparkles, Brain, Lightbulb, FileText, Download, AlertCircle, Loader2 } from "lucide-react"
import { Logo } from "@/components/shared/logo"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const subjects = [
  {
    name: "Mathematics",
    description: "Access comprehensive mathematics study materials, formulas, and practice questions",
    href: "/resources/download?subject=mathematics",
    icon: Calculator,
    color: "from-blue-500 to-blue-600",
    bgLight: "from-blue-50 to-blue-100",
    accent: "blue"
  },
  {
    name: "Science",
    description: "Explore physics, chemistry, and biology materials with detailed explanations",
    href: "/resources/download?subject=science",
    icon: TestTube,
    color: "from-emerald-500 to-emerald-600",
    bgLight: "from-emerald-50 to-emerald-100",
    accent: "emerald"
  },
  {
    name: "English",
    description: "Improve your language skills with grammar guides and literature materials",
    href: "/resources/download?subject=english",
    icon: BookOpen,
    color: "from-purple-500 to-purple-600",
    bgLight: "from-purple-50 to-purple-100",
    accent: "purple"
  },
  {
    name: "Social Studies",
    description: "Learn history, geography, and civics with our curated study materials",
    href: "/resources/download?subject=social-studies",
    icon: Globe,
    color: "from-orange-500 to-orange-600",
    bgLight: "from-orange-50 to-orange-100",
    accent: "orange"
  },
  {
    name: "Hindi",
    description: "Master Hindi language and literature with comprehensive study materials",
    href: "/resources/download?subject=hindi",
    icon: BookOpen,
    color: "from-red-500 to-red-600",
    bgLight: "from-red-50 to-red-100",
    accent: "red"
  },
  {
    name: "Environmental Studies",
    description: "Learn about environment and its impact with interactive materials",
    href: "/resources/download?subject=environmental-studies",
    icon: TestTube,
    color: "from-green-500 to-green-600",
    bgLight: "from-green-50 to-green-100",
    accent: "green"
  },
  {
    name: "Computer Science",
    description: "Explore programming and computer concepts with practical examples",
    href: "/resources/download?subject=computer-science",
    icon: Brain,
    color: "from-indigo-500 to-indigo-600",
    bgLight: "from-indigo-50 to-indigo-100",
    accent: "indigo"
  },
  {
    name: "General Knowledge",
    description: "Stay updated with current affairs and general awareness materials",
    href: "/resources/download?subject=general-knowledge",
    icon: Lightbulb,
    color: "from-yellow-500 to-yellow-600",
    bgLight: "from-yellow-50 to-yellow-100",
    accent: "yellow"
  },
  {
    name: "Art & Craft",
    description: "Develop creativity with art tutorials and craft projects",
    href: "/resources/download?subject=art-craft",
    icon: Logo,
    color: "from-pink-500 to-pink-600",
    bgLight: "from-pink-50 to-pink-100",
    accent: "pink"
  },
  {
    name: "Physical Education",
    description: "Learn about sports, fitness, and physical well-being",
    href: "/resources/download?subject=physical-education",
    icon: Logo,
    color: "from-cyan-500 to-cyan-600",
    bgLight: "from-cyan-50 to-cyan-100",
    accent: "cyan"
  }
]

const resourceTypes = [
  {
    name: "Study Notes",
    description: "Detailed notes covering all topics in the curriculum",
    href: "/resources/download?type=notes",
    icon: Brain,
    color: "from-blue-500 to-emerald-500"
  },
  {
    name: "Previous Year Questions",
    description: "Practice with past exam questions and solutions",
    href: "/resources/download?type=previous-year-questions",
    icon: Lightbulb,
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Study Materials",
    description: "Additional learning materials and resources",
    href: "/resources/download?type=study-materials",
    icon: FileText,
    color: "from-orange-500 to-red-500"
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

export default function ResourcesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-20 md:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-[10%] -top-[40%] w-[60%] h-[60%] rounded-full bg-blue-100/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/20 blur-3xl animate-pulse" />
        </div>
        
        <MaxWidthWrapper>
          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute -left-8 -top-8 animate-bounce">
                  <Logo className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="absolute -right-8 -top-8 animate-bounce delay-100">
                  <Logo className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-slate-900 mb-6 md:text-5xl lg:text-6xl"
            >
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Learning Resources
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-slate-600 mb-8 md:text-xl"
            >
              Access high-quality study materials, notes, and practice questions across all subjects. Enhance your learning journey with our comprehensive resources.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/resources/download">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white w-full sm:w-auto"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Browse All Resources
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Request Materials
                </Button>
              </Link>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">Loading resources...</span>
          </div>
        </div>
      )}

      {/* Subjects Grid */}
      <section className="py-20">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Browse by Subject
            </h2>
            <p className="text-lg text-slate-600">
              Find resources tailored to your subject of interest
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <motion.div
                  key={subject.name}
                  variants={itemVariants}
                >
                  <Link href={subject.href}>
                    <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-lg">
                      <div className={`absolute inset-0 bg-gradient-to-r ${subject.bgLight} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className="relative flex gap-4">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${subject.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            {subject.name}
                          </h3>
                          <p className="text-slate-600">
                            {subject.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </MaxWidthWrapper>
      </section>

      {/* Resource Types */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Browse by Type
            </h2>
            <p className="text-lg text-slate-600">
              Explore different types of learning materials
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {resourceTypes.map((type) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.name}
                  variants={itemVariants}
                >
                  <Link href={type.href}>
                    <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="mb-4">
                          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${type.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          {type.name}
                        </h3>
                        <p className="text-slate-600">
                          {type.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </MaxWidthWrapper>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 p-8 text-center text-white md:p-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Access our comprehensive collection of learning resources and take your education to the next level.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/resources/download">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Browse Resources
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </section>
    </div>
  )
} 