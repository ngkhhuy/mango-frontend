import type { MangoStats } from "@/types/mango"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

interface StatisticsProps {
  stats: MangoStats
}

export default function Statistics({ stats }: StatisticsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader className="p-3 pb-0">
            <CardDescription>Total Count</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <p className="text-2xl font-bold text-amber-700">{stats.totalCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 pb-0">
            <CardDescription>Avg Weight</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <p className="text-2xl font-bold text-amber-700">{stats.averageWeight.toFixed(0)}g</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 pb-1">
          <CardDescription>Type Distribution</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="space-y-2">
            {Object.entries(stats.typeDistribution).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm">{type}</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-amber-100 rounded-full mr-2">
                    <div
                      className={`h-full rounded-full ${
                        type === "Type 1" ? "bg-green-500" : type === "Type 2" ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${(count / stats.totalCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-amber-700">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 pb-1">
          <CardDescription>Origin Distribution</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-1 max-h-32 overflow-y-auto">
          <div className="space-y-2">
            {Object.entries(stats.originDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([origin, count]) => (
                <div key={origin} className="flex justify-between items-center">
                  <span className="text-sm">{origin}</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-amber-100 rounded-full mr-2">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(count / stats.totalCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-amber-700">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

