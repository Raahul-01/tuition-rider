"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const testimonials = [
  {
    id: 1,
    studentName: "Agamjot",
    grade: "5th",
    board: "ICSE",
    image: "/images/students/student1.jpg",
    beforeTuition: [
      "Struggled with studies, especially Mathematics",
      "Scored low overall percentage (10th position)",
      "Lacked confidence in solving complex problems"
    ],
    afterTuition: [
      "Improved significantly in all subjects",
      "Excelled in Mathematics with better understanding",
      "Achieved 1st position in class"
    ],
    parentTestimonial: "Tuition Rider truly makes a difference in your child's success. We have seen the results firsthand! Don't let your child struggle—give them the best guidance!",
    studentTestimonial: "I'm now confident in Mathematics and aiming for 1st position again!"
  },
  {
    id: 2,
    studentName: "Anaya",
    grade: "2nd",
    board: "CBSE",
    image: "/images/students/student2.jpg",
    beforeTuition: [
      "Struggled with pronunciation and reading",
      "Difficulty adjusting to Indian education system",
      "Challenges with entrance exam preparation"
    ],
    afterTuition: [
      "Reads fluently and speaks with confidence",
      "Adapted to Indian education system smoothly",
      "Passed entrance exam with flying colors"
    ],
    parentTestimonial: "Tuition Rider changed everything for Anaya. Their tutor gave her the right support, and now she has adapted beautifully to her new school in India!",
    studentTestimonial: "Learning is fun now, and I love going to school!"
  },
  {
    id: 3,
    studentName: "Rashmiranjhan",
    grade: "10th",
    board: "CBSE",
    image: "/images/students/student3.jpg",
    beforeTuition: [
      "Struggled with Math, Science, SST, and English",
      "No structured study plan",
      "Scored only 60% in Class 9"
    ],
    afterTuition: [
      "Clear concepts in all subjects",
      "Well-structured study plan with revisions",
      "Aiming for 80%+ in boards"
    ],
    parentTestimonial: "Tuition Rider took full responsibility for Rashmiranjhan's success. Their one-on-one tutoring and personalized approach made a huge difference!",
    studentTestimonial: "I feel fully prepared for board exams now!"
  },
  {
    id: 4,
    studentName: "Prabh Sachar",
    parentName: "Mrs. Charanjeet",
    grade: "9th",
    board: "CBSE",
    image: "/images/students/student4.jpg",
    beforeTuition: [
      "Struggled with unclear concepts",
      "Scored only 50% in Class 8",
      "Maths and Science were the hardest"
    ],
    afterTuition: [
      "Expert subject-wise tutoring",
      "Structured learning & personalized support",
      "Now confident & aiming for 80+"
    ],
    parentTestimonial: "Tuition Rider doesn't just provide tutors; they take full responsibility for my child's success. Their expert teachers, regular assessments, and 24/7 support made a huge difference!",
    studentTestimonial: "Now, I have a proper study plan and confidence for my exams. Tuition Rider changed my learning experience completely!"
  }
]

export function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000) // Change testimonial every 5 seconds
    }
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 -translate-x-1/2 animate-blob rounded-full bg-blue-100/30 blur-3xl filter">
          <div className="aspect-square w-[30rem]" />
        </div>
        <div className="absolute right-0 top-1/2 translate-x-1/2 animate-blob animation-delay-2000 rounded-full bg-emerald-100/30 blur-3xl filter">
          <div className="aspect-square w-[30rem]" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-blob animation-delay-4000 rounded-full bg-blue-100/30 blur-3xl filter">
          <div className="aspect-square w-[30rem]" />
        </div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
              Success <span className="relative bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Stories
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-600"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>
              </h2>
            <p className="mb-8 text-lg text-slate-600">
              See how Tuition Rider transforms academic journeys
            </p>
          </motion.div>

          {/* Stats Section with hover effects */}
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "400+", label: "Students", color: "from-blue-600 to-blue-400" },
              { value: "95%", label: "Success Rate", color: "from-emerald-600 to-emerald-400" },
              { value: "250+", label: "Tutors", color: "from-blue-500 to-emerald-500" },
              { value: "4.9/5", label: "Rating", color: "from-emerald-500 to-blue-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="group relative overflow-hidden border border-white/50 bg-white/80 p-3 backdrop-blur-lg transition-all hover:scale-105 hover:shadow-lg">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <p className={`bg-gradient-to-r ${stat.color} bg-clip-text text-xl font-bold text-transparent`}>{stat.value}</p>
                  <p className="text-xs text-slate-600">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonial Cards with enhanced animations */}
        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="group relative overflow-hidden border border-white/50 bg-white/80 shadow-lg backdrop-blur-lg transition-all duration-500 hover:shadow-xl">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100/10 to-emerald-100/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="grid md:grid-cols-2">
                  {/* Image Section with creative elements */}
                  <div className="relative min-h-[200px] overflow-hidden bg-gradient-to-br from-blue-100 to-emerald-100 md:min-h-[400px]">
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20" />
                      <div className="absolute inset-0 bg-grid-white/10" />
                    </div>
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="group relative">
                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 opacity-30 blur transition duration-1000 group-hover:opacity-70" />
                        <div className="relative size-32 overflow-hidden rounded-full border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105 md:size-48">
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
                            <svg className="size-16 text-blue-600/50 transition-transform duration-300 group-hover:scale-110 md:size-20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {/* Decorative elements */}
                    <div className="absolute left-0 top-0 size-32 animate-pulse rounded-full bg-blue-400/20 blur-2xl" />
                    <div className="absolute bottom-0 right-0 size-32 animate-pulse rounded-full bg-emerald-400/20 blur-2xl" />
                  </div>

                  {/* Content Section with enhanced typography */}
                  <div className="relative p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{testimonials[activeIndex].studentName}</h3>
                        <p className="text-sm text-slate-600">
                          {testimonials[activeIndex].grade} Grade • {testimonials[activeIndex].board}
                        </p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="size-4 fill-current" />
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="mb-2 text-sm font-semibold text-red-600">Before:</h4>
                        <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                          {testimonials[activeIndex].beforeTuition.map((point, i) => (
                            <li key={i} className="transition-all hover:text-slate-900">{point}</li>
                          ))}
                        </ul>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="mb-2 text-sm font-semibold text-emerald-600">After:</h4>
                        <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                          {testimonials[activeIndex].afterTuition.map((point, i) => (
                            <li key={i} className="transition-all hover:text-slate-900">{point}</li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Card className="group border-white/50 bg-gradient-to-br from-blue-50 to-emerald-50 p-3 transition-all duration-300 hover:scale-[1.02]">
                          <div className="mb-1 flex items-center gap-2">
                            <Quote className="size-4 text-blue-600" />
                            <p className="text-xs font-semibold text-slate-900">Parent&apos;s Feedback</p>
                          </div>
                          <p className="text-xs italic text-slate-600 transition-colors duration-300 group-hover:text-slate-900">
                            {testimonials[activeIndex].parentTestimonial}
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-900">- {testimonials[activeIndex].parentName}</p>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Card className="group border-white/50 bg-gradient-to-br from-emerald-50 to-blue-50 p-3 transition-all duration-300 hover:scale-[1.02]">
                          <div className="mb-1 flex items-center gap-2">
                            <Quote className="size-4 text-emerald-600" />
                            <p className="text-xs font-semibold text-slate-900">Student&apos;s Voice</p>
                          </div>
                          <p className="text-xs italic text-slate-600 transition-colors duration-300 group-hover:text-slate-900">
                            {testimonials[activeIndex].studentTestimonial}
                          </p>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Progress bar */}
              <div className="relative mt-4">
                <div className="absolute inset-0 h-1 rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                </div>
            </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                  onClick={prevTestimonial}
                  className="group size-8 rounded-full border-white/50 bg-white/80 backdrop-blur-lg transition-all hover:scale-110"
              >
                  <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                  onClick={nextTestimonial}
                  className="group size-8 rounded-full border-white/50 bg-white/80 backdrop-blur-lg transition-all hover:scale-110"
              >
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </motion.div>
              </AnimatePresence>
            </div>

        <div className="mt-8 text-center">
          <Link href="/contact">
            <Button size="sm" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-emerald-600 text-white transition-all hover:scale-105">
              <span className="relative z-10">Book a Demo Class</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <ArrowRight className="relative z-10 ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-white\/10 {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
