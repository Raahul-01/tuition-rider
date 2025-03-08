import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Tuition Rider",
  description: "Explore our comprehensive tutoring services designed to help students excel in their academic journey.",
};

interface ServicesLayoutProps {
  children: React.ReactNode;
}

export default function ServicesLayout({ children }: ServicesLayoutProps) {
  return <>{children}</>;
}