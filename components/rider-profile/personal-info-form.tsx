"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Driver } from "@/lib/types"
import { UploadCloud, Paperclip } from "lucide-react"

export default function PersonalInfoForm({ driver }: { driver: Driver }) {
  // In a real app, use react-hook-form or similar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Personal info form submitted for driver:", driver.id)
  }

  return (
    <form
      id="personal-info-form"
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
    >      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input id="employeeId" defaultValue={driver.employeeId} />
        </div>
        <div>
          <Label htmlFor="contactNumbers">Contact Numbers</Label>
          <Input id="contactNumbers" defaultValue={driver.phone || driver.contact} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue={driver.email || ""} />
        </div>
        <div>
          <Label htmlFor="passport">Passport Number</Label>
          <Input id="passport" defaultValue={driver.passport || ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="hireDate">Hire Date</Label>
        <Input id="hireDate" type="date" defaultValue={driver.hire_date || ""} />
      </div>

      <div>
        <Label htmlFor="payslips">Payslips</Label>
        <div className="flex items-center gap-2">
          <Select defaultValue="june-2024">
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="june-2024">June 2024</SelectItem>
              <SelectItem value="may-2024">May 2024</SelectItem>
              <SelectItem value="april-2024">April 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" size="sm">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
        {/* Placeholder for payslip view */}
        <div className="mt-2 p-2 border rounded text-sm text-muted-foreground">
          Payslip for June 2024 (example.pdf) <Paperclip className="inline h-3 w-3 ml-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="timesheetData">Timesheet Data</Label>
        <Textarea id="timesheetData" placeholder="Enter timesheet data manually or upload CSV" rows={3} />
        <Button type="button" variant="outline" size="sm" className="mt-2">
          <UploadCloud className="mr-2 h-4 w-4" /> Upload CSV
        </Button>
      </div>

      <div>
        <Label htmlFor="poc">Point of Contact (POC)</Label>
        <Select defaultValue={driver.poc}>
          <SelectTrigger>
            <SelectValue placeholder="Select POC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
            <SelectItem value="Mike Brown">Mike Brown</SelectItem>
            <SelectItem value="Sarah Lee">Sarah Lee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="documents">Documents (e.g., ID, License)</Label>
        <Input id="documents" type="file" multiple />
        {/* Placeholder for uploaded files list */}
        <div className="mt-2 text-sm text-muted-foreground">Uploaded: id_card.pdf, license.jpg</div>
      </div>

      <div>
        <Label htmlFor="contracts">Contracts</Label>
        <Input id="contracts" type="file" />
        {/* Placeholder for uploaded contract */}
        <div className="mt-2 text-sm text-muted-foreground">Uploaded: employment_contract_v2.pdf</div>
      </div>

      <div>
        <Label htmlFor="assets">Assets (Bike/SIM)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="sim">SIM Card</SelectItem>
            </SelectContent>
          </Select>
          <Input id="assetProof" type="file" placeholder="Upload Proof" />
        </div>
        {/* Placeholder for asset info */}
        <div className="mt-2 text-sm text-muted-foreground">Asset: Bike (XYZ-123), Proof: bike_ownership.pdf</div>
      </div>
      {/* Submit button is in SheetFooter */}
    </form>
  )
}
