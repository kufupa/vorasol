"use client"

import { cn } from "@/lib/utils"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Driver } from "@/lib/types"
import { Edit3, MoreVertical, ChevronDown } from "lucide-react"

interface DriverStatusTableProps {
  drivers: Driver[]
  onEditDriver: (driver: Driver) => void
  onRemoveDriver: (driverId: string) => void
  onStatusChange: (driverId: string, newStatus: Driver["presence"]) => Promise<void>
  updatingDrivers?: Set<string> // Track which drivers are being updated
}

export default function DriverStatusTable({ 
  drivers, 
  onEditDriver, 
  onRemoveDriver, 
  onStatusChange, 
  updatingDrivers = new Set() 
}: DriverStatusTableProps) {
  const getBadgeVariant = (presence: Driver["presence"]) => {
    switch (presence) {
      case "Present":
        return "bg-green-500 hover:bg-green-600"
      case "Absent":
        return "bg-red-500 hover:bg-red-600"
      case "Late":
        return "bg-orange-400 hover:bg-orange-500"
      case "Not Logged In":
        return "bg-gray-400 hover:bg-gray-500"
      case "On Break":
        return "bg-blue-500 hover:bg-blue-600"
      case "Off Duty":
        return "bg-purple-500 hover:bg-purple-600"
      case "Holiday":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Sick Leave":
        return "bg-pink-500 hover:bg-pink-600"
      default:
        return "secondary"
    }
  }
  const getAllPresenceOptions = (): Driver["presence"][] => {
    return ["Present", "Absent", "Late", "Not Logged In", "On Break", "Off Duty", "Holiday", "Sick Leave"]
  }

  const getStatusColorClasses = (status: Driver["presence"]) => {
    switch (status) {
      case "Present":
        return "text-green-700 bg-green-50 hover:bg-green-100 border-green-200"
      case "Absent":
        return "text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
      case "Late":
        return "text-orange-700 bg-orange-50 hover:bg-orange-100 border-orange-200"
      case "Not Logged In":
        return "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200"
      case "On Break":
        return "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
      case "Off Duty":
        return "text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200"
      case "Holiday":
        return "text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
      case "Sick Leave":
        return "text-pink-700 bg-pink-50 hover:bg-pink-100 border-pink-200"
      default:
        return "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200"
    }
  }

  const handleStatusChange = async (driverId: string, newStatus: Driver["presence"]) => {
    try {
      await onStatusChange(driverId, newStatus)
    } catch (error) {
      console.error("Error updating driver status:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Status</CardTitle>
        <CardDescription>Live overview of driver presence and work hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Work Hours</TableHead>
              <TableHead>Presence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell className="font-medium">{driver.name}</TableCell>
                <TableCell>{driver.id}</TableCell>
                <TableCell>{driver.workHours}</TableCell>                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          "min-w-[120px] justify-between text-white border-none",
                          getBadgeVariant(driver.presence)
                        )}
                        disabled={updatingDrivers.has(driver.id)}
                      >
                        {updatingDrivers.has(driver.id) ? "Updating..." : driver.presence}
                        <ChevronDown className="ml-2 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>                    <DropdownMenuContent align="start" className="min-w-[140px]">
                      {getAllPresenceOptions().map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusChange(driver.id, status)}
                          disabled={status === driver.presence || updatingDrivers.has(driver.id)}
                          className={cn(
                            "border-l-4 mx-1 my-0.5 rounded-md transition-colors",
                            getStatusColorClasses(status),
                            status === driver.presence && "font-semibold ring-2 ring-offset-1 ring-current"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{status}</span>
                            {status === driver.presence && (
                              <div className="w-2 h-2 rounded-full bg-current opacity-70" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditDriver(driver)}>
                      <Edit3 className="mr-2 h-3 w-3" /> View/Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditDriver(driver)}>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRemoveDriver(driver.id)} className="text-red-500">
                          Remove Driver
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
