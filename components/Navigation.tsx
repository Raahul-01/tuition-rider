import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function Navigation() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();

  // Get user profile if logged in
  let profile = null;
  if (session) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    profile = data;
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between py-3 gap-3">
        <Link href={isAdmin ? "/admin/dashboard" : "/"} className="font-bold text-xl">
          Tuition Rider
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            // Logged in state
            <>
              {isAdmin ? (
                // Admin Navigation
                <>
                  <Link href="/admin/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link href="/admin/resources">
                    <Button variant="ghost">Resources</Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button variant="ghost">Users</Button>
                  </Link>
                </>
              ) : (
                // User Navigation - only show resources
                <Link href="/resources">
                  <Button variant="ghost">Resources</Button>
                </Link>
              )}
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>{profile?.full_name || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <form action="/auth/signout" method="post">
                    <DropdownMenuItem asChild>
                      <button className="w-full flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Not logged in state
            <>
              <Link href="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 