"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AttendanceRecord } from "@/lib/types"
import { format } from "date-fns"
import { cn, getAttendanceBadgeVariant } from "@/lib/utils"
import { CalendarDays } from "lucide-react"

interface DailyAttendanceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  date: Date
  records: AttendanceRecord[]
  dailyAttendanceRate: string
}

export default function DailyAttendanceDialog({
  isOpen,
  onOpenChange,
  date,
  records,
  dailyAttendanceRate,
}: DailyAttendanceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Daily Attendance - {format(date, "MMMM d, yyyy")}</DialogTitle>
          <DialogDescription>Summary of driver attendance for the selected day.</DialogDescription>
        </DialogHeader>
        <div className="my-3">
          <p className="text-lg font-semibold">Attendance Rate: {dailyAttendanceRate}</p>
        </div>
        <ScrollArea className="h-[300px]">
          {records.length > 0 ? (
            <ul className="space-y-2">
              {records.map((record, index) => (
                <li
                  key={`${record.driverId}-${index}`}
                  className="flex justify-between items-center p-2 border rounded-md"
                >
                  <span>{record.driverName || record.driverId}</span>
                  <Badge variant="outline" className={cn("text-xs", getAttendanceBadgeVariant(record.status))}>
                    {record.status === "Day Off" && <CalendarDays className="mr-1 h-3 w-3" />}
                    {record.status}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No attendance records for this day with current filters.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
