'use client';

import { useEffect, useState } from 'react';
import { getMangoes } from '@/lib/api';
import type { Mango } from '@/types/mango';
import MangoList from '@/components/mango-list';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge, BarChart3, ListFilter } from "lucide-react"
import { Loading } from '@/components/ui/loading';

export default function Home() {
  const [mangoes, setMangoes] = useState<Mango[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMangoes = async () => {
      try {
        const data = await getMangoes();
        setMangoes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch mangoes');
      } finally {
        setLoading(false);
      }
    };

    fetchMangoes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Hệ thống phân loại, thống kê và đánh giá chất lượng xoài</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Phân loại, phân tích và xuất khẩu kho quả xoài của bạn với hệ thống quản lý chi tiết
        </p>
      </header>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <MangoList mangoes={mangoes} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-gray-800 flex items-center">
              <ListFilter className="mr-2 h-6 w-6 text-gray-600" />
              Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              View and filter mangoes by quality type. Categorize your inventory and export filtered lists.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                Type 1
              </span>
              <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Type 2
              </span>
              <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-sm font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
                Type 3
              </span>
            </div>
            <Button asChild className="w-full bg-gray-800 hover:bg-gray-700">
              <Link href="/classification">Go to Classification</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-gray-800 flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-gray-600" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Analyze your mango inventory with comprehensive statistics, charts, and distribution data.
            </p>
            <div className="h-12 bg-amber-50 rounded-md overflow-hidden mb-4">
              <div className="flex h-full">
                <div className="bg-green-500 h-full" style={{ width: "40%" }}></div>
                <div className="bg-yellow-500 h-full" style={{ width: "35%" }}></div>
                <div className="bg-red-500 h-full" style={{ width: "25%" }}></div>
              </div>
            </div>
            <Button asChild className="w-full bg-gray-800 hover:bg-gray-700">
              <Link href="/statistics">Go to Statistics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

