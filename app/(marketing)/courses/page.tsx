"use client"

import { SubjectGrid } from "@/components/sections/subject-grid"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function CoursesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-5xl font-bold text-transparent">
              Discover Your Learning Path
            </h1>
            <p className="mb-8 text-lg text-slate-600">
              Explore our comprehensive range of courses designed to help you excel in your academic journey. From primary to higher education, we have everything you need to succeed.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-3 text-white transition-transform hover:scale-105">
                Get Started
              </button>
              <button className="rounded-full border-2 border-blue-600 px-8 py-3 text-blue-600 transition-transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-blue-600">250+</div>
              <div className="text-sm text-slate-600">Expert Tutors</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-emerald-600">10000+</div>
              <div className="text-sm text-slate-600">Teaching Hours</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-blue-600">20+</div>
              <div className="text-sm text-slate-600">Subjects</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-emerald-600">95%</div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <SubjectGrid />
      <WhatsAppButton />
    </main>
  )
} 