"use client"

import { Row } from "@tanstack/react-table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ExpandableRowProps<TData> {
  row: Row<TData>
}

export function ExpandableRow<TData>({ row }: ExpandableRowProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const data = row.original as any

  const renderValue = (key: string, value: any) => {
    // Handle document URLs
    if (key === "idProofUrl") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={(e) => {
            e.stopPropagation()
            window.open(value, "_blank")
          }}
        >
          View ID Proof <ExternalLink className="ml-2 size-4" />
        </Button>
      )
    }
    
    if (key === "qualificationCertificatesUrl" && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((url, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                window.open(url, "_blank")
              }}
            >
              Certificate {index + 1} <ExternalLink className="ml-2 size-4" />
            </Button>
          ))}
        </div>
      )
    }

    // Handle arrays (subjects, customSubjects, availability)
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      )
    }

    // Handle dates
    if (value instanceof Date) {
      return value.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Handle enums (gender, teachingMode)
    if (key === "gender" || key === "teachingMode" || key === "learningMode") {
      return (
        <Badge variant="outline">
          {value.toString().replace(/_/g, ' ')}
        </Badge>
      )
    }

    // Handle hourlyRate
    if (key === "hourlyRate") {
      return `₹${value}`
    }

    // Handle other types
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"
    }
    return value?.toString() || "N/A"
  }

  // Order of fields in the expanded view
  const tutorFields = [
    "name",
    "email",
    "gender",
    "dateOfBirth",
    "subjects",
    "customSubjects",
    "qualification",
    "experience",
    "teachingMode",
    "location",
    "availability",
    "hourlyRate",
    "bio",
    "idProofUrl",
    "qualificationCertificatesUrl",
  ]

  const studentFields = [
    "fullName",
    "email",
    "contactNumber",
    "address",
    "grade",
    "subjects",
    "learningMode",
    "location",
    "learningGoals",
    "parentName",
    "parentPhone",
    "createdAt",
    "updatedAt",
  ]

  // Determine if it's a tutor or student based on fields
  const fieldOrder = data.hasOwnProperty('teachingMode') ? tutorFields : studentFields

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <tr
            className={`cursor-pointer hover:bg-muted/50 ${
              isOpen ? "bg-muted/50" : ""
            }`}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-4">
                {typeof cell.column.columnDef.cell === 'function'
                  ? cell.column.columnDef.cell(cell.getContext())
                  : renderValue(cell.column.id, cell.getValue())}
              </td>
            ))}
          </tr>
        </SheetTrigger>
        <SheetContent className="w-[90%] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>
              {data.name || data.fullName || "Details"}
            </SheetTitle>
            <SheetDescription>Complete information</SheetDescription>
          </SheetHeader>
          <ScrollArea className="mt-8 h-[calc(100vh-200px)]">
            <div className="space-y-6">
              {fieldOrder.map((key) => {
                if (!data.hasOwnProperty(key)) return null
                return (
                  <div key={key} className="flex flex-col space-y-1">
                    <label className="text-sm font-medium capitalize text-muted-foreground">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <div className="text-sm">{renderValue(key, data[key])}</div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
