import type { 
  ApiResponse, 
  DashboardData, 
  ApiDriver, 
  DriverHistory, 
  Driver, 
  AuthResponse,
  CheckinRequest,
  CheckinResponse,
  ArchiveResponse,
  HealthResponse,
  EditDriverRequest,
  EditDriverResponse,
  AddDriverRequest,
  AddDriverResponse,
  ValidationErrorResponse
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Helper function to convert API driver to frontend driver
export function convertApiDriverToDriver(apiDriver: ApiDriver): Driver {
  // Map backend presence status to frontend presence
  const presenceMap: Record<string, Driver["presence"]> = {
    not_checked_in: "Not Logged In",
    checked_in: "Present",
    on_break: "On Break",
    off_duty: "Off Duty",
    holiday: "Holiday",
    sick_leave: "Sick Leave",
    absent: "Absent",
  }

  // Calculate work hours (simplified - you might want to enhance this)
  const workHours = apiDriver.current_status === "checked_in" ? "8h 0m" : "0h 0m"

  return {
    id: apiDriver.employee_id,
    name: apiDriver.name,
    workHours,
    presence: presenceMap[apiDriver.current_status] || "Not Logged In",
    employeeId: apiDriver.employee_id,
    contact: "N/A", // Not available in API
    poc: "N/A", // Not available in API
    lastUpdate: apiDriver.last_updated,
    location: apiDriver.location,
  }
}

// API Service Functions
export class ApiService {
  // Authentication APIs
  static async driverSignIn(employeeId: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId,
          password: password,
        }),
      })
      
      const data: ApiResponse<AuthResponse> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.message || "Login failed")
      }
      
      return data.data
    } catch (error) {
      console.error("Error during sign in:", error)
      throw error
    }
  }

  // Driver APIs (require authentication)
  static async updateDriverCheckin(token: string, checkinData: CheckinRequest): Promise<CheckinResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/driver/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkinData),
      })
      
      const data: ApiResponse<CheckinResponse> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.message || "Failed to update check-in status")
      }
      
      return data.data
    } catch (error) {
      console.error("Error updating check-in:", error)
      throw error
    }
  }

  static async getDriverStatus(token: string): Promise<ApiDriver> {
    try {
      const response = await fetch(`${API_BASE_URL}/driver/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      const data: ApiResponse<ApiDriver> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.message || "Failed to fetch driver status")
      }
      
      return data.data
    } catch (error) {
      console.error("Error fetching driver status:", error)
      throw error
    }
  }

  static async getDriverHistory(token: string, days: number = 30): Promise<DriverHistory> {
    try {
      const response = await fetch(`${API_BASE_URL}/driver/history?days=${days}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      const data: ApiResponse<DriverHistory> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.message || "Failed to fetch driver history")
      }
      
      return data.data
    } catch (error) {
      console.error("Error fetching driver history:", error)
      throw error
    }
  }
  // Admin APIs (public access)
  static async getDashboard(): Promise<DashboardData> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`)
      const data: any = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.message || "Failed to fetch dashboard data")
      }
      
      // Transform backend response to frontend format
      const backendData = data.data
      return {
        total_drivers: backendData.total_drivers,
        checked_in: backendData.by_status?.CHECKED_IN || 0,
        on_break: backendData.by_status?.ON_BREAK || 0,
        off_duty: backendData.by_status?.OFF_DUTY || 0,
        absent: (backendData.by_status?.ABSENT || 0) + 
                (backendData.by_status?.NOT_CHECKED_IN || 0) + 
                (backendData.by_status?.HOLIDAY || 0) + 
                (backendData.by_status?.SICK_LEAVE || 0),
        timestamp: backendData.last_updated
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error)
      throw error
    }
  }
  static async getDriversByStatus(status: string): Promise<ApiDriver[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/drivers/${status}`)
      const data: any = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch drivers")
      }
      
      // Backend returns drivers directly, not nested under data
      return data.drivers || []
    } catch (error) {
      console.error("Error fetching drivers:", error)
      throw error
    }
  }

  static async getAllDrivers(): Promise<Driver[]> {
    try {
      const statuses = ["not_checked_in", "checked_in", "on_break", "off_duty", "holiday", "sick_leave", "absent"]
      const allDriversPromises = statuses.map(status => this.getDriversByStatus(status))
      const allDriversResults = await Promise.all(allDriversPromises)
      
      const allApiDrivers = allDriversResults.flat()
      return allApiDrivers.map(convertApiDriverToDriver)
    } catch (error) {
      console.error("Error fetching all drivers:", error)
      throw error
    }
  }

  static async archiveData(date?: string): Promise<ArchiveResponse> {
    try {
      const body = date ? { date } : {}
      const response = await fetch(`${API_BASE_URL}/admin/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      
      const data: ApiResponse<ArchiveResponse> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.message || "Failed to archive data")
      }
      
      return data.data
    } catch (error) {
      console.error("Error archiving data:", error)
      throw error
    }
  }

  // System APIs
  static async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error checking health:", error)
      throw error
    }
  }

  static async getApiInfo(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching API info:", error)
      throw error
    }
  }

  // Admin authentication (simplified - no actual backend endpoint for admin login)
  static async adminLogin(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    // Since the backend only has driver authentication, we'll simulate admin login
    // In a real implementation, you'd have an admin login endpoint
    try {
      if (username === "admin" && password === "admin123") {
        return { success: true }
      } else {
        return { success: false, message: "Invalid credentials" }
      }
    } catch (error) {
      return { success: false, message: "Login failed" }
    }
  }

  // Utility method to get all possible presence statuses
  static getPresenceStatuses(): string[] {
    return ["not_checked_in", "checked_in", "on_break", "off_duty", "holiday", "sick_leave", "absent"]
  }

  // Utility method to convert backend status to frontend display
  static convertPresenceStatusToDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      not_checked_in: "Not Logged In",
      checked_in: "Present",
      on_break: "On Break",
      off_duty: "Off Duty",
      holiday: "Holiday",
      sick_leave: "Sick Leave",
      absent: "Absent",
    }
    return statusMap[status] || status
  }

  // Utility method to convert frontend display to backend status
  static convertDisplayToPresenceStatus(display: string): string {
    const displayMap: Record<string, string> = {
      "Not Logged In": "not_checked_in",
      "Present": "checked_in",
      "On Break": "on_break",
      "Off Duty": "off_duty",
      "Holiday": "holiday",
      "Sick Leave": "sick_leave",
      "Absent": "absent",
      "Late": "checked_in", // Map Late to checked_in as it's not in backend
    }
    return displayMap[display] || "not_checked_in"
  }
  
  static async addDriver(driverData: AddDriverRequest): Promise<AddDriverResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/add-driver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
      })
      
      // Handle 422 validation errors separately
      if (response.status === 422) {
        const validationError: ValidationErrorResponse = await response.json()
        const errorMessages = validationError.detail?.map((err) => err.msg).join(", ") || "Validation failed"
        throw new Error(`Validation Error: ${errorMessages}`)
      }
      
      // Handle other non-200 status codes
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }
      
      const data: AddDriverResponse = await response.json()
      
      // Handle business logic errors (success: false)
      if (!data.success) {
        throw new Error(data.message || "Failed to add driver")
      }
      
      return data
    } catch (error) {
      console.error("Error adding driver:", error)
      throw error
    }
  }
  
  static async editDriver(employeeId: string, updateData: EditDriverRequest): Promise<EditDriverResponse> {
    try {
      // Convert frontend presence display to backend status if presence is provided
      const backendUpdateData = { ...updateData }
      if (backendUpdateData.presence) {
        backendUpdateData.presence = this.convertDisplayToPresenceStatus(backendUpdateData.presence)
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/edit-driver/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendUpdateData),
      })
      
      // Handle 422 validation errors separately
      if (response.status === 422) {
        const validationError: ValidationErrorResponse = await response.json()
        const errorMessages = validationError.detail?.map((err) => err.msg).join(", ") || "Validation failed"
        throw new Error(`Validation Error: ${errorMessages}`)
      }
      
      // Handle other non-200 status codes
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }
      
      const data: EditDriverResponse = await response.json()
      
      // Handle business logic errors (success: false)
      if (!data.success) {
        throw new Error(data.message || "Failed to update driver")
      }
      
      return data
    } catch (error) {
      console.error("Error updating driver:", error)
      throw error
    }
  }
}
