"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import GoogleAnalytics from "@/app/google-analytics"

export function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <VercelAnalytics />
    </>
  )
}
