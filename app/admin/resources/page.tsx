'use client'

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RotateCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  FileText,
  BookOpen,
  Upload,
  GraduationCap,
  Loader2,
  Eye,
  Trash,
  Search,
  Filter,
  AlertCircle,
  Info,
  AlertTriangle,
  RefreshCw,
  Lock,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { uploadResource } from "@/app/actions/server/resources";
import { useAdminAuth } from "@/lib/hooks/use-admin-auth";
import { useRouter } from "next/navigation";
import { cookies } from 'next/headers';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const subjects = [
  'English',
  'Hindi',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Social Science',
  'Environmental Studies (EVS)',
  'General Knowledge',
  'Art & Craft',
  'Physical Education'
] as const;

const grades = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10'
] as const;

const resourceTypes = [
  'Previous Year Question Papers',
  'Practice Worksheets',
  'Test Papers',
  'Study Materials',
  'NCERT Solutions',
  'Sample Papers',
  'Chapter Notes',
  'Important Questions',
  'Revision Notes',
  'Holiday Homework'
] as const;

type Subject = typeof subjects[number];
type Grade = typeof grades[number];
type ResourceType = typeof resourceTypes[number];

// Demo resources for fallback
const demoResources = [
  {
    id: '1',
    title: 'Mathematics Formulas',
    description: 'Key formulas for all units',
    subject: 'Mathematics',
    grade: 'Class 10',
    type: 'Study Materials',
    file_url: '#',
    download_count: 145,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Physics Sample Papers',
    description: 'Practice papers for final exams',
    subject: 'Physics',
    grade: 'Class 9',
    type: 'Sample Papers',
    file_url: '#',
    download_count: 89,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function AdminResourcesPage() {
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [useDemoData, setUseDemoData] = useState(false);

  // Check admin authentication
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/auth');
    }
  }, [isAdmin, authLoading, router]);

  // Initialize Supabase and fetch resources
  useEffect(() => {
    fetchResources();
  }, [retryCount]);

  const fetchResources = async () => {
    // Create a new Supabase client
    const supabase = createClientComponentClient();
    
    try {
      setIsLoading(true);
      setLoadError(null);
      setErrorDetails(null);
      
      console.log("Fetching resources, attempt #", retryCount + 1);
      
      // Check for admin cookie
      const adminCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-auth='));
        
      console.log("Admin cookie:", adminCookie ? "Found" : "Not found");
      
      // First try the admin API endpoint if we have admin cookie
      if (adminCookie) {
        try {
          console.log("Trying admin API endpoint first...");
          const response = await fetch('/api/admin/resources');
          
          if (response.ok) {
            const { resources } = await response.json();
            console.log("Successfully loaded", resources?.length || 0, "resources via admin API");
            setResources(resources || []);
            setUseDemoData(false);
            setIsLoading(false);
            return;
          } else {
            console.log("Admin API failed, falling back to regular client");
          }
        } catch (adminApiError) {
          console.error("Admin API error:", adminApiError);
          // Continue with regular client
        }
      }
      
      // First ensure we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!session && !adminCookie) {
        console.error("No authentication found");
        throw new Error("No authentication session found. Please login again.");
      }
      
      // Add custom headers to the fetch request for admin token validation
      let options = {};
      if (adminCookie) {
        // If we have the admin cookie, use it for authorization
        options = {
          headers: {
            'X-Admin-Auth': 'true'
          }
        };
      }
      
      console.log("Attempting to fetch resources...");
      
      // First try: Check if resources table exists by checking count
      try {
        const { count, error: countError } = await supabase
          .from('resources')
          .select('*', { count: 'exact', head: true });
          
        if (countError) {
          console.log("Error checking resources count:", countError);
          // Continue to the regular query despite the error
        } else {
          console.log("Resources table exists, found", count, "resources");
        }
      } catch (countErr) {
        console.error("Count query error:", countErr);
        // Proceed anyway
      }
      
      // Try to fetch resources from Supabase
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching resources:", error);
        setLoadError('Failed to load resources from the database. Please check your connection or try again.');
        
        // Provide more detailed error information
        let errorInfo = `Error code: ${error.code}, Message: ${error.message}`;
        if (error.details) errorInfo += `, Details: ${error.details}`;
        if (error.hint) errorInfo += `, Hint: ${error.hint}`;
        
        setErrorDetails(errorInfo);
        
        // Try auth refresh if we get a 401
        if (error.code === '401' && session) {
          console.log("Got 401, attempting to refresh session...");
          try {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error("Session refresh error:", refreshError);
            } else {
              console.log("Session refreshed, retrying...");
              // Don't increment retry count, just try again
              setTimeout(() => fetchResources(), 1000);
              return;
            }
          } catch (refreshErr) {
            console.error("Error refreshing session:", refreshErr);
          }
        }
        
        // If permission denied error, suggest running the SQL script
        if (error.code === '42501') {
          setErrorDetails(errorInfo + "\n\nPlease run the 'fix_resources_permissions.sql' script in Supabase SQL Editor.");
        }
        
        // Try to use demo data immediately if there's a table error
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log("Resources table may not exist, using demo data");
          setUseDemoData(true);
          setResources(demoResources);
        }
        // Only set demo data after a few retries for other errors
        else if (retryCount > 1) {
          setUseDemoData(true);
          setResources(demoResources);
        } else {
          setResources([]);
        }
      } else {
        console.log("Successfully loaded", data?.length || 0, "resources");
      setResources(data || []);
        setUseDemoData(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoadError('An unexpected error occurred while loading resources.');
      setErrorDetails(error instanceof Error ? error.message : String(error));
      
      // Use demo data after the first retry for unexpected errors
      if (retryCount > 0) {
        setUseDemoData(true);
        setResources(demoResources);
      } else {
        setResources([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Retrying connection to load resources...");
  };

  const handleDelete = async (id: string) => {
    // If using demo data, just update the state
    if (useDemoData) {
      setResources(prev => prev.filter(r => r.id !== id));
      toast.success('Resource deleted.');
      return;
    }
    
    try {
      const supabase = createClientComponentClient();
      
      // Ensure we have a valid session by checking admin cookie
      const adminCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-auth='));
        
      if (!adminCookie) {
        // Try refreshing the session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.error("No valid session for delete:", sessionError);
          toast.error("Authentication error. Please log in again.");
          return;
        }
      }
      
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Delete error:", error);
        toast.error(`Failed to delete: ${error.message}`);
        return;
      }
      
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resource');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    
    try {
      // If using demo data, create a demo resource
      if (useDemoData) {
      const title = formData.get('title') as string;
        const description = formData.get('description') as string || '';
      const subject = formData.get('subject') as string;
      const grade = formData.get('grade') as string;
      const type = formData.get('type') as string;

        // Client-side validation
      if (!title || !subject || !grade || !type) {
        throw new Error('Please fill in all required fields');
      }

        // Add demo resource
        const newResource = {
          id: Date.now().toString(),
          title,
          description,
          subject,
          grade,
          type,
          file_url: '#demo-resource',
          download_count: 0,
          created_at: new Date().toISOString()
        };
        
        setResources(prev => [newResource, ...prev]);
        toast.success('Resource added (demo mode)');
        setIsDialogOpen(false);
        
        // Reset form
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        (document.querySelector('form') as HTMLFormElement).reset();
        return;
      }
      
      // Check admin cookie for auth confirmation
      const adminCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-auth='));
        
      if (!adminCookie) {
        // If no admin cookie, verify we have a valid session
        const supabase = createClientComponentClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error("No valid session for upload:", sessionError);
          throw new Error("Authentication error. Please log in again.");
        }
      }
      
      // Normal mode - upload to server
      const result = await uploadResource(formData);
      
      if (!result) {
        throw new Error('Upload failed: No response from server');
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Resource uploaded successfully!');
      setIsDialogOpen(false);
      fetchResources(); // Refresh resources

      // Reset form
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      (document.querySelector('form') as HTMLFormElement).reset();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload resource');
    } finally {
      setIsUploading(false);
    }
  };

  // Add a function to manually sign in as admin if needed
  const forceAdminAuth = async () => {
    try {
      const supabase = createClientComponentClient();
      
      // Try to set the admin cookie directly
      document.cookie = "admin-auth=true; path=/; max-age=86400; SameSite=Lax";
      
      // Set admin session cookie with proper format
      const adminSession = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'admin@example.com',
        role: 'ADMIN',
        exp: Math.floor(Date.now() / 1000) + 86400
      };
      
      document.cookie = `admin-session=${JSON.stringify(adminSession)}; path=/; max-age=86400; SameSite=Lax`;
      
      // Also try to refresh the auth session
      try {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.log("Session refresh failed, but continuing with admin cookie:", refreshError);
        } else {
          console.log("Session refreshed successfully");
        }
      } catch (refreshError) {
        console.error("Auth refresh error:", refreshError);
        // Continue with admin cookie even if refresh fails
      }
      
      toast.success("Admin authentication refreshed");
      
      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force a retry with the new admin cookie
      setRetryCount(prev => prev + 1);
    } catch (error) {
      console.error("Auth refresh error:", error);
      toast.error("Failed to refresh authentication");
    }
  };

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    if (!resource) return false;
    
    const matchesSearch = (resource.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (resource.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || 
      (resource.subject?.toLowerCase() || '') === selectedSubject.toLowerCase();
    const matchesGrade = selectedGrade === "all" || 
      (resource.grade?.toLowerCase() || '') === selectedGrade.toLowerCase();
    
    return matchesSearch && matchesSubject && matchesGrade;
  });

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage educational resources for students and teachers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-muted/30 rounded-lg">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <p className="text-center font-medium">Loading resources...</p>
          <p className="text-center text-sm text-muted-foreground mt-1">This may take a moment</p>
        </div>
      )}

      {/* Error Display */}
      {loadError && (
        <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20 flex flex-col items-center">
          <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
          <h3 className="font-semibold text-center">Error Loading Resources</h3>
          <p className="text-sm text-center mb-4">{loadError}</p>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => fetchResources()}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => forceAdminAuth()}
              className="ml-auto"
            >
              <Lock className="mr-2 h-4 w-4" />
              Refresh Admin Auth
            </Button>
          </div>

          {errorDetails && (
            <div className="mt-4 p-3 bg-muted/50 rounded text-xs font-mono w-full overflow-x-auto">
              <p className="font-semibold mb-1">Error Details:</p>
              <pre className="whitespace-pre-wrap break-all">{errorDetails}</pre>
            </div>
          )}

          {errorDetails && errorDetails.includes("does not exist") && errorDetails.includes("resources") && (
            <div className="mt-4 w-full">
              <p className="text-sm font-medium mb-2">Missing Resources Table</p>
              <p className="text-xs mb-2">Run this SQL script in your Supabase SQL editor:</p>
              <div className="p-3 bg-muted rounded text-xs font-mono overflow-x-auto">
                {`CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id)
);`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Demo Data Notification */}
      {useDemoData && (
        <Alert variant="default" className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription>
            Showing demo data due to connection issues. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters Section */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative col-span-full sm:col-span-1 lg:col-span-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject.toLowerCase()}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade.toLowerCase()}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="space-y-6">
        {!isLoading && filteredResources.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredResources.length} resources
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1 text-base font-medium">
                        {resource.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Added on {new Date(resource.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                      {resource.description || 'No description provided'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        <BookOpen className="mr-1 h-3 w-3" />
                        {resource.subject}
                      </div>
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        <GraduationCap className="mr-1 h-3 w-3" />
                        {resource.grade}
                      </div>
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        <FileText className="mr-1 h-3 w-3" />
                        {resource.type}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDelete(resource.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : !isLoading && (
          <div className="text-center py-12 px-4">
            <div className="bg-muted rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">No Resources Found</h3>
            <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
              {searchQuery || selectedSubject !== "all" || selectedGrade !== "all"
                ? "Try adjusting your search filters"
                : "Click the upload button to add your first resource"}
            </p>
            {(searchQuery || selectedSubject !== "all" || selectedGrade !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                  setSelectedGrade("all");
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Resource</DialogTitle>
            <DialogDescription>
              Add a new learning resource to the platform.
              {useDemoData && <span className="text-amber-600 font-medium"> (Demo Mode)</span>}
            </DialogDescription>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Enter resource title" required />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="type">Resource Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select name="subject" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject.toLowerCase()}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="grade">Grade/Level</Label>
                <Select name="grade" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade.toLowerCase()}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Enter resource description"
                  className="h-20 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="file">File</Label>
                <Input 
                  id="file" 
                  name="file" 
                  type="file" 
                  required 
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT (Max size: 10MB)
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Resource</span>
                </div>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 