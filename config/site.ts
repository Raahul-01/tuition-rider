import { SidebarNavItem, SiteConfig } from "@/types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Tuition Rider",
  description:
    "Tuition Rider is the ultimate platform for organizing and managing tuition sessions. With our user-friendly interface, you can easily create and manage online tuition sessions, track student attendance, and generate detailed reports.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {  
    twitter: "#",
    github: "https://github.com/Raahul-01",
    linkedin: "https://www.linkedin.com/company/tuition-rider/",
    facebook: "https://www.facebook.com/Schoolstudyhometuition",
    instagram: "https://www.instagram.com/tuitionrider?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
  },
  mailSupport: "tuitionrider1@gmail.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Quick Links",
    items: [
      { title: "Home", href: "/" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms & Conditions", href: "/terms" },
    ],
  },
];
