"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { TeachingMode } from "@prisma/client"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  isTutor?: boolean
}

const teachingModes = Object.values(TeachingMode).map(mode => ({
  label: mode.replace(/_/g, ' '),
  value: mode,
}))

const grades = [
  "1st", "2nd", "3rd", "4th", "5th",
  "6th", "7th", "8th", "9th", "10th",
  "11th", "12th",
]

const subjects = [
  "Mathematics",
  "Science",
  "Social Studies",
  "Computer Science",
  "English",
]

export function DataTableToolbar<TData>({
  table,
  isTutor = false,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn(isTutor ? "name" : "fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(isTutor ? "name" : "fullName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* Mode Filter */}
        {table.getColumn("learningMode" as any) && (
          <DataTableFacetedFilter
            column={table.getColumn("learningMode" as any)}
            title="Mode"
            options={teachingModes}
          />
        )}
        {/* Grade Filter - Only for Students */}
        {!isTutor && table.getColumn("grade") && (
          <DataTableFacetedFilter
            column={table.getColumn("grade")}
            title="Grade"
            options={grades.map(grade => ({
              label: grade,
              value: grade,
            }))}
          />
        )}
        {/* Subjects Filter */}
        {table.getColumn("subjects") && (
          <DataTableFacetedFilter
            column={table.getColumn("subjects")}
            title="Subjects"
            options={subjects.map(subject => ({
              label: subject,
              value: subject,
            }))}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
