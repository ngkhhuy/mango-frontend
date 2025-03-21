"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
  id: string
  name: string
  username: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
    const checkAuth = () => {
      try {
        // Kiểm tra token trong localStorage hoặc sessionStorage
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
        const userData = localStorage.getItem("user") || sessionStorage.getItem("user")

        if (token && userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string, rememberMe: boolean) => {
    setIsLoading(true)
    
    try {
      const response = await fetch("https://mango-backend-fnhz.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại")
      }

      // Kiểm tra dữ liệu trả về
      console.log("Login response:", data);
      
      // Đảm bảo dữ liệu user hợp lệ
      const userData = {
        id: data.user?.id || data.userId || "unknown",
        name: data.user?.name || username || "User",
        username: data.user?.username || username || "user"
      };

      // Lưu token và thông tin người dùng
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("authToken", data.token || "")
      storage.setItem("user", JSON.stringify(userData))
      
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Xóa token và thông tin người dùng
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("authToken")
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 