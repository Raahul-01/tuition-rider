import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Tuition Rider services.",
}

export default function TermsPage() {
  return (
    <MaxWidthWrapper className="mb-12 mt-8 sm:mt-12">
      <div className="prose prose-slate mx-auto max-w-4xl dark:prose-invert">
        <h1 className="text-3xl font-bold sm:text-4xl">Terms & Conditions</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mt-8">
          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using Tuition Rider, you agree to be bound by these Terms and Conditions
            and our Privacy Policy. If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section className="mt-8">
          <h2>User Responsibilities</h2>
          <p>As a user of Tuition Rider, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Not share your account credentials</li>
            <li>Follow our community guidelines</li>
            <li>Pay for services as agreed</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2>Services</h2>
          <p>
            Tuition Rider provides an online platform connecting students with qualified tutors.
            We reserve the right to modify or discontinue any service without notice.
          </p>
        </section>

        <section className="mt-8">
          <h2>Payment Terms</h2>
          <p>
            Payment terms are specified at the time of booking. All fees are non-refundable unless
            otherwise stated in our refund policy.
          </p>
        </section>

        <section className="mt-8">
          <h2>Intellectual Property</h2>
          <p>
            All content on Tuition Rider, including text, graphics, logos, and software,
            is the property of Tuition Rider and protected by intellectual property laws.
          </p>
        </section>

        <section className="mt-8">
          <h2>Limitation of Liability</h2>
          <p>
            Tuition Rider is not liable for any indirect, incidental, special, or consequential
            damages arising from your use of our services.
          </p>
        </section>

        <section className="mt-8">
          <h2>Contact Information</h2>
          <p>
            For any questions about these Terms & Conditions, please contact us at{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </section>
      </div>
    </MaxWidthWrapper>
  )
} 