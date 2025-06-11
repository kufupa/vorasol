"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { cn, getStatusColor } from "@/lib/utils"
import { Download, BarChart3, UserCheck, UserX, AlertTriangle, UserRoundX, Coffee } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays, isSameDay, addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { AttendanceStatusUnion, AttendanceRecord, Driver, Company } from "@/lib/types"
import DailyAttendanceDialog from "@/components/common/daily-attendance-dialog"
import { CalendarIcon } from "lucide-react"

// Mock data (in a real app, this would come from a store/API)
const mockCompanies: Company[] = [
  { id: "1", name: "TransCorp", presentPercentage: 0, presentCount: 0, absentCount: 0, totalDrivers: 0 },
  { id: "2", name: "LogiFlow", presentPercentage: 0, presentCount: 0, absentCount: 0, totalDrivers: 0 },
  { id: "3", name: "FleetFast", presentPercentage: 0, presentCount: 0, absentCount: 0, totalDrivers: 0 },
]

const mockDrivers: Driver[] = [
  {
    id: "D001",
    name: "John Doe",
    companyId: "1",
    workHours: "",
    presence: "Present",
    employeeId: "E001",
    contact: "",
    poc: "Jane Smith",
    scheduledOffDays: ["2025-06-15", "2025-06-22"],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D002",
    name: "Alice Smith",
    companyId: "1",
    workHours: "",
    presence: "Present",
    employeeId: "E002",
    contact: "",
    poc: "Jane Smith",
    scheduledOffDays: [],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D003",
    name: "Bob Johnson",
    companyId: "2",
    workHours: "",
    presence: "Absent",
    employeeId: "E003",
    contact: "",
    poc: "Mike Brown",
    scheduledOffDays: ["2025-06-16"],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D004",
    name: "Charlie Brown",
    companyId: "2",
    workHours: "",
    presence: "Late",
    employeeId: "E004",
    contact: "",
    poc: "Mike Brown",
    scheduledOffDays: [],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D005",
    name: "Diana Prince",
    companyId: "1",
    workHours: "",
    presence: "Not Logged In",
    employeeId: "E005",
    contact: "",
    poc: "Jane Smith",
    scheduledOffDays: [],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D006",
    name: "Clark Kent",
    companyId: "3",
    workHours: "",
    presence: "Present",
    employeeId: "E006",
    contact: "",
    poc: "Sarah Lee",
    scheduledOffDays: [],
    nextWorkingDay: "2025-06-10",
  },
]

const isDriverScheduledOff = (driverId: string, date: Date): boolean => {
  const driver = mockDrivers.find((d) => d.id === driverId)
  if (!driver || !driver.scheduledOffDays) return false
  return driver.scheduledOffDays.some((offDayStr) => isSameDay(new Date(offDayStr), date))
}

const initialAttendance: AttendanceRecord[] = []
const statuses: AttendanceStatusUnion[] = ["Present", "Absent", "Late", "Not Logged In", "Day Off"]
const today = new Date()
const thirtyDaysAgo = subDays(today, 29)
const dateInterval = eachDayOfInterval({ start: thirtyDaysAgo, end: today })

dateInterval.forEach((date) => {
  mockDrivers.forEach((driver) => {
    let status: AttendanceStatusUnion
    if (isDriverScheduledOff(driver.id, date)) {
      status = "Day Off"
    } else {
      status = statuses[Math.floor(Math.random() * 4) + 1]
      if (status === "Day Off") status = "Not Logged In"
    }
    initialAttendance.push({
      date,
      status,
      workHours:
        status === "Present" || status === "Late"
          ? `${Math.floor(Math.random() * 4) + 5}h ${Math.floor(Math.random() * 60)}m`
          : "0h 0m",
      timestamp:
        status !== "Not Logged In" && status !== "Day Off"
          ? `${format(date, "yyyy-MM-dd")} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`
          : undefined,
      driverId: driver.id,
      driverName: driver.name,
      poc: driver.poc,
      companyId: driver.companyId,
    })
  })
})

export default function DriverAttendancePage() {
  const [selectedDriverId, setSelectedDriverId] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [selectedPoc, setSelectedPoc] = useState<string>("all")
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all")
  const [dailyAttendanceDetails, setDailyAttendanceDetails] = useState<{
    date: Date
    records: AttendanceRecord[]
    rate: string
  } | null>(null)
  const [isDailyDialogValid, setIsDailyDialogValid] = useState(false)

  const calendarDays = useMemo(() => {
    const start = dateRange?.from || startOfMonth(new Date())
    let end = dateRange?.to || (dateRange?.from ? addDays(dateRange.from, 0) : endOfMonth(new Date()))
    if (dateRange?.from && !dateRange.to) end = dateRange.from
    else if (dateRange?.from && dateRange?.to && dateRange.to < dateRange.from) end = dateRange.from
    return eachDayOfInterval({ start, end })
  }, [dateRange])

  const filteredAttendance = useMemo(() => {
    return initialAttendance.filter((record) => {
      const dateMatch =
        dateRange?.from && dateRange?.to
          ? record.date >= dateRange.from && record.date <= dateRange.to
          : dateRange?.from
            ? isSameDay(record.date, dateRange.from)
            : true
      const driverMatch = selectedDriverId === "all" || record.driverId === selectedDriverId
      const pocMatch = selectedPoc === "all" || record.poc === selectedPoc
      const companyMatch = selectedCompanyId === "all" || record.companyId === selectedCompanyId
      return dateMatch && driverMatch && pocMatch && companyMatch
    })
  }, [dateRange, selectedDriverId, selectedPoc, selectedCompanyId])

  const summary = useMemo(() => {
    const relevantRecords =
      selectedDriverId === "all"
        ? filteredAttendance
        : filteredAttendance.filter((r) => r.driverId === selectedDriverId)
    const presentDays = relevantRecords.filter((r) => r.status === "Present").length
    const absentDays = relevantRecords.filter((r) => r.status === "Absent").length
    const lateDays = relevantRecords.filter((r) => r.status === "Late").length
    const dayOffs = relevantRecords.filter((r) => r.status === "Day Off").length
    const notLoggedInDays = relevantRecords.filter((r) => r.status === "Not Logged In").length
    const attendedDays = presentDays + lateDays
    const scheduledToWorkCount = relevantRecords.filter((r) => r.status !== "Day Off").length
    const attendanceRate = scheduledToWorkCount > 0 ? ((attendedDays / scheduledToWorkCount) * 100).toFixed(1) : "0.0"
    return {
      presentDays,
      absentDays,
      lateDays,
      dayOffs,
      notLoggedInDays,
      attendanceRate,
      totalRecords: relevantRecords.length,
    }
  }, [filteredAttendance, selectedDriverId])

  const handleExportCsv = () => {
    let csvContent = `data:text/csv;charset=utf-8,Driver ID,Driver Name,Date,Status,Work Hours,Timestamp,POC,Company ID
`
    filteredAttendance.forEach((row) => {
      csvContent += `${row.driverId},${row.driverName},${format(row.date, "yyyy-MM-dd")},${row.status},${row.workHours || ""},${row.timestamp || ""},${row.poc || ""},${row.companyId || ""}
`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "attendance_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDayClick = (day: Date) => {
    const recordsForDay = initialAttendance.filter(
      (r) =>
        isSameDay(r.date, day) &&
        (selectedDriverId === "all" || r.driverId === selectedDriverId) &&
        (selectedPoc === "all" || r.poc === selectedPoc) &&
        (selectedCompanyId === "all" || r.companyId === selectedCompanyId),
    )
    const attendedCount = recordsForDay.filter((r) => r.status === "Present" || r.status === "Late").length
    const scheduledToWorkCount = recordsForDay.filter((r) => r.status !== "Day Off").length
    const dailyRate = scheduledToWorkCount > 0 ? ((attendedCount / scheduledToWorkCount) * 100).toFixed(1) + "%" : "N/A"
    setDailyAttendanceDetails({ date: day, records: recordsForDay, rate: dailyRate })
    setIsDailyDialogValid(true)
  }

  const uniquePocs = Array.from(new Set(mockDrivers.map((d) => d.poc).filter(Boolean))) as string[]

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <CardTitle>Driver Attendance Filters</CardTitle>
            <Button onClick={handleExportCsv} size="sm">
              <Download className="mr-2 h-4 w-4" /> Export to CSV
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">
            <div>
              <Label htmlFor="driverFilter">Driver</Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger id="driverFilter" className="h-12 px-4 rounded-lg">
                  <SelectValue placeholder="Select Driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {mockDrivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.id})
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
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 px-4 rounded-lg",
                      !dateRange && "text-muted-foreground",
                    )}
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
                <SelectTrigger id="pocFilter" className="h-12 px-4 rounded-lg">
                  <SelectValue placeholder="Select POC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All POCs</SelectItem>
                  {uniquePocs.map((poc) => (
                    <SelectItem key={poc} value={poc}>
                      {poc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="companyFilter">Company</Label>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger id="companyFilter" className="h-12 px-4 rounded-lg">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Range Summary</CardTitle>
            <CardDescription>
              Showing data for: {dateRange?.from ? format(dateRange.from, "LLL dd, y") : "N/A"}
              {dateRange?.to && dateRange.from && !isSameDay(dateRange.from, dateRange.to)
                ? ` - ${format(dateRange.to, "LLL dd, y")}`
                : ""}
              {selectedDriverId !== "all"
                ? ` (Driver: ${mockDrivers.find((d) => d.id === selectedDriverId)?.name})`
                : " (All Drivers)"}
              {selectedCompanyId !== "all"
                ? ` (Company: ${mockCompanies.find((c) => c.id === selectedCompanyId)?.name})`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-500 mb-1" />
              <span className="text-xs text-muted-foreground">Attendance Rate</span>
              <span className="font-semibold text-lg">{summary.attendanceRate}%</span>
              {selectedDriverId !== "all" && (
                <Progress value={Number.parseFloat(summary.attendanceRate)} className="w-full h-1.5 mt-1" />
              )}
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <UserCheck className="h-6 w-6 text-green-500 mb-1" />
              <span className="text-xs text-muted-foreground">Present</span>
              <span className="font-semibold text-lg">{summary.presentDays}</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <UserX className="h-6 w-6 text-red-500 mb-1" />
              <span className="text-xs text-muted-foreground">Absent</span>
              <span className="font-semibold text-lg">{summary.absentDays}</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-400 mb-1" />
              <span className="text-xs text-muted-foreground">Late</span>
              <span className="font-semibold text-lg">{summary.lateDays}</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <Coffee className="h-6 w-6 text-gray-500 mb-1" />
              <span className="text-xs text-muted-foreground">Day Off</span>
              <span className="font-semibold text-lg">{summary.dayOffs}</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <UserRoundX className="h-6 w-6 text-gray-400 mb-1" />
              <span className="text-xs text-muted-foreground">Not Logged In</span>
              <span className="font-semibold text-lg">{summary.notLoggedInDays}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Calendar View</CardTitle>
            <CardDescription>
              {selectedDriverId === "all"
                ? "Aggregated daily attendance status."
                : `Attendance for driver ${mockDrivers.find((d) => d.id === selectedDriverId)?.name || selectedDriverId}.`}{" "}
              Click a day for details.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-1 p-1 min-w-[400px]">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-semibold text-center text-xs text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: calendarDays[0]?.getDay() ?? 0 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {calendarDays.map((day) => {
                const dayRecords = filteredAttendance.filter(
                  (r) => format(r.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
                )
                let displayStatus: AttendanceStatusUnion = "Not Logged In"
                let workHours = ""
                let timestamp = ""
                let labelToShow = ""

                if (selectedDriverId !== "all") {
                  const driverRecord = dayRecords.find((r) => r.driverId === selectedDriverId)
                  if (driverRecord) {
                    displayStatus = driverRecord.status
                    labelToShow = driverRecord.status
                    workHours = driverRecord.workHours || ""
                    timestamp = driverRecord.timestamp || ""
                  } else if (isDriverScheduledOff(selectedDriverId, day)) {
                    displayStatus = "Day Off"
                    labelToShow = "Day Off"
                  } else {
                    displayStatus = "Not Logged In"
                    labelToShow = "N/A"
                  }
                } else {
                  if (dayRecords.length > 0) {
                    if (dayRecords.some((r) => r.status === "Present")) displayStatus = "Present"
                    else if (dayRecords.some((r) => r.status === "Late")) displayStatus = "Late"
                    else if (dayRecords.some((r) => r.status === "Day Off")) displayStatus = "Day Off"
                    else if (dayRecords.some((r) => r.status === "Absent")) displayStatus = "Absent"
                    else displayStatus = "Not Logged In"
                    workHours = `${dayRecords.length} records`
                  } else {
                    displayStatus = "Not Logged In"
                  }
                }

                return (
                  <Tooltip key={day.toISOString()}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-16 w-full rounded border flex flex-col items-center justify-center text-xs p-1",
                          getStatusColor(displayStatus),
                        )}
                        onClick={() => handleDayClick(day)}
                      >
                        <span className="font-bold text-sm">{format(day, "d")}</span>
                        {selectedDriverId !== "all" && labelToShow && (
                          <span className="text-center truncate w-full mt-1 text-xs">{labelToShow}</span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{format(day, "MMM d, yyyy")}</p>
                      <p>Status: {displayStatus}</p>
                      {workHours && <p>Info: {workHours}</p>}
                      {timestamp && <p>Timestamp: {timestamp}</p>}
                      <p className="text-xs text-muted-foreground">Click for daily summary</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      {dailyAttendanceDetails && (
        <DailyAttendanceDialog
          isOpen={isDailyDialogValid}
          onOpenChange={setIsDailyDialogValid}
          date={dailyAttendanceDetails.date}
          records={dailyAttendanceDetails.records}
          dailyAttendanceRate={dailyAttendanceDetails.rate}
        />
      )}
    </TooltipProvider>
  )
}
