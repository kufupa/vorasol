"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Driver } from "@/lib/types"
import { UploadCloud, CalendarIcon } from "lucide-react"

export default function FinancialsForm({ driver }: { driver: Driver }) {
  // In a real app, use react-hook-form or similar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Financials form submitted for driver:", driver.id)
  }

  return (
    <form
      id="financials-form"
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="payslipsFinancial">Payslips</Label>
          <div className="flex items-center gap-2">
            <Select defaultValue="june-2024">
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="june-2024">June 2024</SelectItem>
                <SelectItem value="may-2024">May 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="sm">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="visaSpent">Visa Spent (AED)</Label>
          <Input id="visaSpent" type="number" placeholder="e.g., 500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dlSpent">Driving License Spent (AED)</Label>
          <Input id="dlSpent" type="number" placeholder="e.g., 300" />
        </div>
        <div>
          <Label htmlFor="cashAdvanceAmount">Cash Advance (AED)</Label>
          <Input id="cashAdvanceAmount" type="number" placeholder="e.g., 200" />
        </div>
      </div>
      <div>
        <Label htmlFor="cashAdvanceDate">Cash Advance Date</Label>
        <div className="relative">
          <Input id="cashAdvanceDate" type="date" placeholder="Select date" />
          <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="outstandingRecovery">Outstanding Recovery (AED)</Label>
          <Input id="outstandingRecovery" type="number" placeholder="e.g., 150" />
        </div>
        <div>
          <Label htmlFor="monthlyDeductions">Monthly Deductions (AED)</Label>
          <Input id="monthlyDeductions" type="number" placeholder="e.g., 50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="incentives">Incentives (AED)</Label>
          <Input id="incentives" type="number" placeholder="e.g., 100" />
        </div>
        <div>
          <Label htmlFor="tips">Tips (AED)</Label>
          <Input id="tips" type="number" placeholder="e.g., 75" />
        </div>
      </div>

      <div>
        <Label htmlFor="finesAmount">Fines (AED)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="finesAmount" type="number" placeholder="e.g., 25" />
          <Input id="finesFile" type="file" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="saliks">Saliks (AED)</Label>
          <Input id="saliks" type="number" placeholder="e.g., 30" />
        </div>
        <div>
          <Label htmlFor="rentalsCost">Rentals Cost (AED)</Label>
          <Input id="rentalsCost" type="number" placeholder="e.g., 120" />
        </div>
      </div>

      <div>
        <Label htmlFor="simOverusage">SIM Overusage (AED)</Label>
        <Input id="simOverusage" type="number" placeholder="e.g., 15" />
      </div>
      {/* Submit button is in SheetFooter, but we might need a separate one if forms are independent */}
      {/* <Button type="submit" className="w-full">Save Financials</Button> */}
    </form>
  )
}
