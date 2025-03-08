"use client"

import { ComingSoon } from "@/components/sections/coming-soon"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HeaderSection } from "@/components/shared/header-section"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-16 md:py-24">
        <MaxWidthWrapper>
          <HeaderSection
            title="Educational Insights"
            subtitle="Discover articles, tips, and resources to enhance your learning journey"
            centered
          />
        </MaxWidthWrapper>
      </section>

      <ComingSoon 
        title="Blog Coming Soon"
        description="We're preparing insightful articles and educational content. Check back soon!"
      />
      <WhatsAppButton />
    </main>
  )
} 