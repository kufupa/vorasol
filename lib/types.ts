// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  timestamp?: string
}

// Dashboard API Response
export interface DashboardData {
  total_drivers: number
  checked_in: number
  on_break: number
  off_duty: number
  absent: number
  timestamp: string
}

// Driver Location
export interface DriverLocation {
  latitude: number
  longitude: number
  address: string
}

// Backend Driver Type (matches API response)
export interface ApiDriver {
  employee_id: string
  name: string
  presence_status: "not_checked_in" | "checked_in" | "on_break" | "off_duty" | "holiday" | "sick_leave" | "absent"
  last_update: string
  location?: DriverLocation
}

// Frontend Driver Type (for UI components)
export interface Driver {
  id: string // employee_id from API
  name: string
  workHours: string // calculated from timestamps
  presence: "Present" | "Absent" | "Late" | "Not Logged In" | "On Break" | "Off Duty" | "Holiday" | "Sick Leave"
  employeeId: string // same as id
  contact: string // will be N/A for now since not in API
  poc: string // will be N/A for now since not in API
  lastUpdate?: string
  location?: DriverLocation
}

// Company/Client - keeping for now but may need to be updated based on backend
export interface Company {
  id: string
  name: string
  presentPercentage: number
  presentCount: number
  absentCount: number
  totalDrivers: number
}

// Authentication Types
export interface AuthResponse {
  access_token: string
  token_type: string
  driver: {
    employee_id: string
    name: string
    presence_status: string
  }
}

// Driver History for attendance page
export interface DriverHistoryEntry {
  date: string
  presence_status: string
  timestamp: string
  location?: DriverLocation
}

export interface DriverHistory {
  history: DriverHistoryEntry[]
}

// Check-in Request/Response
export interface CheckinRequest {
  presence_status: string
  location?: DriverLocation
}

export interface CheckinResponse {
  employee_id: string
  presence_status: string
  timestamp: string
}

// Archive Response
export interface ArchiveResponse {
  archived_records: number
  date: string
}

// Health Check Response
export interface HealthResponse {
  status: string
  timestamp: string
  version: string
  database: string
}
