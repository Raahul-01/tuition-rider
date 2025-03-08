"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Github, Linkedin } from "lucide-react"
import type { NavItem } from "@/types"

import { footerLinks, siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { Logo } from "@/components/shared/logo"

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/tuition-rider/" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/Schoolstudyhometuition" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/tuitionrider?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
  { name: "Twitter", icon: Twitter, href: "#" },
]

const contactInfo = [
  { 
    icon: MapPin, 
    text: "Phagwara, Punjab",
    href: "https://maps.google.com/?q=Phagwara,Punjab"
  },
  { 
    icon: Phone, 
    text: "+91 9465172269",
    href: "tel:+919465172269"
  },
  { 
    icon: Mail, 
    text: "tuitionrider1@gmail.com",
    href: "mailto:tuitionrider1@gmail.com"
  },
]

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <footer className={cn("relative bg-gradient-to-b from-white via-blue-50/30 to-emerald-100/20", className)}>
      {/* Top Wave SVG */}
      <div className="absolute left-0 top-0 w-full rotate-180 overflow-hidden leading-none">
        <svg
          className="relative block h-12 w-full text-blue-50 sm:h-16"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-current"
          ></path>
        </svg>
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-8 sm:py-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 shadow-lg transition-transform duration-300 hover:rotate-6">
                <Logo className="sm:size-6 size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-xl sm:text-2xl font-bold text-transparent">
                  Tuition
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-600">Rider</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Connecting students with expert home tutors. Experience personalized learning at your doorstep with our qualified and experienced tutors.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex size-9 sm:size-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-md transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-blue-600 hover:to-emerald-600 hover:text-white"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.2 * index, duration: 0.5 }
                    }}
                  >
                    <Icon size={16} className="transition-transform duration-300 group-hover:rotate-12 sm:size-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <h3 className="relative inline-block text-base sm:text-lg font-bold text-slate-800">
              Contact Info
              <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600"></span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 transition-colors hover:text-blue-600"
                  target={item.icon === MapPin ? "_blank" : undefined}
                  rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                >
                  <item.icon className="size-3 sm:size-4" />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <motion.div variants={itemVariants} key={section.title} className="space-y-4 sm:space-y-6">
              <h3 className="relative inline-block text-base sm:text-lg font-bold text-slate-800">
                {section.title}
                <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600"></span>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.items?.map((link: NavItem) => (
                  <motion.li 
                    key={link.title}
                    className="group"
                    whileHover={{ x: 8 }}
                  >
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-600 transition-colors duration-200 hover:text-blue-600"
                    >
                      {link.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="border-t border-blue-100/50">
        <div className="container mx-auto flex flex-col sm:flex-row max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:py-6">
          <p className="text-center sm:text-left text-xs sm:text-sm text-slate-600">
            Built with ❤️ by{" "}
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Tuition Rider
            </Link>
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/Raahul-01"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Github className="size-4 sm:size-5" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
