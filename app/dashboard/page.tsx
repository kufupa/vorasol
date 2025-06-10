"use client"

import { useState, useMemo } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import CompanyOverviewCard from "@/components/dashboard/company-overview-card"
import DriverStatusTable from "@/components/dashboard/driver-status-table"
import RiderProfileSheet from "@/components/rider-profile/rider-profile-sheet"
import AddEditClientForm from "@/components/dashboard/add-edit-client-form"
import AddEditDriverForm from "@/components/dashboard/add-edit-driver-form"
import DeleteConfirmationDialog from "@/components/common/delete-confirmation-dialog"
import DriverStatusFilters from "@/components/dashboard/driver-status-filters"
import type { Driver, Company, AttendanceStatusUnion } from "@/lib/types"
import type { clientSchema, driverSchema } from "@/lib/validations"
import type { z } from "zod"
import { isSameDay, parseISO } from "date-fns"

const initialCompanies: Company[] = [
  { id: "1", name: "TransCorp", presentPercentage: 85, presentCount: 170, absentCount: 30, totalDrivers: 200 },
  { id: "2", name: "LogiFlow", presentPercentage: 92, presentCount: 138, absentCount: 12, totalDrivers: 150 },
  { id: "3", name: "FleetFast", presentPercentage: 78, presentCount: 78, absentCount: 22, totalDrivers: 100 },
]

const initialDrivers: Driver[] = [
  {
    id: "D001",
    name: "John Doe",
    companyId: "1",
    workHours: "8h 15m",
    presence: "Present",
    employeeId: "E001",
    contact: "123-456-7890",
    poc: "Jane Smith",
    scheduledOffDays: ["2025-06-15", "2025-06-22"],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D002",
    name: "Alice Smith",
    companyId: "1",
    workHours: "7h 50m",
    presence: "Present",
    employeeId: "E002",
    contact: "987-654-3210",
    poc: "Jane Smith",
    scheduledOffDays: [],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D003",
    name: "Bob Johnson",
    companyId: "2",
    workHours: "0h 0m",
    presence: "Absent",
    employeeId: "E003",
    contact: "555-123-4567",
    poc: "Mike Brown",
    scheduledOffDays: ["2025-06-16"],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D004",
    name: "Charlie Brown",
    companyId: "2",
    workHours: "N/A",
    presence: "Day Off",
    employeeId: "E004",
    contact: "555-678-1234",
    poc: "Mike Brown",
    scheduledOffDays: [new Date().toISOString().split("T")[0]],
    nextWorkingDay: "2025-06-11",
  },
  {
    id: "D005",
    name: "Diana Prince",
    companyId: "1",
    workHours: "N/A",
    presence: "Not Logged In",
    employeeId: "E005",
    contact: "555-901-2345",
    poc: "Jane Smith",
    scheduledOffDays: [],
    nextWorkingDay: "2025-06-10",
  },
  {
    id: "D006",
    name: "Clark Kent",
    companyId: "3",
    workHours: "8h 00m",
    presence: "Present",
    employeeId: "E006",
    contact: "555-111-2222",
    poc: "Sarah Lee",
    scheduledOffDays: [],
    nextWorkingDay: "2025-06-10",
  },
]

const isDriverScheduledOffToday = (driver: Driver): boolean => {
  const today = new Date()
  return driver.scheduledOffDays.some((offDayStr) => isSameDay(parseISO(offDayStr), today))
}

export default function DashboardOverviewPage() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    return initialDrivers.map((driver) => ({
      ...driver,
      presence: isDriverScheduledOffToday(driver) ? "Day Off" : driver.presence,
      workHours: isDriverScheduledOffToday(driver) ? "N/A" : driver.workHours,
    }))
  })

  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false)
  const [isDeleteClientDialogOpen, setIsDeleteClientDialogOpen] = useState(false)
  const [isDeleteDriverDialogOpen, setIsDeleteDriverDialogOpen] = useState(false)

  const [clientToEdit, setClientToEdit] = useState<Company | null>(null)
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null)
  const [selectedDriverForProfile, setSelectedDriverForProfile] = useState<Driver | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "client" | "driver" } | null>(null)
  const [filters, setFilters] = useState({ business: "all", poc: "all", status: "all" })

  const handleOpenAddClientModal = () => {
    setClientToEdit(null)
    setIsClientModalOpen(true)
  }
  const handleOpenEditClientModal = (company: Company) => {
    setClientToEdit(company)
    setIsClientModalOpen(true)
  }
  const handleSaveClient = (data: z.infer<typeof clientSchema>) => {
    if (clientToEdit) {
      const presentPercentage = data.totalDrivers > 0 ? Math.round((data.presentCount / data.totalDrivers) * 100) : 0
      setCompanies(companies.map((c) => (c.id === clientToEdit.id ? { ...c, ...data, presentPercentage } : c)))
    } else {
      const presentPercentage = data.totalDrivers > 0 ? Math.round((data.presentCount / data.totalDrivers) * 100) : 0
      const newClient: Company = { id: `C${Date.now()}`, ...data, presentPercentage }
      setCompanies([...companies, newClient])
    }
    setIsClientModalOpen(false)
  }
  const handleOpenDeleteClientDialog = (clientId: string) => {
    setItemToDelete({ id: clientId, type: "client" })
    setIsDeleteClientDialogOpen(true)
  }
  const confirmDeleteClient = () => {
    if (itemToDelete && itemToDelete.type === "client") setCompanies(companies.filter((c) => c.id !== itemToDelete.id))
    setIsDeleteClientDialogOpen(false)
    setItemToDelete(null)
  }
  const handleOpenAddDriverModal = () => {
    setDriverToEdit(null)
    setIsDriverModalOpen(true)
  }
  const handleOpenEditDriverModal = (driver: Driver) => {
    setDriverToEdit(driver)
    setIsDriverModalOpen(true)
  }
  const handleSaveDriver = (data: z.infer<typeof driverSchema>) => {
    const driverData = {
      ...data,
      scheduledOffDays:
        data.presence === "Day Off"
          ? Array.from(new Set([...(driverToEdit?.scheduledOffDays || []), new Date().toISOString().split("T")[0]]))
          : (driverToEdit?.scheduledOffDays || []).filter((d) => !isSameDay(parseISO(d), new Date())),
      workHours:
        data.presence === "Day Off" || data.presence === "Absent" || data.presence === "Not Logged In"
          ? "N/A"
          : data.workHours || "N/A",
    }
    if (driverToEdit) {
      setDrivers(drivers.map((d) => (d.id === driverToEdit.id ? { ...d, ...driverData } : d)))
    } else {
      const newDriver: Driver = {
        ...driverData,
        companyId: data.companyId || initialCompanies[0]?.id || "1",
        employeeId: `E${Date.now()}`,
        contact: "N/A",
        poc: data.poc || "N/A",
        nextWorkingDay: null,
      } as Driver
      setDrivers([...drivers, newDriver])
    }
    setIsDriverModalOpen(false)
  }
  const handleOpenDeleteDriverDialog = (driverId: string) => {
    setItemToDelete({ id: driverId, type: "driver" })
    setIsDeleteDriverDialogOpen(true)
  }
  const confirmDeleteDriver = () => {
    if (itemToDelete && itemToDelete.type === "driver") setDrivers(drivers.filter((d) => d.id !== itemToDelete.id))
    setIsDeleteDriverDialogOpen(false)
    setItemToDelete(null)
  }
  const handleOpenProfileSheet = (driver: Driver) => {
    setSelectedDriverForProfile(driver)
    setIsProfileSheetOpen(true)
  }
  const handleUpdateDriverPresence = (driverId: string, newPresence: AttendanceStatusUnion) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) => {
        if (driver.id === driverId) {
          const isNowDayOff = newPresence === "Day Off"
          const todayStr = new Date().toISOString().split("T")[0]
          let newScheduledOffDays = driver.scheduledOffDays
          if (isNowDayOff) {
            if (!newScheduledOffDays.includes(todayStr)) newScheduledOffDays = [...newScheduledOffDays, todayStr]
          } else {
            newScheduledOffDays = newScheduledOffDays.filter((d) => d !== todayStr)
          }
          return {
            ...driver,
            presence: newPresence,
            workHours: newPresence === "Present" || newPresence === "Late" ? driver.workHours : "N/A",
            scheduledOffDays: newScheduledOffDays,
          }
        }
        return driver
      }),
    )
  }
  const handleSaveProfile = (updatedDriverData: Partial<Driver>) => {
    if (selectedDriverForProfile)
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => (d.id === selectedDriverForProfile.id ? { ...d, ...updatedDriverData } : d)),
      )
  }
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const companyMatch = filters.business === "all" || driver.companyId === filters.business
      const pocMatch = filters.poc === "all" || driver.poc === filters.poc
      const statusMatch = filters.status === "all" || driver.presence === filters.status
      return companyMatch && pocMatch && statusMatch
    })
  }, [drivers, filters])
  const uniquePocs = Array.from(new Set(initialDrivers.map((d) => d.poc).filter(Boolean))) as string[]

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Company Overview</h2>
        <Button onClick={handleOpenAddClientModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyOverviewCard
            key={company.id}
            company={company}
            onEdit={handleOpenEditClientModal}
            onRemove={handleOpenDeleteClientDialog}
          />
        ))}
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Driver Status</h2>
          <Button onClick={handleOpenAddDriverModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Driver
          </Button>
        </div>
        <DriverStatusFilters
          companies={companies}
          pocs={uniquePocs}
          currentFilters={filters}
          onFilterChange={setFilters}
        />
        <DriverStatusTable
          drivers={filteredDrivers}
          onEditDriver={handleOpenProfileSheet}
          onRemoveDriver={handleOpenDeleteDriverDialog}
          onUpdatePresence={handleUpdateDriverPresence}
        />
      </div>
      <Dialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{clientToEdit ? "Edit Client" : "Add New Client"}</DialogTitle>
            <DialogDescription>
              {clientToEdit ? "Update the details for this client." : "Enter the details for the new client."}
            </DialogDescription>
          </DialogHeader>
          <AddEditClientForm
            onSave={handleSaveClient}
            clientToEdit={clientToEdit}
            onFinished={() => setIsClientModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isDriverModalOpen} onOpenChange={setIsDriverModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{driverToEdit ? "Edit Driver" : "Add New Driver"}</DialogTitle>
            <DialogDescription>
              {driverToEdit ? "Update the details for this driver." : "Enter the details for the new driver."}
            </DialogDescription>
          </DialogHeader>
          <AddEditDriverForm
            onSave={handleSaveDriver}
            driverToEdit={driverToEdit}
            onFinished={() => setIsDriverModalOpen(false)}
            companies={companies}
            pocs={uniquePocs}
          />
        </DialogContent>
      </Dialog>
      {selectedDriverForProfile && (
        <RiderProfileSheet
          driver={selectedDriverForProfile}
          isOpen={isProfileSheetOpen}
          onOpenChange={setIsProfileSheetOpen}
          onSaveDriver={handleSaveProfile}
        />
      )}
      <DeleteConfirmationDialog
        isOpen={isDeleteClientDialogOpen}
        onOpenChange={setIsDeleteClientDialogOpen}
        onConfirm={confirmDeleteClient}
        title="Are you sure you want to remove this client?"
        description="This action cannot be undone. This will permanently delete the client and their associated data."
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDriverDialogOpen}
        onOpenChange={setIsDeleteDriverDialogOpen}
        onConfirm={confirmDeleteDriver}
        title="Are you sure you want to remove this driver?"
        description="This action cannot be undone. This will permanently delete the driver and their records."
      />
    </>
  )
}
