'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMangoes } from '@/lib/api';
import type { Mango } from '@/types/mango';
import MangoList from '@/components/mango-list';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge, BarChart3, ListFilter } from "lucide-react"
import { Loading } from '@/components/ui/loading';

export default function Home() {
  const router = useRouter();
  const [mangoes, setMangoes] = useState<Mango[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Kiểm tra xác thực và chuyển hướng nếu cần
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          // Nếu không có token, chuyển hướng đến trang đăng nhập
          router.push('/login');
        } else {
          // Nếu có token, đánh dấu là đã xác thực
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Tải dữ liệu xoài nếu đã xác thực
  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [isAuthenticated]);

  // Nếu chưa xác định trạng thái xác thực hoặc đang tải, hiển thị loading
  if (isAuthenticated === null || (isAuthenticated && loading)) {
    return <Loading />;
  }

  // Nếu đã xác thực và có lỗi, hiển thị thông báo lỗi
  if (isAuthenticated && error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  // Nếu đã xác thực và tải xong dữ liệu, hiển thị danh sách xoài
  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hệ thống phân loại, thống kê và đánh giá chất lượng xoài</h1>
        </header>
        <MangoList mangoes={mangoes} />
      </div>
    );
  }

  // Trường hợp mặc định (không nên xảy ra)
  return <Loading />;
}

