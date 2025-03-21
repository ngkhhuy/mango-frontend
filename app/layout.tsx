import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/auth-context"
import AuthCheck from "@/components/auth-check"
import NavbarWrapper from "@/components/navbar-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'Hệ thống phân loại xoài',
  description: 'Hệ thống phân loại, thống kê và đánh giá chất lượng xoài'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NavbarWrapper />
            <AuthCheck>
              {children}
            </AuthCheck>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
