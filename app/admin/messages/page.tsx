'use client'

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  MessageSquare,
  Loader2,
  Trash2,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  GraduationCap,
  Download
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ParentSubmission {
  id: string
  parent_name: string
  parent_occupation: string
  phone_number: string
  discount_code?: string
  student_details: string
  school_name: string
  previous_marks: string
  subjects: string
  challenges: string
  preferred_time_slot: string
  sessions_per_week: string
  class_mode: string
  tutor_gender_preference: string
  tutor_goals: string
  address: string
  city: string
  status: 'new' | 'in_progress' | 'completed'
  created_at: string
}

interface TutorSubmission {
  id: string
  name: string
  age: string
  phone: string
  email: string
  current_occupation: string
  tenth_percentage: string
  tenth_board: string
  twelfth_percentage: string
  twelfth_board: string
  qualification: string
  has_teaching_experience: string
  has_school_experience: string
  max_class_level: string
  subjects: string
  teaching_preference: string
  current_address: string
  city: string
  state: string
  message: string
  status: 'new' | 'in_progress' | 'completed'
  created_at: string
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'parent' | 'tutor'>('parent')
  const [submissions, setSubmissions] = useState<(ParentSubmission | TutorSubmission)[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    city: '',
    subjects: '',
    search: '',
    classMode: 'all',
    schoolName: '',
    qualification: '',
    state: '',
    dateRange: {
      start: '',
      end: ''
    }
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchSubmissions()
  }, [activeTab, filters])

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching submissions for:', activeTab)
      const table = activeTab === 'parent' ? 'parent_submissions' : 'tutor_submissions'
      
      let query = supabase
        .from(table)
        .select('*')

      // Apply common filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }
      if (filters.subjects) {
        query = query.ilike('subjects', `%${filters.subjects}%`)
      }

      // Parent-specific filters
      if (activeTab === 'parent') {
        if (filters.classMode && filters.classMode !== 'all') {
          query = query.eq('class_mode', filters.classMode)
        }
        if (filters.schoolName) {
          query = query.ilike('school_name', `%${filters.schoolName}%`)
        }
        if (filters.search) {
          query = query.or(`parent_name.ilike.%${filters.search}%,student_details.ilike.%${filters.search}%,school_name.ilike.%${filters.search}%`)
        }
      }

      // Tutor-specific filters
      if (activeTab === 'tutor') {
        if (filters.qualification) {
          query = query.ilike('qualification', `%${filters.qualification}%`)
        }
        if (filters.state) {
          query = query.ilike('state', `%${filters.state}%`)
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,qualification.ilike.%${filters.search}%,subjects.ilike.%${filters.search}%`)
        }
      }

      // Date range filter
      if (filters.dateRange.start) {
        query = query.gte('created_at', filters.dateRange.start)
      }
      if (filters.dateRange.end) {
        query = query.lte('created_at', filters.dateRange.end)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('Fetched submissions:', data)
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Failed to load submissions. Please check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      city: '',
      subjects: '',
      search: '',
      classMode: 'all',
      schoolName: '',
      qualification: '',
      state: '',
      dateRange: {
        start: '',
        end: ''
      }
    })
  }

  const handleUpdateStatus = async (id: string, status: 'in_progress' | 'completed') => {
    try {
      const table = activeTab === 'parent' ? 'parent_submissions' : 'tutor_submissions'
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ))

      toast.success('Status updated successfully')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const table = activeTab === 'parent' ? 'parent_submissions' : 'tutor_submissions'
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      setSubmissions(submissions.filter(sub => sub.id !== id))
      toast.success('Submission deleted successfully')
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast.error('Failed to delete submission')
    }
  }

  const handleExportToExcel = () => {
    try {
      // Convert submissions to CSV format
      const headers = activeTab === 'parent' 
        ? ['Parent Name', 'Occupation', 'Phone', 'Student Details', 'School', 'Previous Marks', 
           'Subjects', 'Challenges', 'Time Slot', 'Sessions/Week', 'Class Mode', 
           'Tutor Preference', 'Goals', 'Address', 'City', 'Status', 'Created At']
        : ['Name', 'Age', 'Phone', 'Email', 'Occupation', '10th %', '10th Board', 
           '12th %', '12th Board', 'Qualification', 'Teaching Experience', 
           'School Experience', 'Max Class Level', 'Subjects', 'Teaching Preference', 
           'Address', 'City', 'State', 'Message', 'Status', 'Created At'];

      const csvContent = submissions.map(submission => {
        if ('parent_name' in submission) {
          return [
            submission.parent_name,
            submission.parent_occupation,
            submission.phone_number,
            submission.student_details,
            submission.school_name,
            submission.previous_marks,
            submission.subjects,
            submission.challenges,
            submission.preferred_time_slot,
            submission.sessions_per_week,
            submission.class_mode,
            submission.tutor_gender_preference,
            submission.tutor_goals,
            submission.address,
            submission.city,
            submission.status,
            new Date(submission.created_at).toLocaleDateString()
          ].join(',');
        } else {
          return [
            submission.name,
            submission.age,
            submission.phone,
            submission.email,
            submission.current_occupation,
            submission.tenth_percentage,
            submission.tenth_board,
            submission.twelfth_percentage,
            submission.twelfth_board,
            submission.qualification,
            submission.has_teaching_experience,
            submission.has_school_experience,
            submission.max_class_level,
            submission.subjects,
            submission.teaching_preference,
            submission.current_address,
            submission.city,
            submission.state,
            submission.message,
            submission.status,
            new Date(submission.created_at).toLocaleDateString()
          ].join(',');
        }
      });

      const csv = [headers.join(','), ...csvContent].join('\n');
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab}_submissions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact Submissions</h1>
          <p className="text-sm text-muted-foreground">
            Manage parent and tutor inquiries
          </p>
        </div>
        <Button onClick={handleExportToExcel} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <Tabs defaultValue="parent" className="space-y-4" onValueChange={(value) => setActiveTab(value as 'parent' | 'tutor')}>
        <TabsList>
          <TabsTrigger value="parent" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Parent Inquiries
          </TabsTrigger>
          <TabsTrigger value="tutor" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Tutor Applications
          </TabsTrigger>
        </TabsList>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Common Filters */}
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder={activeTab === 'parent' ? "Search by parent name or student details..." : "Search by tutor name or qualification..."}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Filter by city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Subjects</Label>
                <Input
                  placeholder="Filter by subjects"
                  value={filters.subjects}
                  onChange={(e) => handleFilterChange('subjects', e.target.value)}
                />
              </div>

              {/* Parent-specific filters */}
              {activeTab === 'parent' && (
                <>
                  <div className="space-y-2">
                    <Label>Class Mode</Label>
                    <Select
                      value={filters.classMode}
                      onValueChange={(value) => handleFilterChange('classMode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by class mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input
                      placeholder="Filter by school name"
                      value={filters.schoolName}
                      onChange={(e) => handleFilterChange('schoolName', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Tutor-specific filters */}
              {activeTab === 'tutor' && (
                <>
                  <div className="space-y-2">
                    <Label>Qualification</Label>
                    <Input
                      placeholder="Filter by qualification"
                      value={filters.qualification}
                      onChange={(e) => handleFilterChange('qualification', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      placeholder="Filter by state"
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Date Range */}
              <div className="space-y-2 lg:col-span-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="parent">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-muted-foreground">Loading parent inquiries...</p>
            </div>
          ) : submissions.length > 0 ? (
            <div className="grid gap-4">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {'parent_name' in submission ? submission.parent_name : ''}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(submission.id, submission.status === 'new' ? 'in_progress' : 'completed')}
                        >
                          {submission.status === 'new' ? 'Mark In Progress' : 'Mark Complete'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(submission.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {'parent_name' in submission && (
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-semibold mb-2">Contact Information</h4>
                            <div className="space-y-2">
                              <p className="text-sm flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Occupation: {submission.parent_occupation}
                              </p>
                              <p className="text-sm flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {submission.phone_number}
                              </p>
                              <p className="text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {submission.address}, {submission.city}
                              </p>
                              {submission.discount_code && (
                                <p className="text-sm">
                                  Discount Code: {submission.discount_code}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Student Details</h4>
                            <div className="space-y-2">
                              <p className="text-sm">{submission.student_details}</p>
                              <p className="text-sm">School: {submission.school_name}</p>
                              <p className="text-sm">Previous Marks: {submission.previous_marks}</p>
                              <p className="text-sm">Subjects: {submission.subjects}</p>
                              <p className="text-sm">Challenges: {submission.challenges}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Tutoring Preferences</h4>
                          <div className="space-y-2">
                            <p className="text-sm">Time Slot: {submission.preferred_time_slot}</p>
                            <p className="text-sm">Sessions per Week: {submission.sessions_per_week}</p>
                            <p className="text-sm">Class Mode: {submission.class_mode}</p>
                            <p className="text-sm">Tutor Gender Preference: {submission.tutor_gender_preference}</p>
                            <p className="text-sm">Goals: {submission.tutor_goals}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            Status: <span className="capitalize">{submission.status}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">No Parent Inquiries</h3>
              <p className="text-muted-foreground mt-1">
                There are no parent inquiries at the moment
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tutor">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="text-muted-foreground">Loading tutor applications...</p>
            </div>
          ) : submissions.length > 0 ? (
            <div className="grid gap-4">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {'name' in submission ? submission.name : ''}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(submission.id, submission.status === 'new' ? 'in_progress' : 'completed')}
                        >
                          {submission.status === 'new' ? 'Mark In Progress' : 'Mark Complete'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(submission.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {'name' in submission && (
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-semibold mb-2">Personal Information</h4>
                            <div className="space-y-2">
                              <p className="text-sm">Age: {submission.age}</p>
                              <p className="text-sm">Current Occupation: {submission.current_occupation}</p>
                              <p className="text-sm flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {submission.email}
                              </p>
                              <p className="text-sm flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {submission.phone}
                              </p>
                              <p className="text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {submission.current_address}, {submission.city}, {submission.state}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Academic Details</h4>
                            <div className="space-y-2">
                              <p className="text-sm">10th: {submission.tenth_percentage}% ({submission.tenth_board})</p>
                              <p className="text-sm">12th: {submission.twelfth_percentage}% ({submission.twelfth_board})</p>
                              <p className="text-sm">Qualification: {submission.qualification}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Teaching Experience</h4>
                          <div className="space-y-2">
                            <p className="text-sm">Teaching Experience: {submission.has_teaching_experience}</p>
                            <p className="text-sm">School Experience: {submission.has_school_experience}</p>
                            <p className="text-sm">Max Class Level: {submission.max_class_level}</p>
                            <p className="text-sm">Subjects: {submission.subjects}</p>
                            <p className="text-sm">Teaching Preference: {submission.teaching_preference}</p>
                            <p className="text-sm">Message: {submission.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            Status: <span className="capitalize">{submission.status}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">No Tutor Applications</h3>
              <p className="text-muted-foreground mt-1">
                There are no tutor applications at the moment
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 