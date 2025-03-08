"use client"

import { useState, useEffect } from "react"
import { X, Users, TrendingUp, Shield, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/components/shared/logo"

export function MarketingPopup() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const timer = setTimeout(() => {
      const dismissed = window?.localStorage?.getItem("popupDismissed")
      if (!dismissed) {
        setIsVisible(true)
      }
    }, 20000)

    return () => clearTimeout(timer)
  }, []) // Only run once on mount

  const handleDismiss = () => {
    setIsVisible(false)
    window?.localStorage?.setItem("popupDismissed", "true")
  }

  // Don't render anything on server side or if not mounted
  if (!mounted || !isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleDismiss}
      />

      {/* Popup */}
      <div
        className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/20 bg-white shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1 text-slate-400 transition-colors hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="relative overflow-hidden p-6 sm:p-8">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-100/80 to-emerald-100/80 opacity-50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-100/80 to-blue-100/80 opacity-50 blur-3xl" />

          {/* Main content */}
          <div className="relative">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 p-3">
                <Logo className="h-8 w-8 text-white" />
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-900">
                Looking for Quality Tutoring?
              </h2>
              <p className="mb-6 text-center text-slate-600">
                Join Tuition Rider for personalized learning that ensures academic success
              </p>
            </div>

            {/* Features */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {[
                { 
                  icon: Users, 
                  text: "Expert Tutors",
                  description: "Highly qualified and experienced teachers"
                },
                { 
                  icon: TrendingUp, 
                  text: "Proven Results",
                  description: "90% of our students show improvement"
                },
                { 
                  icon: Shield, 
                  text: "Safe Learning",
                  description: "Verified tutors and secure platform"
                },
                { 
                  icon: Target, 
                  text: "Personalized Plans",
                  description: "Customized learning for your child"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/50"
                >
                  <div className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-blue-600 transition-colors group-hover:text-emerald-600" />
                    <span className="font-medium text-slate-900">{feature.text}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Special offer */}
            <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 p-4">
              <div className="relative">
                <p className="relative text-center text-sm font-medium text-slate-800">
                  🌟 Special Offer: First Demo Class Free + 20% Off First Month!
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="flex-1">
                <Button 
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-emerald-600 text-white transition-all hover:scale-105"
                  onClick={handleDismiss}
                >
                  <span className="relative z-10">Contact Us</span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 transition-all hover:scale-105"
                onClick={handleDismiss}
              >
                View Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 