"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ListFilter, BarChart3, User, LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import UserProfileDialog from "./user-profile-dialog"
import { ThemeToggle } from "./theme-toggle"

export default function Navbar() {
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/classification", label: "Phân loại", icon: ListFilter },
    { href: "/statistics", label: "Thống kê", icon: BarChart3 },
  ]

  return (
    <>
      <nav className="border-b bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Mango Control</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href 
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100" 
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarFallback className="bg-gray-200 text-gray-700">KH</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 hidden md:inline-block">Khanh Huy</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t">
          <div className="grid grid-cols-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors",
                    pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <UserProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  )
}

