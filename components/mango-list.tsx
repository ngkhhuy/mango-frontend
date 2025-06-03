"use client"

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import type { Mango } from '@/types/mango';

interface MangoListProps {
  mangoes: Mango[];
  showVolume?: boolean;  // Thêm prop tùy chọn
}

export default function MangoList({ mangoes, showVolume = true }: MangoListProps) {
  // Debug log để xem cấu trúc dữ liệu
  console.log('Raw mangoes data:', JSON.stringify(mangoes, null, 2));

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Type 1":
        return "bg-green-500"
      case "Type 2":
        return "bg-yellow-500"
      case "Extra Class":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string | number) => {
    try {
      const date = typeof dateString === 'number' 
        ? new Date(dateString) 
        : parseISO(dateString);
      return format(date, 'dd MMM yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (!Array.isArray(mangoes)) {
    console.error('Mangoes is not an array:', mangoes);
    return <div>No mangoes data available</div>;
  }

  if (!mangoes || mangoes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Không có dữ liệu xoài</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {mangoes.map((mango) => (
        <Card key={mango._id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 md:h-64">
            <Image
              src={mango.imageUrl}
              alt={`Xoài ${mango._id}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 p-3 md:p-4 flex flex-col justify-between">
              {/* Top section */}
              <div className="flex justify-between items-start">
                <Badge className={`${getTypeColor(mango.classify)} text-xs md:text-sm font-medium`}>
                  {mango.classify}
                </Badge>
                <div className="text-white text-xs">
                  {formatDate(mango.createdAt)}
                </div>
              </div>
              
              {/* Bottom section */}
              <div className="space-y-1 md:space-y-2">
                <div className="flex justify-between items-center text-white">
                  <span className="text-xs md:text-sm font-medium">Cân nặng:</span>
                  <span className="text-xs md:text-sm">{mango.weight}g</span>
                </div>
                {showVolume && (
                  <div className="flex justify-between items-center text-white">
                    <span className="text-xs md:text-sm font-medium">Thể tích:</span>
                    <span className="text-xs md:text-sm">{mango.volume}cm³</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

