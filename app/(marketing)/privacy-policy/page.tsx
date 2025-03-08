import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection information for Tuition Rider.",
}

export default function PrivacyPolicyPage() {
  return (
    <MaxWidthWrapper className="mb-12 mt-8 sm:mt-12">
      <div className="prose prose-slate mx-auto max-w-4xl dark:prose-invert">
        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mt-8">
          <h2>Introduction</h2>
          <p>
            At Tuition Rider, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="mt-8">
          <h2>Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Educational background and preferences</li>
            <li>Payment information</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Match students with appropriate tutors</li>
            <li>Process payments and transactions</li>
            <li>Send you updates and communications</li>
            <li>Improve our services</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2>Data Protection</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal data.
            However, please note that no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mt-8">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </section>
      </div>
    </MaxWidthWrapper>
  )
} 