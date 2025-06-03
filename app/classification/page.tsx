"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getMangoes } from "@/lib/api"
import type { Mango } from "@/types/mango"
import MangoList from "@/components/mango-list"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import ProtectedRoute from "@/components/protected-route"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

// Component chính được bọc trong Suspense
function ClassificationContent() {
  const searchParams = useSearchParams()
  const [mangoes, setMangoes] = useState<Mango[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>(
    searchParams?.get("type") || "All"
  )

  useEffect(() => {
    const fetchMangoes = async () => {
      try {
        const data = await getMangoes()
        setMangoes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu xoài")
      } finally {
        setLoading(false)
      }
    }

    fetchMangoes()
  }, [])

  // Lọc xoài theo loại đã chọn
  const filteredMangoes = selectedType === "All"
    ? mangoes
    : mangoes.filter(mango => mango.classify === selectedType)

  // Xuất dữ liệu ra file CSV
  const exportToCSV = () => {
    // Chỉ xuất dữ liệu đã lọc
    const dataToExport = filteredMangoes
    
    // Tạo header cho CSV (loại bỏ 'Thể tích (cm³)')
    const headers = ['ID', 'Loại', 'Cân nặng (g)', 'Ngày tạo', 'Link ảnh']
    
    // Chuyển đổi dữ liệu thành định dạng CSV
    const csvRows = []
    csvRows.push(headers.join(','))
    
    dataToExport.forEach(mango => {
      const row = [
        mango._id || mango.id,
        mango.classify || 'N/A',
        mango.weight || '0',
        mango.createdAt || 'N/A',
        mango.imageUrl || 'N/A'  // Thêm link ảnh
      ]
      csvRows.push(row.join(','))
    })
    
    // Tạo blob và tải xuống
    const csvString = csvRows.join('\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `xoai-${selectedType.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Danh sách các loại xoài để lọc, đã sắp xếp theo thứ tự yêu cầu
  const filterTypes = ["All", "Type 1", "Type 2", "Extra Class"]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Phân loại xoài</h1>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {filterTypes.map(type => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className="rounded-full text-xs md:text-sm py-1 px-3 md:py-2 md:px-4"
              size="sm"
            >
              {type}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            className="ml-auto md:ml-2 flex items-center gap-1 text-xs md:text-sm"
            onClick={exportToCSV}
            size="sm"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4" />
            Xuất CSV
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Badge variant="outline" className="text-xs md:text-sm">
          {filteredMangoes.length} xoài {selectedType !== "All" ? `loại ${selectedType}` : ""}
        </Badge>
      </div>

      <MangoList mangoes={filteredMangoes} showVolume={false} />
    </div>
  )
}

export default function ClassificationPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loading />}>
        <ClassificationContent />
      </Suspense>
    </ProtectedRoute>
  )
}

