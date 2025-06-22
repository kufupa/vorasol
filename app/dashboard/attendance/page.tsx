"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar" // For date range picker
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CalendarIcon, Download, BarChart3, Clock, UserCheck, UserX, AlertTriangle, UserRoundX } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

type AttendanceStatus = "Present" | "Absent" | "Late" | "Not Logged In"
interface AttendanceRecord {
  date: Date
  status: AttendanceStatus
  workHours?: string
  timestamp?: string
  driverId: string
}

const mockAttendance: AttendanceRecord[] = []
const drivers = ["D001", "D002", "D003", "D004", "D005"]
const statuses: AttendanceStatus[] = ["Present", "Absent", "Late", "Not Logged In"]
const today = new Date()
const monthStart = startOfMonth(today)

for (let i = 0; i < 30; i++) {
  drivers.forEach((driverId) => {
    const date = subDays(today, i) // Generate data for the last 30 days
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    mockAttendance.push({
      date,
      status: randomStatus,
      workHours:
        randomStatus === "Present" || randomStatus === "Late"
          ? `${Math.floor(Math.random() * 4) + 5}h ${Math.floor(Math.random() * 60)}m`
          : "0h 0m",
      timestamp:
        randomStatus !== "Not Logged In"
          ? `${format(date, "yyyy-MM-dd")} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`
          : undefined,
      driverId,
    })
  })
}

export default function DriverAttendancePage() {
  const [selectedDriver, setSelectedDriver] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [selectedPoc, setSelectedPoc] = useState<string>("all")

  const thirtyDays = eachDayOfInterval({
    start: dateRange?.from || startOfMonth(new Date()),
    end: dateRange?.to || endOfMonth(new Date()),
  })

  const filteredAttendance = useMemo(() => {
    return mockAttendance.filter((record) => {
      const dateMatch =
        dateRange?.from && dateRange?.to ? record.date >= dateRange.from && record.date <= dateRange.to : true
      const driverMatch = selectedDriver === "all" || record.driverId === selectedDriver
      // POC filtering would require POC data on attendance records or driver objects
      return dateMatch && driverMatch
    })
  }, [dateRange, selectedDriver])

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "bg-green-500"
      case "Absent":
        return "bg-red-500"
      case "Late":
        return "bg-orange-400"
      case "Not Logged In":
        return "bg-gray-300 dark:bg-gray-600"
      default:
        return "bg-gray-100 dark:bg-gray-700"
    }
  }

  const summary = useMemo(() => {
    const presentDays = filteredAttendance.filter((r) => r.status === "Present").length
    const absentDays = filteredAttendance.filter((r) => r.status === "Absent").length
    const lateDays = filteredAttendance.filter((r) => r.status === "Late").length
    const notLoggedInDays = filteredAttendance.filter((r) => r.status === "Not Logged In").length
    const totalRecords = filteredAttendance.length
    const attendanceRate = totalRecords > 0 ? (((presentDays + lateDays) / totalRecords) * 100).toFixed(1) : "0"
    return { presentDays, absentDays, lateDays, notLoggedInDays, attendanceRate, totalRecords }
  }, [filteredAttendance])

  const handleExportCsv = () => {
    // Basic CSV export logic
    let csvContent = "data:text/csv;charset=utf-8,Driver ID,Date,Status,Work Hours,Timestamp\n"
    filteredAttendance.forEach((row) => {
      csvContent += `${row.driverId},${format(row.date, "yyyy-MM-dd")},${row.status},${row.workHours || ""},${row.timestamp || ""}\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "attendance_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Driver Attendance Filters</CardTitle>
            <CardDescription>Filter attendance records by driver, date range, or POC.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="driverFilter">Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger id="driverFilter">
                  <SelectValue placeholder="Select Driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {drivers.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateRangeFilter">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateRangeFilter"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="pocFilter">Point of Contact (POC)</Label>
              <Select value={selectedPoc} onValueChange={setSelectedPoc}>
                <SelectTrigger id="pocFilter">
                  <SelectValue placeholder="Select POC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All POCs</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-brown">Mike Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExportCsv} className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" /> Export to CSV
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Attendance Calendar View</CardTitle>
              <CardDescription>
                {selectedDriver === "all"
                  ? "Aggregated daily attendance status."
                  : `Attendance for driver ${selectedDriver}.`}{" "}
                Hover over a day for details.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 p-1 min-w-[400px]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="font-semibold text-center text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}
                {/* Add empty cells for the start of the month if it doesn't start on Sunday */}
                {Array.from({ length: thirtyDays[0]?.getDay() ?? 0 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {thirtyDays.map((day) => {
                  const dayRecords = filteredAttendance.filter(
                    (r) => format(r.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
                  )
                  // For "All Drivers", show a summary or dominant status. For a single driver, show their specific status.
                  let displayStatus: AttendanceStatus = "Not Logged In"
                  let workHours = ""
                  let timestamp = ""

                  if (selectedDriver !== "all" && dayRecords.length > 0) {
                    displayStatus = dayRecords[0].status
                    workHours = dayRecords[0].workHours || ""
                    timestamp = dayRecords[0].timestamp || ""
                  } else if (selectedDriver === "all" && dayRecords.length > 0) {
                    // Simple aggregation: if any present, show present. If any late, show late. Else if any absent, show absent.
                    if (dayRecords.some((r) => r.status === "Present")) displayStatus = "Present"
                    else if (dayRecords.some((r) => r.status === "Late")) displayStatus = "Late"
                    else if (dayRecords.some((r) => r.status === "Absent")) displayStatus = "Absent"
                    workHours = `${dayRecords.length} records`
                  }

                  return (
                    <Tooltip key={day.toISOString()}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-16 w-full rounded border flex flex-col items-center justify-center text-xs p-1 text-white dark:text-black",
                            getStatusColor(displayStatus),
                          )}
                        >
                          <span className="font-bold text-sm">{format(day, "d")}</span>
                          <span className="text-center truncate w-full">
                            {selectedDriver === "all" ? displayStatus : ""}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{format(day, "MMM d, yyyy")}</p>
                        <p>Status: {displayStatus}</p>
                        {workHours && <p>Work Hours: {workHours}</p>}
                        {timestamp && <p>Timestamp: {timestamp}</p>}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>For selected period and filters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <BarChart3 className="mr-2 h-4 w-4 text-blue-500" /> Attendance Rate
                </div>
                <span className="font-semibold">{summary.attendanceRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <UserCheck className="mr-2 h-4 w-4 text-green-500" /> Present Days
                </div>
                <span className="font-semibold">{summary.presentDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <UserX className="mr-2 h-4 w-4 text-red-500" /> Absent Days
                </div>
                <span className="font-semibold">{summary.absentDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <AlertTriangle className="mr-2 h-4 w-4 text-orange-400" /> Late Days
                </div>
                <span className="font-semibold">{summary.lateDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <UserRoundX className="mr-2 h-4 w-4 text-gray-500" /> Not Logged In
                </div>
                <span className="font-semibold">{summary.notLoggedInDays}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4" /> Total Records
                </div>
                <span className="font-semibold">{summary.totalRecords}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
