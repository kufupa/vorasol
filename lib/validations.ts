import { z } from "zod"

export const clientSchema = z
  .object({
    name: z.string().min(2, { message: "Client name must be at least 2 characters." }),
    totalDrivers: z.number().min(0, { message: "Total drivers cannot be negative." }).int(),
    presentCount: z.number().min(0, { message: "Present count cannot be negative." }).int(),
    absentCount: z.number().min(0, { message: "Absent count cannot be negative." }).int(),
  })
  .refine((data) => data.presentCount + data.absentCount <= data.totalDrivers, {
    message: "Sum of present and absent drivers cannot exceed total drivers.",
    path: ["totalDrivers"],
  })

export const driverSchema = z.object({
  name: z.string().min(2, { message: "Driver name must be at least 2 characters." }),
  id: z.string().min(1, { message: "Driver ID is required." }),
  workHours: z.string().optional(),
  presence: z.enum(["Present", "Absent", "Late", "Not Logged In", "Day Off"]),
  companyId: z.string().min(1, { message: "Company is required." }),
  poc: z.string().min(1, { message: "POC is required." }),
})
