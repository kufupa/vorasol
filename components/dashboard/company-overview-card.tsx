"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Company } from "@/lib/types"
import { Users, UserCheck, UserX, Percent, MoreVertical } from "lucide-react"

interface CompanyOverviewCardProps {
  company: Company
  onEdit: (company: Company) => void
  onRemove: (companyId: string) => void
}

export default function CompanyOverviewCard({ company, onEdit, onRemove }: CompanyOverviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl">{company.name}</CardTitle>
          <CardDescription>Fleet Partner Overview</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(company)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRemove(company.id)} className="text-red-500">
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Percent className="mr-2 h-4 w-4" />
            Presence Rate
          </div>
          <span className="font-semibold">{company.presentPercentage}%</span>
        </div>
        <Progress
          value={company.presentPercentage}
          aria-label={`${company.presentPercentage}% present`}
          className="h-2"
        />

        <div className="grid grid-cols-2 gap-2 text-sm pt-2">
          <div className="flex items-center">
            <UserCheck className="mr-2 h-4 w-4 text-green-500" />
            <span>Present: {company.presentCount}</span>
          </div>
          <div className="flex items-center">
            <UserX className="mr-2 h-4 w-4 text-red-500" />
            <span>Absent: {company.absentCount}</span>
          </div>
          <div className="flex items-center col-span-2">
            <Users className="mr-2 h-4 w-4 text-sky-500" />
            <span>Total Drivers: {company.totalDrivers}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
