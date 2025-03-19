"use client"

import type { MangoType } from "@/types/mango"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
  selectedType: MangoType | "All"
  onSelectType: (type: MangoType | "All") => void
  mangoCounts: {
    [key in MangoType | "All"]: number
  }
}

export default function CategorySelector({ selectedType, onSelectType, mangoCounts }: CategorySelectorProps) {
  const categories: (MangoType | "All")[] = ["All", "Type 1", "Type 2"]

  return (
    <div className="flex flex-col space-y-2">
      {categories.map((type) => (
        <Button
          key={type}
          variant="ghost"
          className={cn(
            "justify-start h-auto py-3 px-4 font-normal",
            selectedType === type
              ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "hover:bg-amber-50 text-amber-700",
          )}
          onClick={() => onSelectType(type)}
        >
          <div className="flex justify-between w-full">
            <span>{type}</span>
            <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs">{mangoCounts[type]}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}

