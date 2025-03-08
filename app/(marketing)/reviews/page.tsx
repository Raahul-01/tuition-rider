"use client"

import { Reviews } from "@/components/sections/reviews"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function ReviewsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Reviews />
      <WhatsAppButton />
    </main>
  )
} 