"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"

export default function NavbarWrapper() {
  const pathname = usePathname()
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState<string | null>(null)
  
  // Cập nhật đường dẫn hiện tại khi component được mount và khi pathname thay đổi
  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname])
  
  // Danh sách các đường dẫn không hiển thị Navbar
  const hideNavbarPaths = ['/login', '/register']
  
  // Kiểm tra xem đường dẫn hiện tại có nằm trong danh sách không hiển thị không
  const shouldHideNavbar = !currentPath || hideNavbarPaths.some(path => 
    currentPath.startsWith(path)
  )
  
  // Nếu nên ẩn Navbar, không render gì cả
  if (shouldHideNavbar) {
    return null
  }
  
  // Nếu không, hiển thị Navbar
  return <Navbar />
} 