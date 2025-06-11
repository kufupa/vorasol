import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AttendanceStatusUnion } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAttendanceBadgeVariant = (presence: AttendanceStatusUnion): string => {
  switch (presence) {
    case "Present":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-700/30 dark:text-green-300 dark:border-green-600"
    case "Absent":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-700/30 dark:text-red-300 dark:border-red-600"
    case "Late":
      return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-700/30 dark:text-orange-300 dark:border-orange-600"
    case "Day Off":
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600"
    case "Not Logged In":
      return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-700/30 dark:text-slate-300 dark:border-slate-600"
    default:
      return "bg-background text-foreground border-border"
  }
}

export const getStatusColor = (status: AttendanceStatusUnion): string => {
  switch (status) {
    case "Present":
      return "bg-green-500 hover:bg-green-600 text-white dark:text-black"
    case "Absent":
      return "bg-red-500 hover:bg-red-600 text-white dark:text-black"
    case "Late":
      return "bg-orange-400 hover:bg-orange-500 text-white dark:text-black"
    case "Day Off":
      return "bg-gray-400 hover:bg-gray-500 text-white dark:text-black"
    case "Not Logged In":
      return "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
    default:
      return "bg-gray-100 dark:bg-gray-700"
  }
}
