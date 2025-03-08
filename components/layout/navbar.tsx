"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Search,
  BookOpen,
  Book,
  Users,
  MessageSquare,
  Shield,
  FileText,
  Menu,
  X
} from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

interface NavBarProps {
  scroll?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        // Get session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession) {
          // Get profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          console.log('Current session:', currentSession);
          console.log('User profile:', userProfile);

          setProfile(userProfile || {
            full_name: currentSession.user.user_metadata?.full_name || currentSession.user.email
          });
        }
    } catch (error) {
        console.error('Error fetching session/profile:', error);
    } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(true);
      
      if (session?.user.id) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(userProfile || {
          full_name: session.user.user_metadata?.full_name || session.user.email
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (scroll) {
      const handleScroll = () => setIsScrolled(window.scrollY > 0);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [scroll]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "border-b shadow-sm"
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white/50 to-emerald-50/50"></div>
      <nav className="container relative flex h-16 items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center space-x-3 transition-transform hover:scale-105"
        >
          <div className="flex items-center justify-center h-10 w-10">
            <Logo className="h-full w-full" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Tuition Rider
          </span>
        </Link>

        {/* Mobile Menu Button */}
          <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-slate-600" />
          ) : (
            <Menu className="h-6 w-6 text-slate-600" />
          )}
          </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1 ml-8">
          {/* Find Tutor Link */}
          <Link href="/contact">
            <Button 
              variant="ghost"
              className="font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 flex items-center gap-2"
            >
              <Search className="h-4 w-4 text-emerald-600" />
              Find Tutor
            </Button>
          </Link>

          {/* Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost"
                className="group relative font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50"
              >
                <span className="flex items-center gap-1">
                  Services
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 animate-in fade-in-0 zoom-in-95 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-lg divide-y divide-slate-100"
              align="start"
              sideOffset={8}
            >
              <DropdownMenuItem asChild>
                <Link href="/services" className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Our Services</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/curriculum" className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Curriculum</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Learning Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost"
                className="group relative font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50"
              >
                <span className="flex items-center gap-1">
                  Learning
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 animate-in fade-in-0 zoom-in-95 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-lg divide-y divide-slate-100"
              align="start"
              sideOffset={8}
            >
              <DropdownMenuItem asChild>
                <Link href="/resources" className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <FileText className="size-5" />
                  <div>
                    <div className="font-medium">Learning Resources</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses" className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Courses</p>
                      </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reviews Link */}
          <Link href="/reviews">
            <Button 
              variant="ghost"
              className="font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50"
            >
              Reviews
            </Button>
          </Link>

          {/* About & Contact Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost"
                className="group relative font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50"
              >
                <span className="flex items-center gap-1">
                  About
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 animate-in fade-in-0 zoom-in-95 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-lg divide-y divide-slate-100"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuItem asChild>
                <Link href="/about" className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">About Us</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact" className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Contact</p>
              </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/privacy-policy" className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Privacy Policy</p>
          </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center space-x-4 ml-auto">
          {session ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="font-medium bg-gradient-to-r from-blue-50 to-emerald-50 hover:from-blue-100 hover:to-emerald-100"
                    >
                      Admin
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-t-2 border-t-blue-500">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/resources" className="w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                        Resources
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users" className="w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                        Users
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-1.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-slate-700">
                      {profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm">
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                  <Button
                    variant="ghost"
                  className="font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50"
                  >
                    Sign In
                  </Button>
              </Link>
              <Link href="/auth">
                  <Button
                  className="font-medium bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700"
                  >
                    Sign Up
                  </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg py-4">
            <div className="container space-y-2">
              {/* Find Tutor Link */}
              <Link href="/contact" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                <Search className="h-5 w-5 text-emerald-600" />
                <span>Find Tutor</span>
              </Link>

              {/* Mobile Services Links */}
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-semibold text-slate-900">Services</div>
                <Link href="/services" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span>Our Services</span>
                </Link>
                <Link href="/curriculum" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>Curriculum</span>
                </Link>
              </div>

              {/* Mobile Learning Links */}
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-semibold text-slate-900">Learning</div>
                <Link href="/resources" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <FileText className="size-5" />
                  Learning Resources
                </Link>
                <Link href="/courses" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <span>Courses</span>
                </Link>
              </div>

              {/* Mobile Reviews Link */}
              <Link href="/reviews" className="block px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                Reviews
              </Link>

              {/* Mobile About Links */}
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-semibold text-slate-900">About</div>
                <Link href="/about" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>About Us</span>
                </Link>
                <Link href="/contact" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  <span>Contact</span>
                </Link>
                <Link href="/privacy-policy" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Privacy Policy</span>
                </Link>
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t mt-4 pt-4 px-4">
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-slate-700">
                        {profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-900">Admin</div>
                        <Link href="/admin/dashboard" className="block py-2 text-slate-600 hover:text-blue-600">Dashboard</Link>
                        <Link href="/admin/resources" className="block py-2 text-slate-600 hover:text-blue-600">Resources</Link>
                        <Link href="/admin/users" className="block py-2 text-slate-600 hover:text-blue-600">Users</Link>
                      </div>
                    )}
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth" className="w-full">
                      <Button 
                        variant="ghost"
                        className="w-full font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth" className="w-full">
                      <Button 
                        className="w-full font-medium bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
