"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale, Thermometer, Upload, RefreshCw, Scan, AlertCircle } from "lucide-react"
import Image from "next/image"
import type { Mango, MangoType } from "@/types/mango"
import { Client } from "@gradio/client"

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<Mango | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      // Validate file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }

      setFile(selectedFile)
      setError(null)

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
      
      // Validate file size (limit to 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      // Validate file type
      if (!droppedFile.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }

      setFile(droppedFile)
      setError(null)

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

  const analyzeImage = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Connect to Gradio API
      const client = await Client.connect("ThahVinh/mango-classifier")
      
      // Call the predict endpoint
      const result = await client.predict("/predict", {
        image: file,
      })

      // Parse the API response
      const apiResponse = (result.data as string[])[0]
      console.log("API Response:", apiResponse)

      // Parse the classification result
      const parsedResult = parseClassificationResult(apiResponse)
      
      setResult(parsedResult)
    } catch (error) {
      console.error("Error analyzing image:", error)
      setError("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Function to parse API response and convert to Mango object
  const parseClassificationResult = (apiResponse: string): Mango => {
    // The API response might be in format like "Type 1: 0.85" or just "Type 1"
    // Parse based on the actual response format
    let classifyType: MangoType = "Type 1"
    let confidence = 0
    
    if (apiResponse.includes("Type 1")) {
      classifyType = "Type 1"
    } else if (apiResponse.includes("Type 2")) {
      classifyType = "Type 2"
    } else if (apiResponse.includes("Extra Class")) {
      classifyType = "Extra Class"
    }

    // Extract confidence if available
    const confidenceMatch = apiResponse.match(/(\d+\.?\d*)/)
    if (confidenceMatch) {
      confidence = parseFloat(confidenceMatch[1])
      // If confidence is between 0-1, keep as is. If > 1, assume it's percentage and convert
      if (confidence > 1) {
        confidence = confidence / 100
      }
    }

    // Only show classification result from API, no mock data
    const result: Mango = {
      id: String(Date.now()), // Use timestamp for unique ID
      classify: classifyType,
      weight: 0, // Not used, set to 0
      volume: 0, // Not used, set to 0
      createdAt: new Date().toISOString(),
      ripeness: "", // Not used
      origin: "AI Classification",
      metadata: {
        confidence: confidence,
        color: "", // Not used
        ripeness: "" // Not used
      }
    }

    return result
  }

  const resetScan = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Quét ảnh</h1>
        <p className="text-sm sm:text-base text-gray-600">Tải lên một bức ảnh quả xoài để phân loại chất lượng bằng AI</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Tải ảnh lên</CardTitle>
            <CardDescription>Hỗ trợ JPG, PNG, WEBP (tối đa 10MB)</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
            
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
                  <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button variant="outline" onClick={resetScan} disabled={!file} className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm lại
            </Button>
            <Button onClick={analyzeImage} disabled={!file || isAnalyzing} className="w-full sm:w-auto">
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang phân tích bằng AI...
                </>
              ) : (
                "Phân tích ảnh"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Kết quả phân loại</CardTitle>
            <CardDescription>
              {result
                ? "Phân tích thành công bằng AI, xem kết quả phía dưới"
                : "Tải ảnh lên để phân tích và xem kết quả"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold">{`${result.classify} Mango #${result.id}`}</h3>
                  <Badge className={getTypeColor(result.classify)}>{result.classify}</Badge>
                </div>

                {result.metadata?.confidence && result.metadata.confidence > 0 && (
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">AI Confidence</span>
                      <span className="text-sm text-gray-600">{(result.metadata.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(result.metadata.confidence || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <Label className="mb-2 block">AI Classification Result</Label>
                  <p className="text-sm">
                    {result.classify === "Type 1"
                      ? "Phân loại: Loại 1 - Chất lượng cao cấp"
                      : result.classify === "Type 2"
                        ? "Phân loại: Loại 2 - Chất lượng bình thường"
                        : "Phân loại: Đặc biệt - Chất lượng đặc biệt"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Kết quả được phân tích bởi AI dựa trên hình ảnh đã tải lên
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                  <Scan className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1">Chưa có kết quả</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                Tải lên hình ảnh xoài và nhấp vào "Phân tích hình ảnh" để nhận kết quả phân loại bằng AI
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
            <CardTitle>Giới thiệu về phân loại xoài</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">Type 1</Badge>
                <h3 className="font-medium">Chất lượng cao cấp</h3>
                <p className="text-sm text-gray-600">
                Độ chín hoàn hảo, màu sắc tuyệt hảo, không tì vết, trọng lượng lý tưởng và hương vị tuyệt hảo. Những quả xoài này có giá thị trường cao nhất.
                </p>
              </div>

              <div className="space-y-2">
                <Badge className="bg-yellow-100 text-yellow-800">Type 2</Badge>
                <h3 className="font-medium">Chất lượng bình thường</h3>
                <p className="text-sm text-gray-600">
                Độ chín tốt, màu sắc chấp nhận được, ít tì vết và trọng lượng chuẩn. Những quả xoài này phù hợp cho
                các thị trường bán lẻ và bán buôn thông thường.
                </p>
              </div>

              <div className="space-y-2">
                <Badge className="bg-red-100 text-red-800">Chất lượng đặc biệt</Badge>
                <h3 className="font-medium">Processing Quality</h3>
                <p className="text-sm text-gray-600">
                  Những quả có chất lượng tốt nhất trên thị trường
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

