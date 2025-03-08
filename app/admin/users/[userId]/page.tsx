'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, Mail, Phone, Calendar, ArrowLeft, 
  Edit, Trash, Shield, RefreshCcw, Book
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function UserDetailPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // Check admin authentication first
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminCookieStr = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-auth='));
      
      // Extract the value from the cookie string
      const adminCookieValue = adminCookieStr ? adminCookieStr.split('=')[1] : null;
      
      if (!adminCookieValue || adminCookieValue !== 'true') {
        toast.error('Admin authentication required');
        router.push('/auth?mode=admin');
      }
    };
    
    checkAdminAuth();
  }, [router]);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, check if this is a valid UUID
        if (!params.userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          throw new Error('Invalid user ID format');
        }
        
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.userId)
          .single();
          
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        
        if (!data) {
          throw new Error('User not found');
        }
        
        setUser(data);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [params.userId, supabase]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-48" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Error</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 md:py-10">
      <div className="flex items-center gap-2 mb-4 md:mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Student Details</h1>
      </div>
      
      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                <div className="bg-primary/10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center">
                  <User className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium">{user.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role?.toUpperCase()}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-2 md:gap-3 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {user.grade && (
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>Grade: {user.grade}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 md:pt-4">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <div className="space-y-3 md:space-y-4">
              <div className="grid gap-2 md:gap-3 text-sm md:text-base">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>Account Status</span>
                  </div>
                  <span className="text-xs md:text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>Last Login</span>
                  </div>
                  <span className="text-sm">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span>Login Count</span>
                  </div>
                  <span className="text-sm">{user.login_count || 0}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2 md:pt-4">
                <h4 className="font-medium mb-2 text-sm md:text-base">Access Management</h4>
                <div className="grid gap-2 md:gap-3">
                  <Button variant="outline" className="w-full justify-start text-sm h-9">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm h-9">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Role
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 