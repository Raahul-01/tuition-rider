'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Search,
  Calendar,
  Loader2,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Users,
  GraduationCap,
  Download,
} from "lucide-react"
import { format } from "date-fns"
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from "@/app/actions/server/contact"

type SubmissionType = 'parent' | 'tutor'
type Status = 'new' | 'in_progress' | 'completed' | 'rejected'

interface BaseSubmission {
  id: string
  status: Status
  created_at: string
  city: string
}

interface ParentSubmission extends BaseSubmission {
  type: 'parent'
  parentName: string
  phoneNumber: string
  studentDetails: string
  schoolName: string
  previousMarks: string
  subjects: string
  preferredTimeSlot: string
  sessionsPerWeek: string
  classMode: string
}

interface TutorSubmission extends BaseSubmission {
  type: 'tutor'
  name: string
  email: string
  phone: string
  age: string
  qualification: string
  subjects: string
  hasTeachingExperience: string
  maxClassLevel: string
  state: string
}

type Submission = ParentSubmission | TutorSubmission

const statusColors = {
  new: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  rejected: "bg-red-500",
}

export default function ContactSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<SubmissionType>('parent')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: '',
  })

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      const data = await getSubmissions(activeTab, filters)
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Failed to load submissions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [activeTab, filters])

  const handleStatusUpdate = async (id: string, status: Status) => {
    try {
      const result = await updateSubmissionStatus(activeTab, id, status)
      if (result.success) {
        toast.success('Status updated successfully')
        fetchSubmissions()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    try {
      const result = await deleteSubmission(activeTab, id)
      if (result.success) {
        toast.success('Submission deleted successfully')
        fetchSubmissions()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast.error('Failed to delete submission')
    }
  }

  const handleExportToCSV = () => {
    try {
      const exportData = submissions.map(submission => {
        if (activeTab === 'parent' && 'parentName' in submission) {
          const parentSubmission = submission as ParentSubmission
          return {
            'Parent Name': parentSubmission.parentName,
            'Phone Number': parentSubmission.phoneNumber,
            'Student Details': parentSubmission.studentDetails,
            'School Name': parentSubmission.schoolName,
            'Previous Marks': parentSubmission.previousMarks,
            'Subjects': parentSubmission.subjects,
            'Time Slot': parentSubmission.preferredTimeSlot,
            'Sessions/Week': parentSubmission.sessionsPerWeek,
            'Class Mode': parentSubmission.classMode,
            'City': parentSubmission.city,
            'Status': parentSubmission.status,
            'Submitted On': format(new Date(parentSubmission.created_at), 'PPP')
          }
        } else if (activeTab === 'tutor' && 'name' in submission) {
          const tutorSubmission = submission as TutorSubmission
          return {
            'Name': tutorSubmission.name,
            'Email': tutorSubmission.email,
            'Phone': tutorSubmission.phone,
            'Age': tutorSubmission.age,
            'Qualification': tutorSubmission.qualification,
            'Subjects': tutorSubmission.subjects,
            'Teaching Experience': tutorSubmission.hasTeachingExperience,
            'Max Class Level': tutorSubmission.maxClassLevel,
            'City': tutorSubmission.city,
            'State': tutorSubmission.state,
            'Status': tutorSubmission.status,
            'Submitted On': format(new Date(tutorSubmission.created_at), 'PPP')
          }
        }
        return {}
      }).filter(data => Object.keys(data).length > 0)

      if (exportData.length === 0) {
        toast.error('No data to export')
        return
      }

      // Convert to CSV
      const headers = Object.keys(exportData[0])
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => 
            JSON.stringify((row as Record<string, any>)[header] || '')
          ).join(',')
        )
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const fileName = `${activeTab}_submissions_${format(new Date(), 'yyyy-MM-dd')}.csv`
      
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Successfully exported to CSV')
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      toast.error('Failed to export data')
    }
  }

  const renderSubmissionDetails = (submission: Submission) => {
    if (submission.type === 'parent') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold mb-2">Student Information</h4>
            <p className="text-sm">Details: {submission.studentDetails}</p>
            <p className="text-sm">School: {submission.schoolName}</p>
            <p className="text-sm">Previous Marks: {submission.previousMarks}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Requirements</h4>
            <p className="text-sm">Subjects: {submission.subjects}</p>
            <p className="text-sm">Time Slot: {submission.preferredTimeSlot}</p>
            <p className="text-sm">Sessions/Week: {submission.sessionsPerWeek}</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <p className="text-sm">Email: {submission.email}</p>
            <p className="text-sm">Phone: {submission.phone}</p>
            <p className="text-sm">Location: {submission.city}, {submission.state}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Teaching Details</h4>
            <p className="text-sm">Subjects: {submission.subjects}</p>
            <p className="text-sm">Experience: {submission.hasTeachingExperience}</p>
            <p className="text-sm">Max Class: {submission.maxClassLevel}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact Submissions</h1>
          <p className="text-sm text-muted-foreground">
            Manage parent enquiries and tutor applications
          </p>
        </div>
        <Button
          onClick={handleExportToCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SubmissionType)}>
        <TabsList className="mb-4">
          <TabsTrigger value="parent" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Parent Enquiries
          </TabsTrigger>
          <TabsTrigger value="tutor" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Tutor Applications
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Input
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : submissions.length > 0 ? (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>
                      {submission.type === 'parent' ? submission.parentName : submission.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(submission.created_at), 'PPP')}
                      </span>
                      <Badge 
                        variant="secondary"
                        className={statusColors[submission.status as Status]}
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={submission.status}
                      onValueChange={(value) => handleStatusUpdate(submission.id, value as Status)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            New
                          </div>
                        </SelectItem>
                        <SelectItem value="in_progress">
                          <div className="flex items-center gap-2">
                            <RefreshCcw className="h-4 w-4" />
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Rejected
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(submission.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderSubmissionDetails(submission)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              {activeTab === 'parent' ? (
                <Users className="h-6 w-6" />
              ) : (
                <GraduationCap className="h-6 w-6" />
              )}
            </div>
            <h3 className="text-lg font-semibold">No Submissions Found</h3>
            <p className="text-muted-foreground mt-1">
              {filters.search || filters.status || filters.startDate || filters.endDate
                ? 'Try adjusting your filters'
                : 'No submissions have been received yet'}
            </p>
          </div>
        )}
      </Tabs>
    </div>
  )
} 