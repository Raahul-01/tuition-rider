import { Metadata } from "next";

import { Hero } from "@/components/sections/hero"
import { WhyHomeTutor } from "@/components/sections/why-home-tutor"
import { SubjectGrid } from "@/components/sections/subject-grid"
import { ServiceAreas } from "@/components/sections/service-areas"
import { Features } from "@/components/sections/features"
import { FAQ } from "@/components/sections/faq"
import { ContactUs } from "@/components/sections/contact-us"
import { HowWeWork } from "@/components/sections/how-we-work"
import { Reviews } from "@/components/sections/reviews"
import { WhatsAppButton } from "@/components/whatsapp-button"


export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Tuition Rider",
};

export default async function MarketingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <WhyHomeTutor />
      <SubjectGrid />
      {/* <CurriculumGrid /> */}
      <HowWeWork />
      <ServiceAreas />
      <FAQ />
      <ContactUs />
      <Reviews />
      <WhatsAppButton />
    </main>
  );
}
