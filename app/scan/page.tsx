"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale, Thermometer, Upload, RefreshCw, Scan } from "lucide-react"
import Image from "next/image"
import type { Mango, MangoType } from "@/types/mango"

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<Mango | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)

      // Reset result
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)

      // Reset result
      setResult(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const analyzeImage = () => {
    if (!file) return

    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock classification result
      // In a real app, this would come from an API call to a machine learning model
      const mangoTypes: MangoType[] = ["Type 1", "Type 2", "Extra Class"]
      const randomType = mangoTypes[Math.floor(Math.random() * mangoTypes.length)]
      
      // Cập nhật để phù hợp với định nghĩa Mango trong codebase
      const mockResult: Mango = {
        id: String(Math.floor(Math.random() * 1000)), // Chuyển thành string
        classify: randomType, // Sử dụng classify thay cho type
        weight: Math.floor(Math.random() * (350 - 180) + 180), // Random weight between 180-350g
        volume: Math.floor(Math.random() * (200 - 100) + 100), // Thêm volume
        createdAt: new Date().toISOString(),
        ripeness: randomType === "Type 1" ? "Perfect" : randomType === "Type 2" ? "Good" : "Overripe",
        origin: "Scan Result"
      }

      setResult(mockResult)
      setIsAnalyzing(false)
    }, 2000)
  }

  const resetScan = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Helper function to get color for mango type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Type 1":
        return "bg-green-100 text-green-800"
      case "Type 2":
        return "bg-yellow-100 text-yellow-800"
      case "Extra Class":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mango Scanner</h1>
        <p className="text-sm sm:text-base text-gray-600">Upload a mango image to classify its type and quality</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Drag and drop a mango image or click to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center ${
                preview ? "border-gray-300" : "border-gray-400 hover:border-gray-500"
              } transition-colors cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

              {preview ? (
                <div className="relative h-48 sm:h-64 w-full">
                  <Image src={preview || "/placeholder.svg"} alt="Mango preview" fill className="object-contain" />
                </div>
              ) : (
                <div className="py-8 sm:py-12">
                  <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button variant="outline" onClick={resetScan} disabled={!file} className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={analyzeImage} disabled={!file || isAnalyzing} className="w-full sm:w-auto">
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Image"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Classification Result</CardTitle>
            <CardDescription>
              {result
                ? "Analysis complete. See the classification details below."
                : "Upload and analyze an image to see results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold">{`${result.classify} Mango #${result.id}`}</h3>
                  <Badge className={getTypeColor(result.classify)}>{result.classify}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Scale className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500" />
                      <span className="font-medium">Weight</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{result.weight}g</p>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500" />
                      <span className="font-medium">Ripeness</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{result.metadata?.ripeness || "Unknown"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <Label className="mb-2 block">Color</Label>
                  <div className="flex items-center">
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full mr-2 border border-gray-300"
                      style={{
                        backgroundColor:
                          result.classify === "Type 1" ? "#FFD700" : result.classify === "Type 2" ? "#ADFF2F" : "#D2B48C",
                      }}
                    />
                    <span>{result.metadata?.color || "Unknown"}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <Label className="mb-2 block">Quality Assessment</Label>
                  <p className="text-xs sm:text-sm">
                    {result.classify === "Type 1"
                      ? "Premium quality mango with excellent color, texture, and ripeness. Ideal for direct consumption and premium markets."
                      : result.classify === "Type 2"
                        ? "Good quality mango with minor imperfections. Suitable for regular retail and processing."
                        : "Lower quality mango with visible defects. Recommended for immediate processing or juice production."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                  <Scan className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1">No Results Yet</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Upload a mango image and click "Analyze Image" to get classification results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information section */}
      <div className="mt-6 sm:mt-8">
        <Card>
          <CardHeader>
            <CardTitle>About Mango Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">Type 1</Badge>
                <h3 className="font-medium">Premium Quality</h3>
                <p className="text-sm text-gray-600">
                  Perfect ripeness, excellent color, no blemishes, ideal weight, and superior taste profile. These
                  mangoes command the highest market price.
                </p>
              </div>

              <div className="space-y-2">
                <Badge className="bg-yellow-100 text-yellow-800">Type 2</Badge>
                <h3 className="font-medium">Standard Quality</h3>
                <p className="text-sm text-gray-600">
                  Good ripeness, acceptable color, minor blemishes, and standard weight. These mangoes are suitable for
                  regular retail and wholesale markets.
                </p>
              </div>

              <div className="space-y-2">
                <Badge className="bg-red-100 text-red-800">Extra Class</Badge>
                <h3 className="font-medium">Processing Quality</h3>
                <p className="text-sm text-gray-600">
                  Overripe or underripe, color defects, visible blemishes, or irregular weight. These mangoes are best
                  used for juices, purees, or other processed products.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

