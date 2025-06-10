"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Driver } from "@/lib/types"
import { UploadCloud, Paperclip, Lock, Unlock } from "lucide-react"
import { format } from "date-fns"

export default function PersonalInfoForm({
  driver,
  onSave,
}: { driver: Driver; onSave: (data: Partial<Driver>) => void }) {
  const [isEditingLockedFields, setIsEditingLockedFields] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Partial<Driver> = {
      employeeId: formData.get("employeeId") as string,
      contact: formData.get("contactNumbers") as string,
      poc: formData.get("poc") as string,
      // Add other fields from the form as needed
    }
    onSave(data)
    console.log("Personal info form submitted for driver:", driver.id, data)
  }

  return (
    <form
      id="personal-info-form"
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2"
    >
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsEditingLockedFields(!isEditingLockedFields)}
        >
          {isEditingLockedFields ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
          {isEditingLockedFields ? "Lock Details" : "Edit Details"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input id="employeeId" name="employeeId" defaultValue={driver.employeeId} disabled={!isEditingLockedFields} />
        </div>
        <div>
          <Label htmlFor="contactNumbers">Contact Numbers</Label>
          <Input
            id="contactNumbers"
            name="contactNumbers"
            defaultValue={driver.contact}
            disabled={!isEditingLockedFields}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="poc">Point of Contact (POC)</Label>
        <Select name="poc" defaultValue={driver.poc} disabled={!isEditingLockedFields}>
          <SelectTrigger>
            <SelectValue placeholder="Select POC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
            <SelectItem value="Mike Brown">Mike Brown</SelectItem>
            <SelectItem value="Sarah Lee">Sarah Lee</SelectItem>
            {/* Add other POCs dynamically if needed */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nextWorkingDay">Next Working Day</Label>
          <Input
            id="nextWorkingDay"
            value={driver.nextWorkingDay ? format(new Date(driver.nextWorkingDay), "MMM dd, yyyy") : "N/A"}
            readOnly
            className="bg-muted/50"
          />
        </div>
        <div>
          <Label htmlFor="scheduledOffDays">Scheduled Off Days</Label>
          <div className="p-2 border rounded text-sm min-h-[40px] bg-muted/50">
            {driver.scheduledOffDays && driver.scheduledOffDays.length > 0
              ? driver.scheduledOffDays.map((d) => format(new Date(d), "MMM dd, yyyy")).join(", ")
              : "None"}
          </div>
        </div>
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
        <Label htmlFor="documents">Documents (e.g., ID, License)</Label>
        <Input id="documents" type="file" multiple />
        <div className="mt-2 text-sm text-muted-foreground">Uploaded: id_card.pdf, license.jpg</div>
      </div>

      <div>
        <Label htmlFor="contracts">Contracts</Label>
        <Input id="contracts" type="file" />
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
        <div className="mt-2 text-sm text-muted-foreground">Asset: Bike (XYZ-123), Proof: bike_ownership.pdf</div>
      </div>
      {/* Submit button is in SheetFooter */}
    </form>
  )
}
