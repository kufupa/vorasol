"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { driverSchema } from "@/lib/validations"
import type { Driver } from "@/lib/types"

interface AddEditDriverFormProps {
  onSave: (data: z.infer<typeof driverSchema>) => void
  driverToEdit: Driver | null
  onFinished: () => void
}

export default function AddEditDriverForm({ onSave, driverToEdit, onFinished }: AddEditDriverFormProps) {
  const form = useForm<z.infer<typeof driverSchema>>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: driverToEdit?.name || "",
      id: driverToEdit?.id || "",
      workHours: driverToEdit?.workHours || "",
      presence: driverToEdit?.presence || "Not Logged In",
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
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Not Logged In">Not Logged In</SelectItem>
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
