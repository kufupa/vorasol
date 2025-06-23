import { z } from "zod"

export const clientSchema = z
  .object({
    name: z.string().min(2, { message: "Client name must be at least 2 characters." }),
    totalDrivers: z.number().min(0, { message: "Total drivers cannot be negative." }),
    presentCount: z.number().min(0, { message: "Present count cannot be negative." }),
    absentCount: z.number().min(0, { message: "Absent count cannot be negative." }),
  })
  .refine((data) => data.presentCount + data.absentCount <= data.totalDrivers, {
    message: "Sum of present and absent drivers cannot exceed total drivers.",
    path: ["totalDrivers"], // You can specify which field gets the error
  })

export const driverSchema = z.object({
  name: z.string().min(1, { message: "Driver name must be at least 1 character." }),
  id: z.string().min(1, { message: "Driver ID is required." }),
  workHours: z.string().optional(),
  presence: z.enum(["Present", "Absent", "Late", "Not Logged In", "On Break", "Off Duty", "Holiday", "Sick Leave"]),
  // Additional fields for backend API (match backend validation rules)
  passport: z.string().min(1, { message: "Passport must be at least 1 character." }).optional().or(z.literal("")),
  phone: z.string().min(1, { message: "Phone must be at least 1 character." }).optional().or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Hire date must be in YYYY-MM-DD format." }).optional().or(z.literal("")),
})
