"use client"

import { CurriculumGrid } from "@/components/sections/curriculum-grid"
import { WhatsAppButton } from "@/components/whatsapp-button"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export default function CurriculumPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <CurriculumGrid />
      <WhatsAppButton />
    </main>
  )
} 