import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

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

const resourceTypes = [
  { value: 'notes', label: 'Study Notes' },
  { value: 'pyq', label: 'Previous Year Questions' },
  { value: 'materials', label: 'Study Materials' },
];

export default async function EditResource({
  params
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect("/dashboard");
  }

  // Fetch resource data
  const { data: resource } = await supabase
    .from('resources')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!resource) {
    redirect("/admin/resources");
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Edit Resource</h1>
          <p className="text-muted-foreground mt-2">Update resource details</p>
        </div>
        <Link href="/admin/resources">
          <Button variant="outline">Back to Resources</Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <form action={`/api/resources/${params.id}`} method="POST" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              defaultValue={resource.title}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Resource Type</Label>
            <Select name="type" defaultValue={resource.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select name="subject" defaultValue={resource.subject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade Level</Label>
            <Select name="grade" defaultValue={resource.grade}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={resource.description}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Replace File (Optional)</Label>
            <Input
              id="file"
              name="file"
              type="file"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Update Resource
            </Button>
            <Link href="/admin/resources">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
} 