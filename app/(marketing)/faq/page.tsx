"use client"

import { FAQ } from "@/components/sections/faq"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HeaderSection } from "@/components/shared/header-section"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export default function FAQPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-[20%] -top-[40%] size-[70%] rounded-full bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[20%] size-[70%] rounded-full bg-gradient-to-tl from-emerald-100/20 to-transparent blur-3xl" />
        </div>
        
        <MaxWidthWrapper className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Have a Question?
            </h1>
            <p className="text-lg text-slate-600">
              Find answers to common questions about our tutoring services. Can't find what you're looking for? Feel free to contact us directly.
            </p>
          </div>
        </MaxWidthWrapper>
      </section>

      <FAQ />
      <WhatsAppButton />
    </main>
  )
} 