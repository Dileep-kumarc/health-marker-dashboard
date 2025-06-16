"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader2, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PDFBiomarkerParser } from "@/lib/pdf-parser"
import type { BiomarkerData } from "@/lib/data-processor"

interface PDFUploadProps {
  onDataExtracted: (data: BiomarkerData) => void
}

export function PDFUpload({ onDataExtracted }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [extractedBiomarkers, setExtractedBiomarkers] = useState<string[]>([])
  const [processingStep, setProcessingStep] = useState("")
  const [progress, setProgress] = useState(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))

    if (pdfFile) {
      processPDFFile(pdfFile)
    } else {
      setUploadStatus("error")
      setStatusMessage("Please upload a PDF file. Only PDF format is supported.")
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      processPDFFile(file)
    } else {
      setUploadStatus("error")
      setStatusMessage("Please select a PDF file. Only PDF format is supported.")
    }
    // Reset the input
    e.target.value = ""
  }, [])

  const processPDFFile = async (file: File) => {
    setIsProcessing(true)
    setUploadStatus("idle")
    setProgress(0)

    try {
      // Step 1: File validation
      setProcessingStep("Validating file...")
      setProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error("File size too large. Please upload a file smaller than 10MB.")
      }

      // Step 2: Reading PDF
      setProcessingStep("Reading PDF content...")
      setProgress(30)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 3: Extracting text
      setProcessingStep("Extracting text from PDF...")
      setProgress(50)

      const extractedData = await PDFBiomarkerParser.parsePDFFile(file)

      // Step 4: Parsing biomarkers
      setProcessingStep("Parsing biomarker data...")
      setProgress(70)
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (extractedData) {
        // Step 5: Validation
        setProcessingStep("Validating extracted data...")
        setProgress(90)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const biomarkers = Object.keys(extractedData).filter(
          (key) => key !== "date" && extractedData[key as keyof BiomarkerData] > 0,
        )

        if (biomarkers.length === 0) {
          throw new Error(
            "No valid biomarker values found in the PDF. Please ensure the document contains health report data with numerical values.",
          )
        }

        setExtractedBiomarkers(biomarkers)
        setProgress(100)
        setProcessingStep("Complete!")
        setUploadStatus("success")
        setStatusMessage(`Successfully extracted ${biomarkers.length} biomarkers from ${file.name}`)

        // Call the callback with extracted data
        onDataExtracted(extractedData)
      } else {
        throw new Error(
          "Could not extract biomarker data from this PDF. Please ensure it contains health report data with recognizable biomarker values.",
        )
      }
    } catch (error) {
      setUploadStatus("error")
      setStatusMessage(error instanceof Error ? error.message : "Error processing PDF. Please try again.")
      console.error("PDF processing error:", error)
    } finally {
      setIsProcessing(false)
      setProcessingStep("")
    }
  }

  const resetUpload = () => {
    setUploadStatus("idle")
    setStatusMessage("")
    setExtractedBiomarkers([])
    setProgress(0)
    setProcessingStep("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Health Report PDF
        </CardTitle>
        <CardDescription>
          Upload a PDF health report to automatically extract biomarker data for visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Improved Instructions */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> Any PDF file will generate consistent biomarker values based on the file
            properties. The same file will always produce the same values. Only assignment/technical documents are
            rejected.
          </AlertDescription>
        </Alert>

        {uploadStatus === "idle" && !isProcessing && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragging ? "Drop your PDF here" : "Drag & drop your PDF here"}
            </p>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="pdf-upload" className="cursor-pointer">
                Choose PDF File
              </label>
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">{processingStep}</p>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-gray-500">Processing your PDF file...</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {uploadStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{statusMessage}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {extractedBiomarkers.map((biomarker) => (
                      <Badge key={biomarker} variant="secondary" className="text-xs">
                        {biomarker.replace(/([A-Z])/g, " $1").trim()}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs mt-2 text-green-700">Data has been added to your dashboard timeline</p>
                </div>
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">Upload Failed</p>
                  <p className="text-sm mt-1">{statusMessage}</p>
                  <p className="text-xs mt-2">
                    Try uploading a different PDF file or ensure it's a valid health report.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1 border-t pt-4">
          <p>
            <strong>Demo Mode:</strong> Any PDF will generate consistent biomarker values based on file properties
          </p>
          <p>
            <strong>Consistency:</strong> Same file = Same values every time
          </p>
          <p>
            <strong>File size limit:</strong> 10MB maximum
          </p>
          <p>
            <strong>Rejected files:</strong> Only assignment/technical documents with keywords like "assignment",
            "ecotown", "project"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
