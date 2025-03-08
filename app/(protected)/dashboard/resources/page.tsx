import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Search, Filter, FileText, GraduationCap, Star, Clock, Eye, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Other'
] as const;

const grades = [
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'All Grades'
] as const;

interface ResourceType {
  value: string;
  label: string;
  icon: LucideIcon;
}

const resourceTypes: ResourceType[] = [
  { value: 'all', label: 'All Types', icon: BookOpen },
  { value: 'notes', label: 'Study Notes', icon: FileText },
  { value: 'pyq', label: 'Previous Year Questions', icon: GraduationCap },
  { value: 'materials', label: 'Study Materials', icon: BookOpen },
];

export const metadata = {
  title: "My Learning Resources | Dashboard",
  description: "Access and manage your educational materials in one place"
}

export default async function DashboardResourcesPage({
  searchParams
}: {
  searchParams: { subject?: string, grade?: string, type?: string }
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth");
  }

  // Check if user is admin - if yes, redirect to admin resources
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role === 'admin') {
    redirect("/admin/resources");
  }

  // Build query with filters
  let query = supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('type', searchParams.type);
  }

  if (searchParams.subject && searchParams.subject !== 'all') {
    query = query.eq('subject', searchParams.subject);
  }

  if (searchParams.grade && searchParams.grade !== 'all') {
    query = query.eq('grade', searchParams.grade);
  }

  // Fetch available resources
  const { data: resources } = await query;

  // Get the current type for header text
  const currentType = resourceTypes.find(t => t.value === searchParams.type)?.label || 'Learning Resources';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -left-[10%] -top-[40%] w-[60%] h-[60%] rounded-full bg-blue-100/20 blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/20 blur-3xl" />
        </div>
        
        <div className="container relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              {currentType}
            </h1>
            <p className="text-lg text-slate-600">
              Access your study materials and track your learning progress
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-y bg-white/50 backdrop-blur-sm sticky top-16 z-10">
        <div className="container py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Select defaultValue={searchParams.type || 'all'}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Resource Type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue={searchParams.subject || 'all'}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Subject" />
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
              <Select defaultValue={searchParams.grade || 'all'}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Grade" />
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
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-6">
            {resources && resources.length > 0 ? (
              resources.map((resource) => {
                const ResourceIcon = resourceTypes.find(t => t.value === resource.type)?.icon || BookOpen;
                
                return (
                  <Card
                    key={resource.id}
                    className="group relative overflow-hidden border-2 border-slate-100 hover:border-blue-100 transition-all duration-300"
                  >
                    {/* Resource Type Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                      {resourceTypes.find(t => t.value === resource.type)?.label || resource.type}
                    </div>

                    <CardHeader className="space-y-4">
                      <div className="flex items-start gap-4">
                        {/* Resource Icon */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 group-hover:from-blue-100 group-hover:to-emerald-100 transition-colors">
                          <ResourceIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <CardTitle className="text-xl font-semibold text-slate-900 line-clamp-2">
                            {resource.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {resource.grade}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {resource.subject}
                            </span>
                          </div>
                        </div>
                      </div>

                      <CardDescription className="text-slate-600">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Download className="h-4 w-4" />
                                  <span>{resource.download_count || 0} downloads</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Number of downloads</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Star className="h-4 w-4 text-yellow-400" />
                                  <span>{resource.rating || 4.5} rating</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Average user rating</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Clock className="h-4 w-4" />
                                  <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Upload date</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <FileText className="h-4 w-4" />
                          <span>{resource.file_size} • {resource.file_type}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              window.open(resource.preview_url, '_blank')
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href)
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                        </div>

                        <Button 
                          size="sm"
                          className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                          asChild
                        >
                          <a href={`/api/resources/download/${resource.id}`} download>
                            <Download className="h-4 w-4" />
                            Download Now
                          </a>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No resources found</h3>
                <p className="text-slate-600">
                  Try adjusting your filters or check back later for new resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
} 