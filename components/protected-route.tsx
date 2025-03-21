"use client"

import { useEffect, useState } from "react"
import { Loading } from "@/components/ui/loading"
import { useSearchParams } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
        if (token) {
          setIsAuthenticated(true)
        } else {
          // Chuyển hướng đến trang đăng nhập
          const redirectPath = searchParams?.get('redirect') || '/'
          window.location.href = '/login?redirect=' + encodeURIComponent(redirectPath)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [searchParams])

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading />
      </div>
    )
  }

  // Nếu đã xác thực, hiển thị nội dung
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Nếu không xác thực, không hiển thị gì (đã chuyển hướng)
  return null
} 