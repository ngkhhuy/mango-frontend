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
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu xoài');
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
      </header>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <MangoList mangoes={mangoes} />
      )}
    </div>
  )
}

