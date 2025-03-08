"use client"


import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import Link from "next/link"
import { GraduationCap, BookOpen, Users, Star, Trophy, Clock, Target, Sparkles } from 'lucide-react'

export function Hero() {
  const [text, setText] = useState('')
  const fullText = "Quality "
  const highlightedText = "Home Tutoring"
  const endText = " at Your Doorstep"
  const [isDeleting, setIsDeleting] = useState(false)
  const completeText = fullText + highlightedText + endText
  
  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting && text === completeText) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
    } else if (isDeleting && text === '') {
      setIsDeleting(false)
    } else {
      timeout = setTimeout(() => {
        setText(isDeleting ? text.slice(0, -1) : completeText.slice(0, text.length + 1))
      }, isDeleting ? 50 : 100)
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, completeText])

  const renderText = () => {
    const index = text.indexOf(highlightedText)
    if (index === -1) return text

    return (
      <>
        {text.slice(0, index)}
        <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">{text.slice(index, index + highlightedText.length)}</span>
        {text.slice(index + highlightedText.length)}
      </>
    )
  }

  const features = [
    { icon: Star, label: "Personalized Learning", color: "from-yellow-400 to-orange-500" },
    { icon: Trophy, label: "Expert Tutors", color: "from-blue-500 to-indigo-600" },
    { icon: Clock, label: "Flexible Timing", color: "from-emerald-500 to-teal-600" },
    { icon: Target, label: "Goal Oriented", color: "from-red-500 to-pink-600" }
  ]

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-[10%] -top-[40%] w-[60%] h-[60%] rounded-full bg-blue-100/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
        </div>
      </div>

      {/* Main content */}
      <div className="container relative mx-auto grid min-h-[90vh] grid-cols-1 gap-4 px-4 py-6 md:grid-cols-2 md:gap-8 md:px-6 md:py-8">
        {/* Left Column - Content */}
        <div className="animate-fade-in-up flex flex-col justify-center space-y-4 pl-2 sm:pl-6 md:space-y-6 md:pl-8 lg:space-y-8">
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            <div className="relative">
              <div className="absolute -left-4 -top-2 size-4 animate-bounce sm:-left-8 sm:-top-4 sm:size-8">
                <Sparkles className="size-full text-yellow-400" />
              </div>
              <div className="min-h-[60px] sm:min-h-[100px] md:min-h-[120px]"> 
                <h1 className="text-lg font-bold tracking-tight text-slate-800 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  {renderText()}<span className="animate-blink">|</span>
                </h1>
              </div>
            </div>
            <div className="space-y-2 md:space-y-4"> 
              <p className="text-sm text-slate-600 sm:text-lg md:text-xl relative max-w-xl">
                Expert home tutors and specialized group classes to help your child excel in academics
                <span className="absolute -right-2 top-0 text-base animate-pulse sm:text-xl">✨</span>
              </p>
              <div className="relative max-w-lg space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 animate-bounce sm:text-base md:text-lg">Tutor</span>
                  <div className="h-3 w-0.5 bg-gradient-to-b from-blue-600 to-emerald-600 animate-pulse sm:h-4"></div>
                  <span className="text-xs font-bold text-emerald-600 animate-bounce delay-100 sm:text-base md:text-lg">Riders</span>
                </div>
                <p className="relative text-[10px] text-slate-600 pl-1 sm:text-sm">
                  Your journey to academic excellence
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-blue-600/20 to-emerald-600/20 animate-pulse"></span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={feature.label} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-emerald-100/50 rounded-lg blur-sm transition-all duration-300 group-hover:scale-105" />
                <div className="relative flex flex-col items-center p-2 sm:p-3 md:p-4 bg-white/80 rounded-lg border border-white/50 backdrop-blur-sm transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className={`size-6 sm:size-8 md:size-10 rounded-lg bg-gradient-to-br ${feature.color} p-1 sm:p-1.5 md:p-2 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="size-full" />
                  </div>
                  <p className="mt-1 sm:mt-2 text-[8px] sm:text-xs md:text-sm font-medium text-slate-700 text-center line-clamp-2">{feature.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6">
            <Card className="flex-1 min-w-[140px] sm:min-w-[200px] md:min-w-[220px] group relative rounded-lg border border-white/20 bg-white/90 p-2 sm:p-4 md:p-5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-start gap-2 sm:gap-4">
                <div className="relative shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 p-2 sm:p-3">
                  <Users className="size-4 sm:size-6 text-blue-600 transition-colors duration-300 group-hover:text-emerald-600" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/10 to-emerald-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600 transition-colors duration-300 group-hover:text-emerald-600">250</p>
                    <p className="text-xs sm:text-base font-semibold text-slate-800">+</p>
                  </div>
                  <p className="text-xs sm:text-base text-slate-600">Expert Tutors</p>
                </div>
              </div>
            </Card>

            <Card className="flex-1 min-w-[140px] sm:min-w-[200px] md:min-w-[220px] group relative rounded-lg border border-white/20 bg-white/90 p-2 sm:p-4 md:p-5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-start gap-2 sm:gap-4">
                <div className="relative shrink-0 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 p-2 sm:p-3">
                  <BookOpen className="size-4 sm:size-6 text-emerald-600 transition-colors duration-300 group-hover:text-blue-600" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600/10 to-blue-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-600 transition-colors duration-300 group-hover:text-blue-600">10K</p>
                    <p className="text-xs sm:text-base font-semibold text-slate-800">+</p>
                  </div>
                  <p className="text-xs sm:text-base text-slate-600">Teaching Hours</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column - Illustration */}
        <div className="relative flex items-center justify-center mt-4 md:mt-0">
          <div className="relative z-0">
            <div className="relative h-[200px] w-full sm:h-[300px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
              {/* Main Illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full">
                  {/* Teacher */}
                  <div className="absolute left-[10%] top-[30%] flex flex-col items-center scale-75 sm:scale-100">
                    <div className="group relative">
                      <div className="absolute -inset-0.5 animate-tilt rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 opacity-30 blur transition duration-1000 group-hover:opacity-70 group-hover:duration-200"></div>
                      <div className="relative rounded-full bg-white p-3 sm:p-4 md:p-8 shadow-2xl">
                        <Users className="size-6 sm:size-8 md:size-16 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-4 animate-float">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 opacity-30 blur"></div>
                        <div className="relative rounded-lg bg-white px-2 py-1 sm:px-6 sm:py-2">
                          <p className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-xs sm:text-base font-semibold text-transparent">Expert Tutor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Student */}
                  <div className="absolute right-[10%] top-[50%] flex flex-col items-center scale-75 sm:scale-100">
                    <div className="group relative">
                      <div className="absolute -inset-0.5 animate-tilt rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 opacity-30 blur transition duration-1000 group-hover:opacity-70 group-hover:duration-200"></div>
                      <div className="relative rounded-full bg-white p-3 sm:p-4 md:p-8 shadow-2xl">
                        <GraduationCap className="size-6 sm:size-8 md:size-16 text-emerald-600" />
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-4 animate-float">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 opacity-30 blur"></div>
                        <div className="relative rounded-lg bg-white px-2 py-1 sm:px-6 sm:py-2">
                          <p className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-xs sm:text-base font-semibold text-transparent">Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection Line with Animated Gradient */}
                  <div className="absolute left-1/2 top-1/2 h-0.5 w-1/3 -translate-x-1/2 -translate-y-1/2 transform">
                    <div className="h-full w-full animate-gradient-x rounded-full bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600 bg-[length:200%_100%]"></div>
                    <div className="absolute -left-1 -top-1 size-1.5 sm:size-2 animate-ping rounded-full bg-blue-600"></div>
                    <div className="absolute -right-1 -top-1 size-1.5 sm:size-2 animate-ping rounded-full bg-emerald-600"></div>
                  </div>

                  {/* Small Decorative Elements */}
                  <div className="absolute left-[40%] top-[20%] animate-bounce">
                    <Star className="size-3 sm:size-4 md:size-6 text-yellow-400" />
                  </div>
                  <div className="absolute right-[30%] bottom-[20%] animate-bounce delay-100">
                    <Star className="size-3 sm:size-4 md:size-6 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Cards */}
          <Card className="group absolute top-[5%] -right-2 z-20 w-auto min-w-[120px] max-w-[180px] sm:min-w-44 sm:max-w-60 rounded-lg border border-white/20 bg-white/95 p-2 sm:p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 p-1.5 sm:p-2">
                  <Target className="size-3 sm:size-4 md:size-5 text-blue-600" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/10 to-emerald-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-600">Shape Your Child&apos;s Future Today</p>
              </div>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-emerald-700 text-xs sm:text-sm group-hover:animate-pulse"
                onClick={() => window.location.href = '/contact'}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <span>Contact Us</span>
                  <span>📧</span>
                </div>
              </Button>
            </div>
          </Card>

          <Card className="group absolute bottom-[5%] left-[12%] z-20 w-auto min-w-[120px] max-w-[180px] sm:min-w-44 sm:max-w-60 rounded-lg border border-white/20 bg-white/95 p-2 sm:p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative shrink-0 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 p-1.5 sm:p-2">
                <div className="relative size-3 sm:size-4 md:size-5">
                  <div className="absolute inset-0 animate-spin">
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-600" style={{ transform: 'translate(10%, 10%)' }} />
                  </div>
                  <svg className="size-full text-emerald-600 transition-colors duration-300 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600/10 to-blue-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="truncate text-xs sm:text-sm font-semibold text-slate-800 transition-colors group-hover:text-emerald-600">Congratulations!</p>
                  <span className="animate-bounce text-xs sm:text-sm">🎉</span>
                </div>
                <p className="mt-0.5 truncate text-[10px] sm:text-xs text-slate-600">Your admission completed</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Curved border overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <svg className="w-full text-white" style={{ height: '150px' }} viewBox="0 0 1440 150" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,96L1440,32L1440,150L0,150Z" fillOpacity="1"></path>
        </svg>
      </div>
    </div>
  )
}