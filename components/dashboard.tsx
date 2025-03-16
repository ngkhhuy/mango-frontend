"use client"

import { useState } from "react"
import type { Mango, MangoType, MangoStats } from "@/types/mango"
import CategorySelector from "./category-selector"
import MangoList from "./mango-list"
import Statistics from "./statistics"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DashboardProps {
  mangoes: Mango[]
}

export default function Dashboard({ mangoes }: DashboardProps) {
  const [selectedType, setSelectedType] = useState<MangoType | "All">("All")

  const filteredMangoes = selectedType === "All" 
    ? mangoes 
    : mangoes.filter((mango) => mango.classify === selectedType)

  const calculateStats = (): MangoStats => {
    const totalCount = mangoes.length
    const totalWeight = mangoes.reduce((sum, mango) => sum + mango.weight, 0)
    const averageWeight = totalCount > 0 ? totalWeight / totalCount : 0

    const typeDistribution = mangoes.reduce(
      (acc, mango) => {
        acc[mango.classify as MangoType] = (acc[mango.classify as MangoType] || 0) + 1
        return acc
      },
      {} as { [key in MangoType]: number },
    )

    const originDistribution = mangoes.reduce(
      (acc, mango) => {
        const origin = mango.source || "Unknown"
        acc[origin] = (acc[origin] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    const ripenessDistribution = mangoes.reduce(
      (acc, mango) => {
        const ripeness = mango.ripeness || "Unknown"
        acc[ripeness] = (acc[ripeness] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    const weightRanges = [
      { range: "0-200g", count: mangoes.filter(m => m.weight < 200).length },
      { range: "200-400g", count: mangoes.filter(m => m.weight >= 200 && m.weight < 400).length },
      { range: "400g+", count: mangoes.filter(m => m.weight >= 400).length }
    ]

    return {
      totalCount,
      averageWeight,
      typeDistribution,
      originDistribution,
      ripenessDistribution,
      weightRanges,
    }
  }

  const exportMangoes = () => {
    if (filteredMangoes.length === 0) {
      console.warn("No mangoes to export")
      return
    }
    
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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-amber-800">Mango Management System</h1>
        <p className="text-amber-700">Classify, analyze, and export mango inventory</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-xl font-semibold text-amber-800 mb-4">Categories</h2>
            <CategorySelector
              selectedType={selectedType}
              onSelectType={setSelectedType}
              mangoCounts={{
                All: mangoes.length,
                "Type 1": mangoes.filter((m) => m.classify === "Type 1").length,
                "Type 2": mangoes.filter((m) => m.classify === "Type 2").length,
                "Extra Class": mangoes.filter((m) => m.classify === "Extra Class").length,
              }}
            />

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Statistics</h2>
              <Statistics stats={calculateStats()} />
            </div>

            <Button 
              onClick={exportMangoes} 
              className="w-full mt-6 bg-amber-600 hover:bg-amber-700"
              disabled={filteredMangoes.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export {selectedType} Mangoes
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-amber-800">
                {selectedType === "All" ? "All Mangoes" : `${selectedType} Mangoes`}
              </h2>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredMangoes.length} items
              </span>
            </div>
            {filteredMangoes.length > 0 ? (
              <MangoList mangoes={filteredMangoes} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No mangoes found for the selected type.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

