"use client"

import { useState } from "react"
import { cn, getAttendanceBadgeVariant } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import type { Driver, AttendanceStatusUnion } from "@/lib/types"
import { Edit3, MoreVertical, CalendarDays, CheckCircle2 } from "lucide-react"

interface DriverStatusTableProps {
  drivers: Driver[]
  onEditDriver: (driver: Driver) => void
  onRemoveDriver: (driverId: string) => void
  onUpdatePresence: (driverId: string, newPresence: AttendanceStatusUnion) => void
}

const attendanceStatuses: AttendanceStatusUnion[] = ["Present", "Absent", "Late", "Day Off", "Not Logged In"]

export default function DriverStatusTable({
  drivers,
  onEditDriver,
  onRemoveDriver,
  onUpdatePresence,
}: DriverStatusTableProps) {
  const [confirmingDriverId, setConfirmingDriverId] = useState<string | null>(null)

  const handlePresenceChange = (driverId: string, newStatus: AttendanceStatusUnion) => {
    onUpdatePresence(driverId, newStatus)
    setConfirmingDriverId(driverId)
    setTimeout(() => setConfirmingDriverId(null), 1500)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Work Hours</TableHead>
              <TableHead className="w-[200px]">Presence</TableHead>
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
                  <div className="flex items-center gap-2">
                    {confirmingDriverId === driver.id ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-auto data-[state=open]:bg-muted">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs cursor-pointer hover:opacity-80",
                                getAttendanceBadgeVariant(driver.presence),
                              )}
                            >
                              {driver.presence === "Day Off" && <CalendarDays className="mr-1 h-3 w-3" />}
                              {driver.presence}
                            </Badge>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuRadioGroup
                            value={driver.presence}
                            onValueChange={(newStatus) =>
                              handlePresenceChange(driver.id, newStatus as AttendanceStatusUnion)
                            }
                          >
                            {attendanceStatuses.map((status) => (
                              <DropdownMenuRadioItem key={status} value={status}>
                                {status === "Day Off" && <CalendarDays className="mr-2 h-4 w-4" />}
                                {status}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
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
        {drivers.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No drivers match the current filters.</p>
        )}
      </CardContent>
    </Card>
  )
}
