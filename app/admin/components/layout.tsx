'use client'

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  FileText,
  BookOpen,
  Users,
  Settings,
  MessageSquare,
  Menu,
  X,
  LogOut
} from "lucide-react"
import { Logo } from "@/components/shared/logo"
import { useAdminAuth } from "@/lib/hooks/use-admin-auth"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: FileText,
    href: "/admin",
    description: "Overview of all activities"
  },
  {
    title: "Resources",
    icon: BookOpen,
    href: "/admin/resources",
    description: "Manage learning materials"
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    description: "Manage user accounts"
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
    description: "View student inquiries"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    description: "Configure system settings"
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { isAdmin, isLoading, logout } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Handle authentication
  useEffect(() => {
    if (!isLoading && !isAdmin && !pathname?.includes('/login')) {
      router.push('/admin/login')
    }
  }, [isAdmin, isLoading, pathname, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 w-[280px]">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // Don't render protected content until authenticated
  if (!isAdmin && !pathname?.includes('/login')) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "shrink-0 h-screen lg:w-[280px] bg-card border-r",
          "fixed lg:sticky top-0 left-0 z-40",
          "w-[280px] transform transition-transform duration-200 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Admin Portal</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex flex-col gap-2 p-4 h-[calc(100vh-4rem-3rem)] overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                pathname === item.href
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )} />
              <div>
                <div className="font-medium">{item.title}</div>
                <div className={cn(
                  "text-xs",
                  pathname === item.href
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
              {pathname === item.href && (
                <div className="absolute right-2 h-2 w-2 rounded-full bg-primary-foreground" />
              )}
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="h-12 border-t p-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/50"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b bg-card/50 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between h-full px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="hidden sm:flex"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
} 