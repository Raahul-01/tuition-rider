'use client'

import * as React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, FileText, BookOpen, GraduationCap, FileType, Loader2, AlertCircle, RefreshCcw, Search, Sparkles, Brain, ChevronLeft, ChevronRight } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Hindi',
  'Environmental Studies',
  'Computer Science',
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
  'Study Notes',
  'Previous Year Questions',
  'Study Materials',
  'Practice Worksheets',
  'Test Papers',
  'NCERT Solutions',
  'Sample Papers',
  'Chapter Notes',
  'Important Questions',
  'Revision Notes',
  'Holiday Homework'
] as const;

interface Resource {
  id: string
  title: string
  description: string
  subject: string
  grade: string
  type: string
  file_url: string
  created_at: string
}

const ITEMS_PER_PAGE = 9;
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  data: Resource[];
  timestamp: number;
}

const cache = new Map<string, CacheItem>();

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': 'bg-blue-100 text-blue-700',
      'Science': 'bg-green-100 text-green-700',
      'English': 'bg-purple-100 text-purple-700',
      'Social Studies': 'bg-orange-100 text-orange-700',
      'Hindi': 'bg-red-100 text-red-700',
      'Computer Science': 'bg-indigo-100 text-indigo-700'
    }
    return colors[subject] || 'bg-slate-100 text-slate-700'
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'notes': return Brain
      case 'previous-year-questions': return FileText
      case 'study-materials': return BookOpen
      default: return FileType
    }
  }

  const TypeIcon = getTypeIcon(resource.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group h-full"
    >
      <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn("px-2 py-1", getSubjectColor(resource.subject))}>
              {resource.subject}
            </Badge>
            <Badge variant="outline" className="bg-slate-100">
              Grade {resource.grade}
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 text-lg font-semibold text-slate-900">
            {resource.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="line-clamp-2 text-sm text-slate-600">
            {resource.description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <TypeIcon className="h-4 w-4" />
            <span className="capitalize">{resource.type.replace(/-/g, ' ')}</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t bg-slate-50/50 p-4">
          <span className="text-xs text-slate-500">
            Added {new Date(resource.created_at).toLocaleDateString()}
          </span>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white transition-all hover:from-blue-700 hover:to-emerald-700"
            onClick={() => window.open(resource.file_url, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

const ResourceSkeleton = () => (
  <Card className="group h-full border border-blue-100 bg-white/70 backdrop-blur-sm">
    <CardHeader className="space-y-2 pb-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-6 w-48" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardContent>
    <CardFooter className="flex items-center justify-between border-t bg-slate-50/50 p-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-24 rounded-md" />
    </CardFooter>
  </Card>
)

export default function ResourcesDownloadPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const subject = searchParams.get('subject')
  const grade = searchParams.get('grade')
  const type = searchParams.get('type')
  const search = searchParams.get('search')

  const subjectMap: Record<string, string> = {
    'mathematics': 'Mathematics',
    'science': 'Science',
    'english': 'English',
    'social-studies': 'Social Studies',
    'hindi': 'Hindi',
    'environmental-studies': 'Environmental Studies',
    'computer-science': 'Computer Science',
    'general-knowledge': 'General Knowledge',
    'art-craft': 'Art & Craft',
    'physical-education': 'Physical Education'
  }

  const typeMap: Record<string, string> = {
    'notes': 'Study Notes',
    'previous-year-questions': 'Previous Year Questions',
    'study-materials': 'Study Materials'
  }

  const getCacheKey = useCallback(() => {
    return `resources-${subject || ''}-${grade || ''}-${type || ''}-${search || ''}`;
  }, [subject, grade, type, search]);

  const fetchResources = useCallback(async () => {
    try {
      setError(null)
      
      // Check cache first
      const cacheKey = getCacheKey();
      const cachedData = cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
        setResources(cachedData.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true)

      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (subject) {
        const mappedSubject = subjectMap[subject] || subject;
        query = query.eq('subject', mappedSubject);
      }
      if (grade) {
        query = query.eq('grade', grade);
      }
      if (type) {
        const mappedType = typeMap[type] || type;
        query = query.eq('type', mappedType);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw new Error('No resources found');
      }

      // Cache the results
      cache.set(cacheKey, {
        data: data as Resource[],
        timestamp: Date.now()
      });

      setResources(data as Resource[]);
    } catch (error: any) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, [subject, grade, type, search, supabase, getCacheKey]);

  useEffect(() => {
    fetchResources();
    setCurrentPage(1); // Reset to first page when filters change
  }, [fetchResources]);

  // Pagination calculations
  const totalPages = Math.ceil(resources.length / ITEMS_PER_PAGE);
  const paginatedResources = resources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)
      const params = new URLSearchParams()

      const subject = formData.get('subject')
      const grade = formData.get('grade')
      const type = formData.get('type')
      const search = formData.get('search')

      if (subject && subject !== 'all') params.set('subject', subject.toString())
      if (grade && grade !== 'all') params.set('grade', grade.toString())
      if (type && type !== 'all') params.set('type', type.toString())
      if (search) params.set('search', search.toString())

      router.push(`/resources/download?${params.toString()}`)
    } catch (error) {
      console.error('Error applying filters:', error)
      toast.error('Failed to apply filters')
    }
  }

  const handleRetry = () => {
    fetchResources()
  }

  // Modify the ResourceCard component to handle downloads
  const handleDownload = async (resource: Resource) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error(
        <div className="flex flex-col gap-2">
          <p>Please sign in to download resources</p>
          <Button 
            onClick={() => router.push('/auth')}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
          >
            Sign In
          </Button>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    window.open(resource.file_url, '_blank');
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={handleRetry}
          className="mx-auto flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-20 md:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-[10%] -top-[40%] w-[60%] h-[60%] rounded-full bg-blue-100/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/20 blur-3xl animate-pulse" />
        </div>
        
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute -left-8 -top-8 animate-bounce">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="absolute -right-8 -top-8 animate-bounce delay-100">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6 md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Download Resources
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-8 md:text-xl">
              Access and download high-quality educational materials for all grades and subjects. Find study materials, worksheets, and more.
            </p>
          </motion.div>
        </MaxWidthWrapper>
      </section>

      <MaxWidthWrapper className="py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-12 border border-blue-100 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Search className="h-6 w-6 text-blue-600" />
                Find Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Input 
                      name="search"
                      placeholder="Search by title or description..." 
                      defaultValue={search ?? ''}
                      className="bg-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Select name="subject" defaultValue={subject ?? undefined}>
                      <SelectTrigger className="bg-white">
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
                  </div>

                  <div className="space-y-2">
                    <Select name="grade" defaultValue={grade ?? undefined}>
                      <SelectTrigger className="bg-white">
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

                  <div className="space-y-2">
                    <Select name="type" defaultValue={type ?? undefined}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Resource Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {resourceTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Resources
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resources List */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ResourceSkeleton />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : resources.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Available Resources</h2>
              <p className="text-sm text-slate-600">{resources.length} resources found</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">No Resources Found</h3>
            <p className="mb-6 max-w-md text-slate-600">
              We couldn't find any resources matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/resources/download')}
              className="border-blue-200 hover:bg-blue-50"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </motion.div>
        )}
      </MaxWidthWrapper>
    </div>
  )
} 