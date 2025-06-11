export interface Company {
  id: string
  name: string
  presentPercentage: number
  presentCount: number
  absentCount: number
  totalDrivers: number
}

export type AttendanceStatusUnion = "Present" | "Absent" | "Late" | "Not Logged In" | "Day Off"

export interface Driver {
  id: string
  name: string
  companyId: string
  workHours: string
  presence: AttendanceStatusUnion
  employeeId: string
  contact: string
  poc: string
  scheduledOffDays: string[]
  nextWorkingDay: string | null
}

export interface AttendanceRecord {
  date: Date
  status: AttendanceStatusUnion
  workHours?: string
  timestamp?: string
  driverId: string
  driverName?: string
  poc?: string
  companyId?: string // Added companyId
}
