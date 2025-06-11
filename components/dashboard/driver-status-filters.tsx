"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Company, AttendanceStatusUnion } from "@/lib/types"
import { RotateCcw } from "lucide-react"

interface DriverStatusFiltersProps {
  companies: Company[]
  pocs: string[]
  currentFilters: { business: string; poc: string; status: string }
  onFilterChange: (filters: { business: string; poc: string; status: string }) => void
}

const attendanceStatuses: AttendanceStatusUnion[] = ["Present", "Absent", "Late", "Day Off", "Not Logged In"]

export default function DriverStatusFilters({
  companies,
  pocs,
  currentFilters,
  onFilterChange,
}: DriverStatusFiltersProps) {
  const handleFilterChange = (filterName: keyof typeof currentFilters, value: string) => {
    onFilterChange({ ...currentFilters, [filterName]: value })
  }

  const resetFilters = () => {
    onFilterChange({ business: "all", poc: "all", status: "all" })
  }

  return (
    <div className="mb-4 p-4 border rounded-lg bg-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <Label htmlFor="businessFilter" className="text-sm font-medium">
            Business (Client)
          </Label>
          <Select value={currentFilters.business} onValueChange={(value) => handleFilterChange("business", value)}>
            <SelectTrigger id="businessFilter">
              <SelectValue placeholder="All Businesses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="pocFilter" className="text-sm font-medium">
            Point of Contact (POC)
          </Label>
          <Select value={currentFilters.poc} onValueChange={(value) => handleFilterChange("poc", value)}>
            <SelectTrigger id="pocFilter">
              <SelectValue placeholder="All POCs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All POCs</SelectItem>
              {pocs.map((poc) => (
                <SelectItem key={poc} value={poc}>
                  {poc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="statusFilter" className="text-sm font-medium">
            Attendance Status
          </Label>
          <Select value={currentFilters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger id="statusFilter">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {attendanceStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Filters
        </Button>
      </div>
    </div>
  )
}
