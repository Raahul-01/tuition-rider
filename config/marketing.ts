import { MarketingConfig } from "@/types"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "Academics",
      href: "/courses",
      items: [
        { title: "All Courses", href: "/courses" },
        { title: "Learning Resources", href: "/resources" },
        { title: "Curriculum", href: "/curriculum" }
      ]
    },
    {
      title: "About Us",
      href: "/about",
      items: [
        { title: "Our Story", href: "/about" },
        { title: "Our Services", href: "/services" },
        { title: "Student Success Stories", href: "/reviews" }
      ]
    },
    {
      title: "Student Zone",
      href: "/login",
      items: [
        { title: "Student Login", href: "/login" },
        { title: "New Registration", href: "/register" }
      ]
    },
    {
      title: "Contact",
      href: "/contact"
    }
  ],
  protectedNav: {
    admin: [
      { title: "Dashboard", href: "/admin" },
      { title: "Manage Users", href: "/admin/users" },
      { title: "Manage Resources", href: "/admin/resources" },
      { title: "Settings", href: "/admin/settings" }
    ],
    tutor: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "My Students", href: "/mystudent" },
      { title: "Class Schedule", href: "/dashboard/schedule" },
      { title: "Profile Settings", href: "/dashboard/profile" }
    ],
    student: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "My Classes", href: "/mytutor" },
      { title: "Learning Progress", href: "/dashboard/progress" },
      { title: "Study Materials", href: "/dashboard/resources" }
    ],
    user: [
      { title: "Get Started", href: "/contact" }
    ]
  }
}
