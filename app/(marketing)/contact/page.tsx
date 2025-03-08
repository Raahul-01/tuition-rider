"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, GraduationCap, ArrowRight, MapPin, Phone, Mail, Clock, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { toast } from "sonner"
import { submitParentForm, submitTutorForm } from "@/app/actions/server/contact"
import { Logo } from "@/components/shared/logo"

export default function ContactPage() {
  const [activeForm, setActiveForm] = useState<'parent' | 'tutor'>('parent')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [parentFormData, setParentFormData] = useState({
    // Parent Information
    parentName: "",
    parentOccupation: "",
    phoneNumber: "",
    discountCode: "",
    
    // Student Information
    studentDetails: "",  // Name with class
    schoolName: "",
    previousMarks: "",
    
    // Tutoring Requirements
    subjects: "",
    challenges: "",
    preferredTimeSlot: "",
    sessionsPerWeek: "",
    classMode: "offline", // online/offline
    tutorGenderPreference: "",
    tutorGoals: "",
    
    // Location Information
    address: "",
    city: "",
  })

  const [tutorFormData, setTutorFormData] = useState({
    // Personal Information
    name: "",
    age: "",
    phone: "",
    email: "",
    currentOccupation: "",
    
    // Academic Information
    tenthPercentage: "",
    tenthBoard: "",
    twelfthPercentage: "",
    twelfthBoard: "",
    qualification: "",
    
    // Teaching Experience
    hasTeachingExperience: "no",
    hasSchoolExperience: "no",
    maxClassLevel: "",
    subjects: "",
    teachingPreference: "",
    
    // Location Information
    currentAddress: "",
    city: "",
    state: "",
    
    // Additional Information
    message: "",
  })

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      console.log('Submitting parent form data:', parentFormData)
      const result = await submitParentForm(parentFormData)
      console.log('Parent form submission result:', result)
      if (result.success) {
        toast.success('Thank you for your enquiry! We will contact you soon.')
        // Reset form
        setParentFormData({
          parentName: "",
          parentOccupation: "",
          phoneNumber: "",
          discountCode: "",
          studentDetails: "",
          schoolName: "",
          previousMarks: "",
          subjects: "",
          challenges: "",
          preferredTimeSlot: "",
          sessionsPerWeek: "",
          classMode: "offline",
          tutorGenderPreference: "",
          tutorGoals: "",
          address: "",
          city: "",
        })
      } else {
        console.error('Parent form submission failed:', result.error)
        toast.error(result.error || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      console.error('Parent form submission error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      console.log('Submitting tutor form data:', tutorFormData)
      const result = await submitTutorForm(tutorFormData)
      console.log('Tutor form submission result:', result)
      if (result.success) {
        toast.success('Thank you for your application! We will contact you soon.')
        // Reset form
        setTutorFormData({
          name: "",
          age: "",
          phone: "",
          email: "",
          currentOccupation: "",
          tenthPercentage: "",
          tenthBoard: "",
          twelfthPercentage: "",
          twelfthBoard: "",
          qualification: "",
          hasTeachingExperience: "no",
          hasSchoolExperience: "no",
          maxClassLevel: "",
          subjects: "",
          teachingPreference: "",
          currentAddress: "",
          city: "",
          state: "",
          message: "",
        })
      } else {
        console.error('Tutor form submission failed:', result.error)
        toast.error(result.error || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      console.error('Tutor form submission error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 py-16 md:py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-[10%] -top-[40%] w-[60%] h-[60%] rounded-full bg-blue-100/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-100/20 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
          </div>
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Decorative Elements */}
            <div className="relative mb-8 inline-block">
              <div className="absolute -left-8 -top-8 animate-bounce">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="absolute -right-8 -top-8 animate-bounce delay-100">
                <MessageCircle className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
                Get in Touch
              </h1>
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 bg-gradient-to-r from-blue-600/20 to-emerald-600/20" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-lg text-slate-600 md:text-xl"
            >
              Whether you&apos;re looking for a tutor or want to join our team, we&apos;re here to help.
            </motion.p>
          </div>
        </div>

        {/* Curved border overlay */}
        <div className="absolute inset-x-0 bottom-0">
          <svg className="w-full text-white" style={{ height: '120px' }} viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Toggle Buttons */}
            <div className="mb-8 flex justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setActiveForm('parent')}
                className={`group relative ${
                  activeForm === 'parent'
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                    : 'bg-white text-slate-600 hover:text-blue-600'
                }`}
              >
                <Users className="mr-2 size-5" />
                For Parents & Students
                {activeForm === 'parent' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600"
                  />
                )}
              </Button>
              <Button
                size="lg"
                onClick={() => setActiveForm('tutor')}
                className={`group relative ${
                  activeForm === 'tutor'
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                    : 'bg-white text-slate-600 hover:text-emerald-600'
                }`}
              >
                <Logo className="mr-2 size-5" />
                For Tutors
                {activeForm === 'tutor' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600"
                  />
                )}
              </Button>
            </div>

            {/* Forms Container */}
            <div className="relative min-h-[600px]">
              {/* Parent Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: activeForm === 'parent' ? 1 : 0,
                  x: activeForm === 'parent' ? 0 : -20,
                  display: activeForm === 'parent' ? 'block' : 'none'
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border border-white/50 bg-white/80 p-6 backdrop-blur-lg md:p-8">
                  <form onSubmit={handleParentSubmit} className="space-y-6">
                    {/* Parent Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Parent Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        type="text"
                          placeholder="Parent's Name"
                          value={parentFormData.parentName}
                          onChange={(e) => setParentFormData({ ...parentFormData, parentName: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="text"
                          placeholder="Parent's Occupation"
                          value={parentFormData.parentOccupation}
                          onChange={(e) => setParentFormData({ ...parentFormData, parentOccupation: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={parentFormData.phoneNumber}
                        onChange={(e) => setParentFormData({ ...parentFormData, phoneNumber: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="text"
                          placeholder="Discount Voucher Code (if any)"
                          value={parentFormData.discountCode}
                          onChange={(e) => setParentFormData({ ...parentFormData, discountCode: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        />
                      </div>
                    </div>

                    {/* Student Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Student Information</h3>
                      <div className="grid gap-4">
                        <Textarea
                          placeholder="Child's Name(s) with Class (e.g., John - Class 8, Mary - Class 5)"
                          value={parentFormData.studentDetails}
                          onChange={(e) => setParentFormData({ ...parentFormData, studentDetails: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                      <Input
                        type="text"
                          placeholder="School Name"
                          value={parentFormData.schoolName}
                          onChange={(e) => setParentFormData({ ...parentFormData, schoolName: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="text"
                          placeholder="Previous Class Marks"
                          value={parentFormData.previousMarks}
                          onChange={(e) => setParentFormData({ ...parentFormData, previousMarks: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      </div>
                    </div>

                    {/* Tutoring Requirements Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Tutoring Requirements</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        type="text"
                          placeholder="Subjects Required"
                          value={parentFormData.subjects}
                          onChange={(e) => setParentFormData({ ...parentFormData, subjects: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Textarea
                          placeholder="Subject-specific Challenges"
                          value={parentFormData.challenges}
                          onChange={(e) => setParentFormData({ ...parentFormData, challenges: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Preferred Time Slot"
                          value={parentFormData.preferredTimeSlot}
                          onChange={(e) => setParentFormData({ ...parentFormData, preferredTimeSlot: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Sessions Per Week"
                          value={parentFormData.sessionsPerWeek}
                          onChange={(e) => setParentFormData({ ...parentFormData, sessionsPerWeek: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <div className="space-y-2">
                          <label className="text-sm text-slate-700">Class Mode Preference</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="classMode"
                                value="online"
                                checked={parentFormData.classMode === "online"}
                                onChange={(e) => setParentFormData({ ...parentFormData, classMode: e.target.value })}
                              />
                              Online
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="classMode"
                                value="offline"
                                checked={parentFormData.classMode === "offline"}
                                onChange={(e) => setParentFormData({ ...parentFormData, classMode: e.target.value })}
                              />
                              Offline
                            </label>
                          </div>
                        </div>
                        <Input
                          type="text"
                          placeholder="Tutor Gender Preference"
                          value={parentFormData.tutorGenderPreference}
                          onChange={(e) => setParentFormData({ ...parentFormData, tutorGenderPreference: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        />
                        <Textarea
                          placeholder="Specific Goals (e.g., exam preparation, homework help)"
                          value={parentFormData.tutorGoals}
                          onChange={(e) => setParentFormData({ ...parentFormData, tutorGoals: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Location Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                    <Textarea
                          placeholder="Complete Address"
                          value={parentFormData.address}
                          onChange={(e) => setParentFormData({ ...parentFormData, address: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="text"
                          placeholder="City"
                          value={parentFormData.city}
                          onChange={(e) => setParentFormData({ ...parentFormData, city: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="group w-full bg-gradient-to-r from-blue-600 to-emerald-600 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-emerald-700"
                    >
                      Submit Enquiry
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Tutor Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: activeForm === 'tutor' ? 1 : 0,
                  x: activeForm === 'tutor' ? 0 : 20,
                  display: activeForm === 'tutor' ? 'block' : 'none'
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border border-white/50 bg-white/80 p-6 backdrop-blur-lg md:p-8">
                  <form onSubmit={handleTutorSubmit} className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={tutorFormData.name}
                        onChange={(e) => setTutorFormData({ ...tutorFormData, name: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Age"
                          value={tutorFormData.age}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, age: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="tel"
                          placeholder="Phone Number"
                          value={tutorFormData.phone}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, phone: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={tutorFormData.email}
                        onChange={(e) => setTutorFormData({ ...tutorFormData, email: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="text"
                          placeholder="Current Occupation/Department"
                          value={tutorFormData.currentOccupation}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, currentOccupation: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Academic Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          type="number"
                          placeholder="10th Percentage"
                          value={tutorFormData.tenthPercentage}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, tenthPercentage: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="text"
                          placeholder="10th Board (CBSE/ICSE/State)"
                          value={tutorFormData.tenthBoard}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, tenthBoard: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="number"
                          placeholder="12th Percentage"
                          value={tutorFormData.twelfthPercentage}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, twelfthPercentage: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                      <Input
                          type="text"
                          placeholder="12th Board (CBSE/ICSE/State)"
                          value={tutorFormData.twelfthBoard}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, twelfthBoard: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Highest Qualification"
                        value={tutorFormData.qualification}
                        onChange={(e) => setTutorFormData({ ...tutorFormData, qualification: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                    </div>
                    </div>

                    {/* Teaching Experience Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Teaching Experience</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm text-slate-700">Do you have teaching experience?</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="teachingExp"
                                value="yes"
                                checked={tutorFormData.hasTeachingExperience === "yes"}
                                onChange={(e) => setTutorFormData({ ...tutorFormData, hasTeachingExperience: e.target.value })}
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="teachingExp"
                                value="no"
                                checked={tutorFormData.hasTeachingExperience === "no"}
                                onChange={(e) => setTutorFormData({ ...tutorFormData, hasTeachingExperience: e.target.value })}
                              />
                              No
                            </label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-slate-700">Do you have school teaching experience?</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="schoolExp"
                                value="yes"
                                checked={tutorFormData.hasSchoolExperience === "yes"}
                                onChange={(e) => setTutorFormData({ ...tutorFormData, hasSchoolExperience: e.target.value })}
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="schoolExp"
                                value="no"
                                checked={tutorFormData.hasSchoolExperience === "no"}
                                onChange={(e) => setTutorFormData({ ...tutorFormData, hasSchoolExperience: e.target.value })}
                              />
                              No
                            </label>
                          </div>
                        </div>
                      <Input
                        type="text"
                          placeholder="Maximum Class Level You Can Teach"
                          value={tutorFormData.maxClassLevel}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, maxClassLevel: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Subjects You Can Teach"
                        value={tutorFormData.subjects}
                        onChange={(e) => setTutorFormData({ ...tutorFormData, subjects: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <Input
                          type="text"
                          placeholder="Teaching Preference (Online/Offline/Both)"
                          value={tutorFormData.teachingPreference}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, teachingPreference: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                        required
                      />
                      </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Location Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Textarea
                          placeholder="Current Address"
                          value={tutorFormData.currentAddress}
                          onChange={(e) => setTutorFormData({ ...tutorFormData, currentAddress: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                          required
                        />
                        <div className="grid gap-4">
                          <Input
                            type="text"
                            placeholder="City"
                            value={tutorFormData.city}
                            onChange={(e) => setTutorFormData({ ...tutorFormData, city: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                            required
                          />
                    <Input
                      type="text"
                            placeholder="State"
                            value={tutorFormData.state}
                            onChange={(e) => setTutorFormData({ ...tutorFormData, state: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                      required
                    />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>
                    <Textarea
                      placeholder="Tell us about yourself and your teaching approach"
                      value={tutorFormData.message}
                      onChange={(e) => setTutorFormData({ ...tutorFormData, message: e.target.value })}
                        className="h-32 w-full rounded-lg border border-slate-200 bg-white/80 px-4 py-3"
                    />
                    </div>

                    <Button
                      type="submit"
                      className="group w-full bg-gradient-to-r from-blue-600 to-emerald-600 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-emerald-700"
                    >
                      Apply as Tutor
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  )
} 