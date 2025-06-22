"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { clientSchema } from "@/lib/validations"
import type { Company } from "@/lib/types"

interface AddEditClientFormProps {
  onSave: (data: z.infer<typeof clientSchema>) => void
  clientToEdit: Company | null
  onFinished: () => void
}

export default function AddEditClientForm({ onSave, clientToEdit, onFinished }: AddEditClientFormProps) {
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: clientToEdit?.name || "",
      totalDrivers: clientToEdit?.totalDrivers || 0,
      presentCount: clientToEdit?.presentCount || 0,
      absentCount: clientToEdit?.absentCount || 0,
    },
  })

  function onSubmit(data: z.infer<typeof clientSchema>) {
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
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., TransCorp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="totalDrivers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Drivers</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="presentCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Present</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="absentCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Absent</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onFinished}>
            Cancel
          </Button>
          <Button type="submit">Save Client</Button>
        </div>
      </form>
    </Form>
  )
}
