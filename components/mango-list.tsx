import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import type { Mango } from '@/types/mango';

interface MangoListProps {
  mangoes: Mango[];
}

export default function MangoList({ mangoes }: MangoListProps) {
  // Debug log để xem cấu trúc dữ liệu
  console.log('Raw mangoes data:', JSON.stringify(mangoes, null, 2));

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mangoes.map((mango) => (
        <Card key={mango._id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-64">
            <Image
              src={mango.imageUrl}
              alt={`Mango ${mango._id}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-between">
              {/* Top section */}
              <div className="flex justify-between items-start">
                <Badge className={`${getTypeColor(mango.classify)} text-sm font-medium`}>
                  {mango.classify}
                </Badge>
                <div className="text-white text-xs">
                  {formatDate(mango.createdAt)}
                </div>
              </div>
              
              {/* Bottom section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-white">
                  <span className="text-sm font-medium">Weight:</span>
                  <span className="text-sm">{mango.weight}g</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span className="text-sm font-medium">Volume:</span>
                  <span className="text-sm">{mango.volume}cm³</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

