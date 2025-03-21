"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  BarChart3,
  Home,
  ListFilter,
  LogOut,
  Settings,
  User,
} from "lucide-react"

interface UserData {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserData | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user") || sessionStorage.getItem("user")
        if (userData) {
          // Đảm bảo userData là JSON hợp lệ trước khi parse
          try {
            const parsedUser = JSON.parse(userData);
            // Đảm bảo user có thuộc tính name
            if (parsedUser && typeof parsedUser === 'object') {
              // Đặt giá trị mặc định cho các trường cần thiết nếu không tồn tại
              if (!parsedUser.name) parsedUser.name = "User";
              if (!parsedUser.username) parsedUser.username = "user";
              if (!parsedUser.id) parsedUser.id = "unknown";
              setUser(parsedUser);
            }
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            // Đặt user mặc định nếu không parse được
            setUser({ id: "unknown", name: "User", username: "user" });
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      }
    }

    checkAuth()
    // Lắng nghe sự kiện storage để cập nhật UI khi đăng nhập/đăng xuất
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("authToken")
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    setUser(null)
    window.location.href = "/login"
  }

  const links = [
    {
      name: "Trang chủ",
      href: "/",
      icon: Home,
    },
    {
      name: "Phân loại",
      href: "/classification",
      icon: ListFilter,
    },
    {
      name: "Thống kê",
      href: "/statistics",
      icon: BarChart3,
    },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        {/* Logo bên trái */}
        <Link href="/" className="text-lg font-bold mr-4">
          Mango System
        </Link>
        
        {/* Menu chính ở giữa */}
        <div className="flex-1 flex justify-center">
          <div className="flex">
            {links.map((link) => {
              const LinkIcon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-base font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <LinkIcon className="mr-2 h-5 w-5" />
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Các nút bên phải */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isClient && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="text-base">Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuItem className="flex items-center text-base">
                      <User className="mr-2 h-5 w-5" />
                      <span>{user.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center text-base">
                      <Settings className="mr-2 h-5 w-5" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center text-base" onClick={handleLogout}>
                      <LogOut className="mr-2 h-5 w-5" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="text-base">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

