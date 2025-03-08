import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Tuition Rider",
  description: "Learn about Tuition Rider's mission, our team, and how we're transforming the tutoring experience.",
};

interface AboutLayoutProps {
  children: React.ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return <>{children}</>;
}