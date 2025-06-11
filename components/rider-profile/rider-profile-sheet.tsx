"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import PersonalInfoForm from "./personal-info-form"
import FinancialsForm from "./financials-form"
import type { Driver } from "@/lib/types"

interface RiderProfileSheetProps {
  driver: Driver
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSaveDriver: (driverData: Partial<Driver>) => void
}

export default function RiderProfileSheet({ driver, isOpen, onOpenChange, onSaveDriver }: RiderProfileSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>
            Rider Profile: {driver.name} ({driver.id})
          </SheetTitle>
          <SheetDescription>Manage personal and financial information for the rider.</SheetDescription>
        </SheetHeader>
        <div className="p-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-4">
              <PersonalInfoForm driver={driver} onSave={onSaveDriver} />
            </TabsContent>
            <TabsContent value="financials" className="mt-4">
              <FinancialsForm driver={driver} onSave={onSaveDriver} />
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter className="p-6 pt-0 border-t">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={() => {
              const activeTab = document.querySelector('[data-state="active"][role="tabpanel"]')
              const formId = activeTab?.querySelector("form")?.id
              if (formId) {
                document.getElementById(formId)?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
              }
            }}
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
