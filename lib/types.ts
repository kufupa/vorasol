export interface Company {
  id: string
  name: string
  presentPercentage: number
  presentCount: number
  absentCount: number
  totalDrivers: number
}

export interface Driver {
  id: string // Driver ID
  name: string
  workHours: string
  presence: "Present" | "Absent" | "Late" | "Not Logged In"
  employeeId: string // Employee ID from Rider Personal Info
  contact: string // Contact Numbers from Rider Personal Info
  poc: string // Point of Contact from Rider Personal Info
  // Add other fields from Rider Profile as needed for table or modal
}
