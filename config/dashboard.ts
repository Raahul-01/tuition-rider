import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { 
        href: "/dashboard", 
        icon: "dashboard", 
        title: "Dashboard",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/admin/students",
        icon: "user",
        title: "Manage Students",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/tutors",
        icon: "user",
        title: "Manage Tutors",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/users",
        icon: "check",
        title: "Manage Users",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/mystudent",
        icon: "user",
        title: "My Students",
        authorizeOnly: UserRole.TUTOR,
      },
      {
        href: "/mytutor",
        icon: "user",
        title: "My Tutors",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/register-user",
        icon: "package",
        title: "Register as Student",
        authorizeOnly: UserRole.USER,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { 
        href: "/dashboard/settings", 
        icon: "settings", 
        title: "Settings",
        // authorizeOnly: [UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN],
      },
    ],
  },
];
