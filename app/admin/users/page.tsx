'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Ban,
  School,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check for admin cookie as fallback
      const adminCookieStr = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-auth='));
      
      const adminCookieValue = adminCookieStr ? adminCookieStr.split('=')[1] : null;
      
      if (!adminCookieValue && (!session || session.user.email !== 'tuitionrider1@gmail.com')) {
        router.push("/auth");
      }
    };
    
    checkAdmin();
  }, [router, supabase]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'USER')
        .order('created_at', { ascending: false });
        
      if (!error) {
        setUsers(data || []);
      } else {
        console.error("Error fetching users:", error);
      }
      
      setLoading(false);
    };
    
    fetchUsers();
  }, [supabase]);

  // Get active users count (logged in within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const activeUsers = users?.filter(user => 
    user.last_login && new Date(user.last_login) > thirtyDaysAgo
  ).length || 0;

  // Filter users by search
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="container px-4 py-6 md:py-10 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">Student Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage registered students and their access</p>
        </div>
        <Button className="w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96 mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search students..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-3 md:p-4 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-2">
            <div className="text-xl md:text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-3 md:p-4 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Active Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-2">
            <div className="text-xl md:text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Active in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-3 md:p-4 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Average Grade</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-2">
            <div className="text-xl md:text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-3 md:p-4 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Resource Usage</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-2">
            <div className="text-xl md:text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader className="p-4">
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4">
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="grid gap-3">
              {filteredUsers.map((user) => (
                <Link
                  href={`/admin/users/${user.id}`}
                  key={user.id}
                  className="block"
                >
                  <div
                    className="flex items-start md:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start md:items-center gap-3 overflow-hidden">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm md:text-base truncate">{user.full_name}</h3>
                        <div className="flex flex-col md:flex-row md:gap-4 mt-1">
                          <span className="text-xs md:text-sm text-muted-foreground flex items-center truncate">
                            <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </span>
                          {user.phone && (
                            <span className="text-xs md:text-sm text-muted-foreground flex items-center mt-1 md:mt-0">
                              <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                          <span className="text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            {user.grade || 'Grade not set'}
                          </span>
                          <span className="text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            {user.subjects?.join(', ') || 'No subjects'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this user?')) {
                          supabase
                            .from('profiles')
                            .delete()
                            .eq('id', user.id)
                            .then(({ error }) => {
                              if (!error) {
                                setUsers(users.filter(u => u.id !== user.id));
                              } else {
                                console.error('Error deleting user:', error);
                              }
                            });
                        }
                      }}
                    >
                      <Ban className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 md:py-8">
              <Users className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {searchQuery ? 'No students match your search.' : 'No students registered yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 