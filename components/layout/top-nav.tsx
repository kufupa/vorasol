"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Moon, Sun, LogOut, UserCircle, Menu } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard Overview" },
  { href: "/dashboard/attendance", label: "Driver Attendance" },
  { href: "/dashboard/riders", label: "Rider Profiles" },
  { href: "/dashboard/financials", label: "Financial Overview" },
  { href: "/dashboard/settings", label: "Settings" },
]

export default function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const handleLogout = () => {
    // In a real app, clear session/token
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Image src="/placeholder.svg?width=32&height=32" alt="EasyLease Logo" width={32} height={32} />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">EasyLease</span>
          <p className="text-xs text-muted-foreground hidden md:block">
            Fleet Management HRMS – Monitor company attendance and manage driver information
          </p>
        </div>
      </div>

      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>Admin Name</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/placeholder.svg?width=32&height=32" alt="EasyLease Logo" width={32} height={32} />
                <span className="text-lg font-semibold">EasyLease</span>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground",
                    pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
