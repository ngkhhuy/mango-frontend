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
  // Loại bỏ avgVolume
}

function StatisticsContent() {
  const [mangoes, setMangoes] = useState<Mango[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCount: 0,
    avgWeight: 0,
    // Loại bỏ avgVolume
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
        // Loại bỏ avgVolume: 0,
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
    
    // Loại bỏ phần tính thể tích trung bình
    
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
      
      // Loại bỏ phần tính thể tích trung bình
      
      return {
        type,
        count,
        percentage,
        avgWeight: typeAvgWeight,
        // Loại bỏ avgVolume: typeAvgVolume
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
      // Loại bỏ avgVolume,
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
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Thống kê xoài</h1>
      
      {/* Chỉ hiển thị 2 cards thay vì 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-medium">Tổng số xoài</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold">{stats.totalCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-medium">Cân nặng trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold">{stats.avgWeight.toFixed(2)}g</div>
          </CardContent>
        </Card>
        
        {/* Loại bỏ card thể tích trung bình */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="order-2 md:order-1">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Phân tích phân loại</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Phân bố theo loại</p>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
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
                      return stats.pieData.map((entry, index) => {
                        const radius = window.innerWidth < 768 ? 120 : 150;
                        return (
                          <text
                            key={`label-${index}`}
                            x={cx + Math.cos(Math.PI * 2 * (index / stats.pieData.length)) * radius}
                            y={cy + Math.sin(Math.PI * 2 * (index / stats.pieData.length)) * radius}
                            textAnchor="middle"
                            fill={COLORS[index % COLORS.length]}
                            fontSize={window.innerWidth < 768 ? 14 : 16}
                            fontWeight="bold"
                          >
                            {entry.value}
                          </text>
                        );
                      });
                    }}
                  />
                </Pie>
                <Tooltip formatter={(value) => [`${value} xoài`, 'Số lượng']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="order-1 md:order-2">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Phân tích chi tiết</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Phân bố cân nặng</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.typeStats.map((stat) => (
                <div key={stat.type} className="border rounded-lg p-3 md:p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-gray-100 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      {stat.type}
                    </div>
                    <div className="text-right text-xs md:text-sm">{stat.count} mangoes</div>
                  </div>
                  
                  {/* Grid với 2 cột thay vì 3 cột */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <div className="text-xs md:text-sm text-gray-500">Percentage</div>
                      <div className="text-sm md:text-base font-semibold">{stat.percentage.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-gray-500">Avg Weight</div>
                      <div className="text-sm md:text-base font-semibold">{stat.avgWeight.toFixed(1)}g</div>
                    </div>
                    {/* Loại bỏ phần hiển thị Avg Volume */}
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

