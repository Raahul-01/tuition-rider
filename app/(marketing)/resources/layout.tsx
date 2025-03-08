import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Resources | Tuition Rider",
  description: "Access study materials, notes, and practice questions across all subjects.",
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 