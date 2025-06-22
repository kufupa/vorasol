import type React from "react"
import TopNav from "@/components/layout/top-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Assuming ThemeProvider is in the root layout.tsx, if not, add it here or there.
    // For v0 preview, ThemeProvider is usually in the root layout.
    <div className="flex min-h-screen w-full flex-col">
      <TopNav />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">{children}</main>
    </div>
  )
}
