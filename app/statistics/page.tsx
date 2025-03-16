"use client"

import { useEffect, useState } from 'react'
import { getMangoes } from '@/lib/api'
import type { Mango } from '@/types/mango'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loading } from '@/components/ui/loading'
import { Badge } from "@/components/ui/badge"

interface Stats {
  totalCount: number
  averageWeight: number
  averageVolume: number
  typeDistribution: {
    [key: string]: {
      count: number
      percentage: number
      averageWeight: number
      averageVolume: number
    }
  }
  weightRanges: {
    range: string
    count: number
  }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function StatisticsPage() {
  const [mangoes, setMangoes] = useState<Mango[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMangoes = async () => {
      try {
        const data = await getMangoes()
        setMangoes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch mangoes')
      } finally {
        setLoading(false)
      }
    }

    fetchMangoes()
  }, [])

  const calculateStats = (mangoes: Mango[]): Stats => {
    const totalCount = mangoes.length
    const totalWeight = mangoes.reduce((sum, mango) => sum + mango.weight, 0)
    const totalVolume = mangoes.reduce((sum, mango) => sum + mango.volume, 0)
    const averageWeight = totalCount ? totalWeight / totalCount : 0
    const averageVolume = totalCount ? totalVolume / totalCount : 0

    // Detailed type distribution
    const typeDistribution: Stats['typeDistribution'] = {}
    mangoes.forEach((mango) => {
      if (!typeDistribution[mango.classify]) {
        typeDistribution[mango.classify] = {
          count: 0,
          percentage: 0,
          averageWeight: 0,
          averageVolume: 0,
        }
      }
      typeDistribution[mango.classify].count++
    })

    // Calculate percentages and averages for each type
    Object.keys(typeDistribution).forEach((type) => {
      const typeData = typeDistribution[type]
      const mangosOfType = mangoes.filter(m => m.classify === type)
      
      typeData.percentage = (typeData.count / totalCount) * 100
      typeData.averageWeight = mangosOfType.reduce((sum, m) => sum + m.weight, 0) / typeData.count
      typeData.averageVolume = mangosOfType.reduce((sum, m) => sum + m.volume, 0) / typeData.count
    })

    // Weight ranges calculation
    const weights = mangoes.map(m => m.weight)
    const minWeight = Math.min(...weights)
    const maxWeight = Math.max(...weights)
    const range = maxWeight - minWeight
    const rangeSize = range / 4

    const weightRanges = [
      { range: `${minWeight.toFixed(0)}-${(minWeight + rangeSize).toFixed(0)}g`, count: 0 },
      { range: `${(minWeight + rangeSize).toFixed(0)}-${(minWeight + rangeSize * 2).toFixed(0)}g`, count: 0 },
      { range: `${(minWeight + rangeSize * 2).toFixed(0)}-${(minWeight + rangeSize * 3).toFixed(0)}g`, count: 0 },
      { range: `${(minWeight + rangeSize * 3).toFixed(0)}-${maxWeight.toFixed(0)}g`, count: 0 },
    ]

    mangoes.forEach((mango) => {
      if (mango.weight <= minWeight + rangeSize) weightRanges[0].count++
      else if (mango.weight <= minWeight + rangeSize * 2) weightRanges[1].count++
      else if (mango.weight <= minWeight + rangeSize * 3) weightRanges[2].count++
      else weightRanges[3].count++
    })

    return {
      totalCount,
      averageWeight,
      averageVolume,
      typeDistribution,
      weightRanges,
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="text-center text-red-600">{error}</div>

  const stats = calculateStats(mangoes)
  const pieData = Object.entries(stats.typeDistribution).map(([type, data]) => ({
    name: type,
    value: data.count
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mango Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Mangoes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.averageWeight.toFixed(2)}g</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.averageVolume.toFixed(2)}cm³</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Classification Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.typeDistribution).map(([type, data]) => (
                  <div key={type} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">{type}</Badge>
                      <span className="text-sm font-medium">{data.count} mangoes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Percentage</p>
                        <p className="font-medium">{data.percentage.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Weight</p>
                        <p className="font-medium">{data.averageWeight.toFixed(1)}g</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Volume</p>
                        <p className="font-medium">{data.averageVolume.toFixed(1)}cm³</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weightRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

