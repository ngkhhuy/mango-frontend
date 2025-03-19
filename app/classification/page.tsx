"use client"

import { useEffect, useState } from "react"
import { getMangoes } from "@/lib/api"
import type { Mango } from "@/types/mango"
import MangoList from "@/components/mango-list"
import { Loading } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

export default function ClassificationPage() {
  const [mangoes, setMangoes] = useState<Mango[]>([])
  const [selectedType, setSelectedType] = useState<string>("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMangoes = async () => {
      try {
        const data = await getMangoes()
        setMangoes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch mangoes")
      } finally {
        setLoading(false)
      }
    }

    fetchMangoes()
  }, [])

  const filteredMangoes = selectedType === "All" ? mangoes : mangoes.filter((mango) => mango.classify === selectedType)

  const exportMangoes = () => {
    const dataToExport = filteredMangoes
    const headers = Object.keys(dataToExport[0]).join(",")
    const csvData = dataToExport.map((mango) => Object.values(mango).join(",")).join("\n")
    const csv = `${headers}\n${csvData}`

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `mangoes-${selectedType.toLowerCase().replace(" ", "-")}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Helper function to get color for mango type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Type 1":
        return "bg-green-100 text-green-800"
      case "Type 2":
        return "bg-yellow-100 text-yellow-800"
      case "Extra Class":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const types = ["All", "Type 1", "Type 2", "Extra Class"]

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Phân loại xoài</h1>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type}
              onClick={() => setSelectedType(type)}
              variant={selectedType === type ? "default" : "outline"}
              className={selectedType === type ? "" : getTypeColor(type)}
            >
              {type === "All" ? "Tất cả" : type}
            </Button>
          ))}
        </div>
      </header>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : filteredMangoes.length === 0 ? (
        <div className="text-center text-gray-600">
          Không tìm thấy xoài cho loại đã chọn.
        </div>
      ) : (
        <MangoList mangoes={filteredMangoes} />
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {types.slice(1).map((type) => {
            const count = mangoes.filter((m) => m.classify === type).length
            return (
              <div key={type} className="p-4 border rounded-lg">
                <Badge className={getTypeColor(type)}>{type}</Badge>
                <p className="mt-2 text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-600">xoài</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

