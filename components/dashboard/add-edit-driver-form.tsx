"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { driverSchema } from "@/lib/validations"
import type { Driver, AttendanceStatusUnion, Company } from "@/lib/types"

interface AddEditDriverFormProps {
  onSave: (data: z.infer<typeof driverSchema>) => void
  driverToEdit: Driver | null
  onFinished: () => void
  companies: Company[] // Pass companies for dropdown
  pocs: string[] // Pass POCs for dropdown
}

const attendanceStatuses: AttendanceStatusUnion[] = ["Present", "Absent", "Late", "Not Logged In", "Day Off"]

export default function AddEditDriverForm({
  onSave,
  driverToEdit,
  onFinished,
  companies,
  pocs,
}: AddEditDriverFormProps) {
  const form = useForm<z.infer<typeof driverSchema>>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: driverToEdit?.name || "",
      id: driverToEdit?.id || "",
      workHours: driverToEdit?.workHours || "",
      presence: driverToEdit?.presence || "Not Logged In",
      companyId: driverToEdit?.companyId || companies[0]?.id || "",
      poc: driverToEdit?.poc || pocs[0] || "",
    },
  })

  function onSubmit(data: z.infer<typeof driverSchema>) {
    onSave(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., D004" {...field} disabled={!!driverToEdit} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="poc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Point of Contact (POC)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select POC" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pocs.map((poc) => (
                    <SelectItem key={poc} value={poc}>
                      {poc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Hours (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 8h 15m" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="presence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presence Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {attendanceStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onFinished}>
            Cancel
          </Button>
          <Button type="submit">Save Driver</Button>
        </div>
      </form>
    </Form>
  )
}
