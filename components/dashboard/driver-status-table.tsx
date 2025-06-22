"use client"

import { cn } from "@/lib/utils"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Driver } from "@/lib/types"
import { Edit3, MoreVertical } from "lucide-react"

interface DriverStatusTableProps {
  drivers: Driver[]
  onEditDriver: (driver: Driver) => void
  onRemoveDriver: (driverId: string) => void
}

export default function DriverStatusTable({ drivers, onEditDriver, onRemoveDriver }: DriverStatusTableProps) {
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
      default:
        return "secondary"
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
                <TableCell>{driver.workHours}</TableCell>
                <TableCell>
                  <Badge variant="default" className={cn("text-white", getBadgeVariant(driver.presence))}>
                    {driver.presence}
                  </Badge>
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
