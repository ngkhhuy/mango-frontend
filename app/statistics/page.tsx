"use client"

import { useEffect, useState } from "react"
import { getMangoes } from "@/lib/api"
import type { Mango } from "@/types/mango"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import ProtectedRoute from "@/components/protected-route"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

// Định nghĩa kiểu dữ liệu cho thống kê theo loại
interface TypeStats {
  type: string;
  count: number;
  percentage: number;
  avgWeight: number;
  avgVolume: number;
}

function StatisticsContent() {
  const [mangoes, setMangoes] = useState<Mango[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCount: 0,
    avgWeight: 0,
    avgVolume: 0,
    typeStats: [] as TypeStats[],
    pieData: [] as { name: string; value: number }[]
  })

  useEffect(() => {
    const fetchMangoes = async () => {
      try {
        const data = await getMangoes()
        setMangoes(data)
        calculateStatistics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu xoài")
      } finally {
        setLoading(false)
      }
    }

    fetchMangoes()
  }, [])

  const calculateStatistics = (data: Mango[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      setStats({
        totalCount: 0,
        avgWeight: 0,
        avgVolume: 0,
        typeStats: [],
        pieData: []
      })
      return
    }

    const totalCount = data.length
    
    // Tính trọng lượng trung bình tổng thể
    const totalWeight = data.reduce((sum, mango) => {
      const weight = typeof mango.weight === 'number' ? mango.weight : 0
      return sum + weight
    }, 0)
    const avgWeight = totalCount > 0 ? totalWeight / totalCount : 0
    
    // Tính thể tích trung bình tổng thể
    const totalVolume = data.reduce((sum, mango) => {
      const volume = typeof mango.volume === 'number' ? mango.volume : 0
      return sum + volume
    }, 0)
    const avgVolume = totalCount > 0 ? totalVolume / totalCount : 0
    
    // Nhóm xoài theo loại
    const typeGroups: Record<string, Mango[]> = {}
    data.forEach(mango => {
      const type = mango.classify || 'Unknown'
      if (!typeGroups[type]) {
        typeGroups[type] = []
      }
      typeGroups[type].push(mango)
    })

    // Tính toán thống kê cho từng loại
    const typeStats: TypeStats[] = Object.entries(typeGroups).map(([type, mangoes]) => {
      const count = mangoes.length
      const percentage = (count / totalCount) * 100
      
      // Tính trọng lượng trung bình
      const typeTotalWeight = mangoes.reduce((sum, mango) => {
        const weight = typeof mango.weight === 'number' ? mango.weight : 0
        return sum + weight
      }, 0)
      const typeAvgWeight = count > 0 ? typeTotalWeight / count : 0
      
      // Tính thể tích trung bình
      const typeTotalVolume = mangoes.reduce((sum, mango) => {
        const volume = typeof mango.volume === 'number' ? mango.volume : 0
        return sum + volume
      }, 0)
      const typeAvgVolume = count > 0 ? typeTotalVolume / count : 0
      
      return {
        type,
        count,
        percentage,
        avgWeight: typeAvgWeight,
        avgVolume: typeAvgVolume
      }
    })
    
    // Sắp xếp theo số lượng giảm dần
    typeStats.sort((a, b) => b.count - a.count)
    
    // Dữ liệu cho biểu đồ tròn
    const pieData = typeStats.map(stat => ({
      name: stat.type,
      value: stat.count
    }))
    
    setStats({
      totalCount,
      avgWeight,
      avgVolume,
      typeStats,
      pieData
    })
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thống kê xoài</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tổng số xoài</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cân nặng trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.avgWeight.toFixed(2)}g</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Thể tích trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.avgVolume.toFixed(2)}cm<sup>3</sup></div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Phân tích phân loại</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Phân bố theo loại</p>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                  <Label 
                    position="center" 
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as { cx: number; cy: number };
                      return stats.pieData.map((entry, index) => (
                        <text
                          key={`label-${index}`}
                          x={cx + Math.cos(Math.PI * 2 * (index / stats.pieData.length)) * 150}
                          y={cy + Math.sin(Math.PI * 2 * (index / stats.pieData.length)) * 150}
                          textAnchor="middle"
                          fill={COLORS[index % COLORS.length]}
                          fontSize={16}
                          fontWeight="bold"
                        >
                          {entry.value}
                        </text>
                      ));
                    }}
                  />
                </Pie>
                <Tooltip formatter={(value) => [`${value} xoài`, 'Số lượng']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Phân tích chi tiết</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Phân bố cân nặng</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.typeStats.map((stat) => (
                <div key={stat.type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {stat.type}
                    </div>
                    <div className="text-right">{stat.count} mangoes</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Percentage</div>
                      <div className="font-semibold">{stat.percentage.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avg Weight</div>
                      <div className="font-semibold">{stat.avgWeight.toFixed(1)}g</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avg Volume</div>
                      <div className="font-semibold">{stat.avgVolume.toFixed(1)}cm<sup>3</sup></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function StatisticsPage() {
  return (
    <ProtectedRoute>
      <StatisticsContent />
    </ProtectedRoute>
  )
}

