"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loading } from "@/components/ui/loading"
import LoginScreen from "@/app/login/page"

interface AuthCheckProps {
  children: React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Không render gì cả cho đến khi component được mount
  if (!mounted) {
    return <Loading />
  }

  // Các trang không cần xác thực
  const publicPaths = ['/login', '/register']
  const isPublicPath = pathname ? publicPaths.some(path => pathname.startsWith(path)) : false

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (isLoading) {
    return <Loading />
  }

  // Nếu đang ở trang công khai hoặc đã đăng nhập, hiển thị nội dung
  if (isPublicPath || user) {
    return <>{children}</>
  }

  // Nếu chưa đăng nhập và không phải trang công khai, hiển thị trang đăng nhập
  return <LoginScreen />
} 