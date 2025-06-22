"use client"

import { useState, useEffect } from "react"
import { PlusCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import CompanyOverviewCard from "@/components/dashboard/company-overview-card"
import DriverStatusTable from "@/components/dashboard/driver-status-table"
import RiderProfileSheet from "@/components/rider-profile/rider-profile-sheet"
import AddEditClientForm from "@/components/dashboard/add-edit-client-form"
import AddEditDriverForm from "@/components/dashboard/add-edit-driver-form"
import DeleteConfirmationDialog from "@/components/common/delete-confirmation-dialog"
import { ApiService } from "@/lib/api"
import type { Driver, Company, DashboardData } from "@/lib/types"
import type { clientSchema, driverSchema } from "@/lib/validations"
import type { z } from "zod"

// Simple toast notification function
const showToast = (message: string, type: "success" | "error" = "success") => {
  // For now, just use console.log - you can replace this with proper toast implementation later
  console.log(`${type.toUpperCase()}: ${message}`)
}

const initialCompanies: Company[] = [
  {
    id: "1",
    name: "Driver Overview",
    presentPercentage: 0,
    presentCount: 0,
    absentCount: 0,
    totalDrivers: 0,
  },
]

export default function DashboardOverviewPage() {
  // State Management
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

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

  // Load data from API
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardResponse, driversData] = await Promise.all([
        ApiService.getDashboard(),
        ApiService.getAllDrivers()
      ])
      
      setDashboardData(dashboardResponse)
      setDrivers(driversData)
      
      // Update company overview with real data
      const presentPercentage = dashboardResponse.total_drivers > 0 
        ? Math.round((dashboardResponse.checked_in / dashboardResponse.total_drivers) * 100) 
        : 0

      setCompanies([{
        id: "main",
        name: "Driver Overview",
        presentPercentage,
        presentCount: dashboardResponse.checked_in,
        absentCount: dashboardResponse.absent + dashboardResponse.off_duty,
        totalDrivers: dashboardResponse.total_drivers,
      }])
      
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      showToast("Failed to load dashboard data. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      await loadDashboardData()
      showToast("Dashboard data refreshed successfully.", "success")
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

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

  const handleSaveDriver = async (data: z.infer<typeof driverSchema>) => {
    if (driverToEdit) {
      // Edit existing driver (for now, just update locally since backend doesn't have update driver endpoint)
      setDrivers(drivers.map((d) => (d.id === driverToEdit.id ? { ...d, ...data } : d)))
    } else {
      // Add new driver (for now, just add locally since backend doesn't have create driver endpoint)
      const newDriver: Driver = {
        ...data,
        id: `D${Date.now()}`,
        employeeId: `E${Date.now()}`,
        contact: "N/A",
        poc: "N/A",
        workHours: data.workHours || "0h 0m",      }
      setDrivers([...drivers, newDriver])
      showToast("Driver added successfully (local only).", "success")
    }
    setIsDriverModalOpen(false)
  }

  const handleOpenDeleteDriverDialog = (driverId: string) => {
    setItemToDelete({ id: driverId, type: "driver" })
    setIsDeleteDriverDialogOpen(true)
  }

  const confirmDeleteDriver = async () => {
    if (itemToDelete && itemToDelete.type === "driver") {
      // For now, just remove locally since backend doesn't have delete driver endpoint      setDrivers(drivers.filter((d) => d.id !== itemToDelete.id))
      showToast("Driver removed successfully (local only).", "success")
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
        <div className="flex items-center gap-2">
          <Button onClick={refreshData} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
            Refresh
          </Button>
          <Button onClick={handleOpenAddClientModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading dashboard data...</p>
          </div>
        </div>
      ) : (
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
      )}

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
