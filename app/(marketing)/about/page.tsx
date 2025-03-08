"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Award, Heart, Lightbulb, GraduationCap, ArrowRight } from 'lucide-react';
import Link from "next/link";

import { HeaderSection } from "@/components/shared/header-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Anoop Singh",
    role: "Founder & CEO",
    bio: "Former education consultant with 3+ years of experience in the tutoring industry. Passionate about making quality education accessible to all.",
    image: "/images/team/rahul.jpg"
  },
  {
    name: "Priya Patel",
    role: "Head of Tutor Relations",
    bio: "Experienced educator with a background in curriculum development. Ensures our tutors meet the highest standards of teaching excellence.",
    image: "/images/team/priya.jpg"
  },
  {
    name: "Rahul kumar",
    role: "Chief Technology Officer",
    bio: "Tech enthusiast with expertise in educational technology. Dedicated to creating seamless digital experiences for students and tutors.",
    image: "/images/team/amit.jpg"
  },
  {
    name: "Neha Gupta",
    role: "Student Success Manager",
    bio: "Former school counselor with a passion for helping students achieve their academic goals through personalized support.",
    image: "/images/team/neha.jpg"
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly seek new ways to improve the tutoring experience through technology and teaching methodologies."
  },
  {
    icon: Heart,
    title: "Compassion",
    description: "We understand each student's unique challenges and provide supportive guidance tailored to their needs."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in our tutoring services, curriculum development, and tutor selection."
  },
  {
    icon: Users,
    title: "Community",
    description: "We foster a collaborative environment where students, parents, and tutors work together toward academic success."
  },
];

const milestones = [
  {
    year: "2023",
    event: "Started as a home tuition service, helping students get personalized attention and quality learning",
    icon: GraduationCap
  },
  {
    year: "2024",
    event: "Expanded to five major cities in Punjab (Jalandhar, Ludhiana, Amritsar, Phagwara, and Moga), built a team of 250+ expert tutors, completed 10,000+ teaching hours",
    icon: Users
  },
  {
    year: "2025",
    event: "Vision to teach 1000+ students, build 500+ expert tutors team, expand across Punjab, and become Punjab's No.1 home tutoring service",
    icon: Award
  }
];

const trustFactors = [
  {
    icon: Award,
    title: "Proven Track Record",
    description: "10,000+ hours of teaching completed"
  },
  {
    icon: Users,
    title: "Expert & Verified Tutors",
    description: "A growing team of 250+ skilled teachers"
  },
  {
    icon: BookOpen,
    title: "Flexible Learning",
    description: "Choose home tuition or online learning as per convenience"
  },
  {
    icon: Heart,
    title: "Personalized Attention",
    description: "Study plans tailored to every child's needs"
  },
  {
    icon: GraduationCap,
    title: "Results That Speak",
    description: "Our students are excelling in academics and setting new records"
  }
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16 md:py-24">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-[20%] -top-[40%] size-[70%] rounded-full bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[20%] size-[70%] rounded-full bg-gradient-to-tl from-emerald-100/20 to-transparent blur-3xl" />
        </div>
        
        <MaxWidthWrapper>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                About <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Tuition Rider</span>
              </h1>
              <p className="mb-6 text-lg text-slate-600">
                We're on a mission to transform the tutoring experience by connecting dedicated tutors with eager students through our innovative platform.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/contact">
                  <Button size="lg" className="group w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white transition-all hover:from-blue-700 hover:to-emerald-700">
                    Get Started
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full">
                    Our Services
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl border border-white/50 bg-white/80 p-2 shadow-xl backdrop-blur-lg transition-all duration-500 hover:shadow-2xl md:h-[400px]">
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                  <Users className="mb-4 size-16 text-blue-600" />
                  <h3 className="mb-2 text-2xl font-bold text-slate-800">Our Story</h3>
                  <p className="text-slate-600">
                    Founded in 2018, Tuition Rider began with a simple idea: make quality education accessible to everyone through a network of passionate tutors.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Our Mission Section */}
      <section className="w-full py-16">
        <MaxWidthWrapper>
          <HeaderSection
            title="Our Mission"
            subtitle="We're dedicated to transforming education through personalized tutoring experiences that empower students to reach their full potential."
            centered
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h3 className="mb-4 text-2xl font-bold text-slate-800">What We Do</h3>
              <p className="mb-6 text-slate-600">
                Tuition Rider connects qualified tutors with students seeking academic support. Our platform makes it easy to find the perfect tutor, schedule sessions, and track progress—all in one place.
              </p>
              <p className="text-slate-600">
                We carefully vet all our tutors to ensure they have the knowledge, experience, and teaching skills needed to help students succeed. Our matching algorithm pairs students with tutors who not only have expertise in the required subjects but also complement the student's learning style.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl border border-white/50 bg-white/80 p-2 shadow-xl backdrop-blur-lg transition-all duration-500 hover:shadow-2xl">
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="mb-4 size-16 text-blue-600" />
                  <h3 className="mb-2 text-2xl font-bold text-slate-800">Our Vision</h3>
                  <p className="text-slate-600">
                    We envision a world where quality education is accessible to all students, regardless of location or background, through personalized tutoring that adapts to each learner's unique needs.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Our Values Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-[20%] -top-[40%] size-[70%] rounded-full bg-gradient-to-br from-blue-100/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[20%] size-[70%] rounded-full bg-gradient-to-tl from-emerald-100/20 to-transparent blur-3xl" />
        </div>
        
        <MaxWidthWrapper className="relative z-10">
          <HeaderSection
            title="Our Core Values"
            subtitle="These principles guide everything we do at Tuition Rider, from how we develop our platform to how we support our community."
            centered
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex flex-col rounded-xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-lg transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-7 text-blue-600 transition-colors duration-300 group-hover:text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Our Team Section */}
      <section className="w-full py-16">
        <MaxWidthWrapper>
          <HeaderSection
            title="Meet Our Team"
            subtitle="The passionate individuals behind Tuition Rider who are dedicated to transforming the tutoring experience."
            centered
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-lg transition-all duration-500 hover:shadow-2xl"
              >
                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-emerald-50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  {/* Image would be displayed here in production */}
                  <div className="flex h-full items-center justify-center">
                    <Users className="size-20 text-blue-600/50" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-slate-800">{member.name}</h3>
                  <p className="mb-3 text-sm font-medium text-blue-600">{member.role}</p>
                  <p className="text-sm text-slate-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Our Journey Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
        <MaxWidthWrapper>
          <HeaderSection
            title="Our Journey So Far"
            subtitle="From humble beginnings to transforming education across Punjab"
            centered
          />

          <div className="mt-12">
            <div className="relative">
            {/* Timeline line */}
              <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-600 to-emerald-600"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className={`flex items-center gap-8 ${
                        index % 2 === 0 ? "flex-row md:pr-1/2" : "flex-row-reverse md:pl-1/2"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="rounded-xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                          <div className="mb-2 flex items-center gap-2">
                            <Icon className="size-5 text-blue-600" />
                            <h3 className="text-xl font-bold text-blue-600">{milestone.year}</h3>
                          </div>
                          <p className="text-slate-600">{milestone.event}</p>
                        </div>
                      </div>
                      <div className="relative flex size-4 shrink-0 items-center justify-center">
                        <div className="size-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600"></div>
                      </div>
                      <div className="flex-1"></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Why Parents Trust Us Section */}
      <section className="w-full py-16">
        <MaxWidthWrapper>
          <HeaderSection
            title="Why Parents Trust Tuition Rider"
            subtitle="We don't just teach; we nurture talent and build future toppers"
            centered
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trustFactors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <motion.div
                  key={factor.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6 text-blue-600 transition-colors duration-300 group-hover:text-emerald-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{factor.title}</h3>
                  <p className="text-slate-600">{factor.description}</p>
                </motion.div>
              );
            })}
            </div>

          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-emerald-600 text-white transition-all hover:from-blue-700 hover:to-emerald-700">
                Join the Success Story
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16">
        <MaxWidthWrapper>
          <div className="rounded-2xl border border-white/50 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-8 shadow-xl backdrop-blur-lg transition-all duration-500 hover:shadow-2xl md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900">Ready to Start Your Journey?</h2>
              <p className="mb-8 text-lg text-slate-600">
                Join Tuition Rider today and experience the difference personalized tutoring can make in your academic journey.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <Link href="/contact">
                  <Button size="lg" className="group w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white transition-all hover:from-blue-700 hover:to-emerald-700 sm:w-auto">
                    Book a Demo Class
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </main>
  );
}