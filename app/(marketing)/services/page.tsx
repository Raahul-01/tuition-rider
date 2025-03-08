"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Award, Users, Lightbulb, Sparkles, GraduationCap, Star } from 'lucide-react';
import Link from "next/link";

import { HeaderSection } from "@/components/shared/header-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo"

// Metadata is moved to layout file

const services = [
  {
    icon: BookOpen,
    title: "One-on-One Tutoring",
    description: "Personalized attention and customized learning plans tailored to individual student needs and learning styles.",
    features: ["Personalized learning plans", "Flexible scheduling", "Progress tracking", "Regular assessments"]
  },
  {
    icon: Users,
    title: "Small Group Sessions",
    description: "Collaborative learning environment for 2-4 students with similar academic needs and goals.",
    features: ["Peer learning opportunities", "Cost-effective solution", "Social interaction", "Shared resources"]
  },
  {
    icon: GraduationCap,
    title: "Exam Preparation",
    description: "Targeted preparation for board exams, competitive tests, and standardized assessments.",
    features: ["Practice tests", "Exam strategies", "Time management skills", "Subject-specific focus"]
  },
  {
    icon: Lightbulb,
    title: "Homework Help",
    description: "Assistance with daily assignments, projects, and homework to ensure complete understanding.",
    features: ["On-demand assistance", "Concept clarification", "Step-by-step guidance", "Problem-solving skills"]
  },
];

const subjects = [
  { 
    name: "Mathematics",
    href: "/resources/download?subject=mathematics"
  },
  { 
    name: "Science",
    href: "/resources/download?subject=science"
  },
  { 
    name: "English",
    href: "/resources/download?subject=english"
  },
  { 
    name: "Social Studies",
    href: "/resources/download?subject=social-studies"
  },
  { 
    name: "Physics",
    href: "/resources/download?subject=physics"
  },
  { 
    name: "Chemistry",
    href: "/resources/download?subject=chemistry"
  },
  { 
    name: "Biology",
    href: "/resources/download?subject=biology"
  },
  { 
    name: "Computer Science",
    href: "/resources/download?subject=computer-science"
  },
  { 
    name: "Hindi",
    href: "/resources/download?subject=hindi"
  },
  { 
    name: "History",
    href: "/resources/download?subject=history"
  },
  { 
    name: "Geography",
    href: "/resources/download?subject=geography"
  },
  { 
    name: "Economics",
    href: "/resources/download?subject=economics"
  }
];

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-16">
        <MaxWidthWrapper>
          <HeaderSection
            title="Our Services"
            subtitle="Discover our comprehensive range of tutoring services designed to help students excel."
            centered
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-white/50 p-2 shadow-xl md:h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-emerald-100/50 backdrop-blur-sm"></div>
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                  <Clock className="mb-4 size-16 text-blue-600" />
                  <h3 className="mb-2 text-2xl font-bold text-slate-800">Flexible Scheduling</h3>
                  <p className="text-slate-600">
                    Choose from a wide range of time slots that best fit your schedule.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-white/50 p-2 shadow-xl md:h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-emerald-100/50 backdrop-blur-sm"></div>
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                  <Logo className="mb-4 size-16 text-blue-600" />
                  <h3 className="mb-2 text-2xl font-bold text-slate-800">Personalized Learning</h3>
                  <p className="text-slate-600">
                    Our tutoring services are tailored to meet the unique needs of each student, ensuring optimal learning outcomes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Main Services Section */}
      <section className="w-full py-16">
        <MaxWidthWrapper>
          <HeaderSection
            title="Our Tutoring Services"
            subtitle="Comprehensive academic support tailored to your needs."
            centered
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-800">{service.title}</h3>
                  <p className="mb-4 text-slate-600">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-slate-600">
                        <span className="mr-2 text-emerald-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Subjects Section */}
      <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <MaxWidthWrapper>
          <HeaderSection
            title="Subjects We Cover"
            subtitle="Our expert tutors provide assistance across a wide range of academic subjects to support comprehensive learning."
            centered
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            {subjects.map((subject, index) => (
              <Link key={subject.name} href={subject.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col items-center rounded-lg border border-white/50 bg-white/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                >
                  <BookOpen className="mb-2 size-6 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">{subject.name}</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </MaxWidthWrapper>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-gradient-to-br from-emerald-50 to-blue-50 py-16">
        <MaxWidthWrapper>
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Tuition Rider</span>
              </h2>
              <p className="mb-6 text-slate-600">
                Our tutoring services are designed to provide students with the support they need to excel academically and develop a love for learning.
              </p>
              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-start"
                >
                  <span className="mr-4 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 p-2">
                    <Award className="size-5 text-blue-600" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800">Expert Tutors</h3>
                    <p className="text-sm text-slate-600">Qualified and experienced teachers who are passionate about education.</p>
                  </div>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-start"
                >
                  <span className="mr-4 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 p-2">
                    <Users className="size-5 text-blue-600" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800">Personalized Attention</h3>
                    <p className="text-sm text-slate-600">Individual focus on each student&apos;s learning needs and goals.</p>
                  </div>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start"
                >
                  <span className="mr-4 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 p-2">
                    <Star className="size-5 text-blue-600" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800">Proven Results</h3>
                    <p className="text-sm text-slate-600">Track record of improving academic performance and building confidence.</p>
                  </div>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-white p-2 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-emerald-100/50"></div>
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                  <img
                    src="/_static/illustrations/teaching.jpg"
                    alt="Teaching illustration"
                    className="mb-6 h-48 w-auto rounded-lg object-cover shadow-lg"
                  />
                  <h3 className="mb-2 text-2xl font-bold text-slate-800">Ready to Start?</h3>
                  <p className="mb-6 text-slate-600">
                    Book your first session today and experience the difference.
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                  >
                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full bg-white text-blue-600 hover:bg-blue-50 sm:w-auto"
                      >
                        Book a Demo Class
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-slate-200 bg-white text-slate-800 hover:bg-slate-50 sm:w-auto"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16">
        <MaxWidthWrapper>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 p-8 text-center text-white md:p-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-bold md:text-4xl"
            >
              Ready to Excel in Your Studies?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-lg text-white/90"
            >
              Join Tuition Rider today and take the first step towards academic success.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 sm:w-auto"
                >
                  Book a Demo Class
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white bg-transparent text-white hover:bg-white hover:text-blue-600 sm:w-auto"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>

      <WhatsAppButton />
    </main>
  );
}