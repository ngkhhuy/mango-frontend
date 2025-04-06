"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")                                                                                                                                                                                                                                                                                          
  const [password, setPassword] = useState("")                                                                                                                                                                             
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Đang gửi yêu cầu đăng nhập với username:", username)
      
      const response = await fetch("https://mango-backend-ub33.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      
      // Log thông tin response status
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries([...response.headers.entries()]))
      
      const data = await response.json()
      
      // Log chi tiết dữ liệu response
      console.log("Response data:", JSON.stringify(data, null, 2))

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại")
      }

      // Lưu token và thông tin người dùng
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("authToken", data.token || "")
      
      // Đảm bảo dữ liệu user hợp lệ
      const userData = {
        id: data.user?.id || data.userId || "unknown",
        name: data.user?.name || username || "User",
        username: data.user?.username || username || "user"
      }
      
      console.log("Thông tin người dùng đã xử lý:", userData)
      
      storage.setItem("user", JSON.stringify(userData))
      
      toast.success("Đăng nhập thành công")
      
      // Sử dụng window.location để tránh lỗi với Next.js router
      window.location.href = "/"
    } catch (error) {
      console.error("Lỗi đăng nhập:", error)
      toast.error(error instanceof Error ? error.message : "Đăng nhập thất bại, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-center">Nhập thông tin đăng nhập của bạn để tiếp tục</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
               
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <div className="text-center text-sm">
             </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}