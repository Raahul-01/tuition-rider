/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { Users, GraduationCap, ArrowRight, MessageCircle, Sparkles, Star, Target, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formDataToObject = (formData: FormData) => {
    const object: Record<string, any> = {}
    formData.forEach((value, key) => {
      object[key] = value
    })
    return object
  }

  const handleParentSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      const formObject = formDataToObject(formData)
      const response = await fetch('/api/contact/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Thank you for your interest! We will contact you soon.')
      } else {
        throw new Error(data.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to submit form. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTutorSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      const formObject = formDataToObject(formData)
      const response = await fetch('/api/contact/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Thank you for applying! We will review your application soon.')
      } else {
        throw new Error(data.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to submit form. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    { 
      icon: BookOpen, 
      title: "Expert Tutoring",
      description: "Learn from qualified and experienced teachers",
      gradient: "from-blue-600 to-indigo-600"
    },
    { 
      icon: Target, 
      title: "Personalized Plans",
      description: "Customized learning paths for every student",
      gradient: "from-emerald-600 to-teal-600"
    },
    { 
      icon: Trophy, 
      title: "Proven Results",
      description: "Track record of academic excellence",
      gradient: "from-orange-600 to-red-600"
    }
  ]

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-[10%] -top-[40%] w-[60%] h-[60%] rounded-full bg-blue-100/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
        </div>
        {/* Floating Elements */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Star className="h-3 w-3 text-yellow-400 opacity-50" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-12 text-center"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
                <div className="absolute top-0 left-0 h-full w-full bg-yellow-400/20 blur-xl animate-pulse" />
              </div>
            </div>
            <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl">
              Begin Your Learning Journey
            </h2>
            <p className="text-lg text-slate-600 md:text-xl">
              Transform your educational experience with personalized guidance
            </p>
          </motion.div>

          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 rounded-xl blur transition-all duration-300 group-hover:blur-xl" />
              <Link href="/contact?type=parent" className="block relative">
                <div className="rounded-xl border border-white/50 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="mb-4 inline-block rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 p-3 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900">For Parents</h3>
                  <p className="mb-4 text-slate-600">Find the perfect tutor for your child&apos;s academic success</p>
                  <div className="flex items-center text-blue-600 group-hover:text-emerald-600 transition-colors">
                    <span className="mr-2 font-medium">Get Started</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 rounded-xl blur transition-all duration-300 group-hover:blur-xl" />
              <Link href="/contact?type=tutor" className="block relative">
                <div className="rounded-xl border border-white/50 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="mb-4 inline-block rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 p-3 text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900">For Tutors</h3>
                  <p className="mb-4 text-slate-600">Join our community of educators and inspire the next generation</p>
                  <div className="flex items-center text-emerald-600 group-hover:text-blue-600 transition-colors">
                    <span className="mr-2 font-medium">Apply Now</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 rounded-lg blur-xl transition-opacity duration-300 group-hover:opacity-10`} />
                <div className="relative rounded-lg border border-white/50 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg">
                  <feature.icon className={`mb-4 h-6 w-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                  <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Curved border overlay */}
      <div className="absolute inset-x-0 bottom-0">
        <svg className="w-full text-white" style={{ height: '120px' }} viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  )
}
