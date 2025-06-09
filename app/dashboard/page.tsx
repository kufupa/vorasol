"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import CompanyOverviewCard from "@/components/dashboard/company-overview-card"
import DriverStatusTable from "@/components/dashboard/driver-status-table"
import RiderProfileSheet from "@/components/rider-profile/rider-profile-sheet"
import AddEditClientForm from "@/components/dashboard/add-edit-client-form"
import AddEditDriverForm from "@/components/dashboard/add-edit-driver-form"
import DeleteConfirmationDialog from "@/components/common/delete-confirmation-dialog"
import type { Driver, Company } from "@/lib/types"
import type { clientSchema, driverSchema } from "@/lib/validations"
import type { z } from "zod"

const initialCompanies: Company[] = [
  {
    id: "1",
    name: "TransCorp",
    presentPercentage: 85,
    presentCount: 170,
    absentCount: 30,
    totalDrivers: 200,
  },
  {
    id: "2",
    name: "LogiFlow",
    presentPercentage: 92,
    presentCount: 138,
    absentCount: 12,
    totalDrivers: 150,
  },
  {
    id: "3",
    name: "FleetFast",
    presentPercentage: 78,
    presentCount: 78,
    absentCount: 22,
    totalDrivers: 100,
  },
]

const initialDrivers: Driver[] = [
  {
    id: "D001",
    name: "John Doe",
    workHours: "8h 15m",
    presence: "Present",
    employeeId: "E001",
    contact: "123-456-7890",
    poc: "Jane Smith",
  },
  {
    id: "D002",
    name: "Alice Smith",
    workHours: "7h 50m",
    presence: "Present",
    employeeId: "E002",
    contact: "987-654-3210",
    poc: "Jane Smith",
  },
  {
    id: "D003",
    name: "Bob Johnson",
    workHours: "0h 0m",
    presence: "Absent",
    employeeId: "E003",
    contact: "555-123-4567",
    poc: "Mike Brown",
  },
]

export default function DashboardOverviewPage() {
  // State Management
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)

  // Modal/Sheet State
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false)
  const [isDeleteClientDialogOpen, setIsDeleteClientDialogOpen] = useState(false)
  const [isDeleteDriverDialogOpen, setIsDeleteDriverDialogOpen] = useState(false)

  // Data for Modals
  const [clientToEdit, setClientToEdit] = useState<Company | null>(null)
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null)
  const [selectedDriverForProfile, setSelectedDriverForProfile] = useState<Driver | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "client" | "driver" } | null>(null)

  // Client Handlers
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
      // Edit existing client
      const presentPercentage = data.totalDrivers > 0 ? Math.round((data.presentCount / data.totalDrivers) * 100) : 0
      setCompanies(companies.map((c) => (c.id === clientToEdit.id ? { ...c, ...data, presentPercentage } : c)))
    } else {
      // Add new client
      const presentPercentage = data.totalDrivers > 0 ? Math.round((data.presentCount / data.totalDrivers) * 100) : 0
      const newClient: Company = {
        id: `C${Date.now()}`,
        ...data,
        presentPercentage,
      }
      setCompanies([...companies, newClient])
    }
    setIsClientModalOpen(false)
  }

  const handleOpenDeleteClientDialog = (clientId: string) => {
    setItemToDelete({ id: clientId, type: "client" })
    setIsDeleteClientDialogOpen(true)
  }

  const confirmDeleteClient = () => {
    if (itemToDelete && itemToDelete.type === "client") {
      setCompanies(companies.filter((c) => c.id !== itemToDelete.id))
    }
    setIsDeleteClientDialogOpen(false)
    setItemToDelete(null)
  }

  // Driver Handlers
  const handleOpenAddDriverModal = () => {
    setDriverToEdit(null)
    setIsDriverModalOpen(true)
  }

  const handleOpenEditDriverModal = (driver: Driver) => {
    setDriverToEdit(driver)
    setIsDriverModalOpen(true)
  }

  const handleSaveDriver = (data: z.infer<typeof driverSchema>) => {
    if (driverToEdit) {
      // Edit existing driver
      setDrivers(drivers.map((d) => (d.id === driverToEdit.id ? { ...d, ...data } : d)))
    } else {
      // Add new driver
      const newDriver: Driver = {
        ...data,
        id: `D${Date.now()}`,
        employeeId: `E${Date.now()}`,
        contact: "N/A",
        poc: "N/A",
      }
      setDrivers([...drivers, newDriver])
    }
    setIsDriverModalOpen(false)
  }

  const handleOpenDeleteDriverDialog = (driverId: string) => {
    setItemToDelete({ id: driverId, type: "driver" })
    setIsDeleteDriverDialogOpen(true)
  }

  const confirmDeleteDriver = () => {
    if (itemToDelete && itemToDelete.type === "driver") {
      setDrivers(drivers.filter((d) => d.id !== itemToDelete.id))
    }
    setIsDeleteDriverDialogOpen(false)
    setItemToDelete(null)
  }

  const handleOpenProfileSheet = (driver: Driver) => {
    setSelectedDriverForProfile(driver)
    setIsProfileSheetOpen(true)
  }

  return (
    <>
      {/* Client Section */}
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

      {/* Driver Section */}
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-2xl font-bold tracking-tight">Driver Status</h2>
        <Button onClick={handleOpenAddDriverModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>
      <DriverStatusTable
        drivers={drivers}
        onEditDriver={handleOpenProfileSheet}
        onRemoveDriver={handleOpenDeleteDriverDialog}
      />

      {/* Modals and Dialogs */}
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
          />
        </DialogContent>
      </Dialog>

      {selectedDriverForProfile && (
        <RiderProfileSheet
          driver={selectedDriverForProfile}
          isOpen={isProfileSheetOpen}
          onOpenChange={setIsProfileSheetOpen}
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
