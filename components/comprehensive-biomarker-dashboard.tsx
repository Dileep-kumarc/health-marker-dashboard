"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Heart,
  Droplets,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  FileText,
  BarChart3,
  Filter,
  Magnet,
  Waves,
  Pill,
  HeartPulse,
  Microscope,
  ChevronRight,
  Eye,
} from "lucide-react"
import {
  comprehensiveData,
  biomarkerCategories,
  comprehensiveBiomarkerInfo,
  type ComprehensiveBiomarkerData,
} from "@/lib/comprehensive-data"
import { InteractiveBiomarkerModal } from "./interactive-biomarker-modal"

const iconMap = {
  Heart,
  Droplets,
  Activity,
  Filter,
  Zap,
  Magnet,
  Waves,
  Pill,
  HeartPulse,
  Microscope,
}

interface ClickableBiomarkerCardProps {
  title: string
  value: number
  unit: string
  biomarkerKey: string
  icon: React.ReactNode
  trend?: "up" | "down" | "stable"
  previousValue?: number
  description: string
  onClick: () => void
  riskLevel: "optimal" | "borderline" | "high"
}

function ClickableBiomarkerCard({
  title,
  value,
  unit,
  biomarkerKey,
  icon,
  trend,
  previousValue,
  description,
  onClick,
  riskLevel,
}: ClickableBiomarkerCardProps) {
  const riskInfo = {
    optimal: {
      color: "bg-green-50 text-green-800 border-green-200",
      icon: <CheckCircle className="h-4 w-4" />,
      text: "Optimal",
      message: "Within healthy range",
    },
    borderline: {
      color: "bg-amber-50 text-amber-800 border-amber-200",
      icon: <AlertTriangle className="h-4 w-4" />,
      text: "Borderline",
      message: "Monitor closely",
    },
    high: {
      color: "bg-red-50 text-red-800 border-red-200",
      icon: <AlertTriangle className="h-4 w-4" />,
      text: "Attention Needed",
      message: "Consult healthcare provider",
    },
  }

  const currentRisk = riskInfo[riskLevel]

  const getTrendIcon = () => {
    if (!trend || value === 0) return null
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendText = () => {
    if (!previousValue || value === 0) return ""
    const change = (((value - previousValue) / previousValue) * 100).toFixed(1)
    return (
      <span className="text-xs text-gray-600">
        {change > 0 ? "+" : ""}
        {change}% from previous
      </span>
    )
  }

  return (
    <Card
      className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 group cursor-pointer transform hover:scale-105"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
              {icon}
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                {title}
                <Eye className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {value} <span className="text-lg font-normal text-gray-500">{unit}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <Badge className={`${currentRisk.color} text-xs px-3 py-1.5 flex items-center gap-1.5 font-medium`}>
              {currentRisk.icon}
              {currentRisk.text}
            </Badge>
          </div>

          <p className="text-xs text-center text-gray-600 font-medium">{currentRisk.message}</p>

          {previousValue && <div className="text-center">{getTrendText()}</div>}
        </div>

        {/* Click indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ComprehensiveBiomarkerDashboard() {
  const [selectedBiomarker, setSelectedBiomarker] = useState("totalCholesterol")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [modalBiomarker, setModalBiomarker] = useState<string | null>(null)
  const biomarkerData = comprehensiveData

  const latestData = biomarkerData[biomarkerData.length - 1]
  const previousData = biomarkerData.length > 1 ? biomarkerData[biomarkerData.length - 2] : undefined

  const getTrend = (current: number, previous?: number): "up" | "down" | "stable" => {
    if (!previous || current === 0) return "stable"
    const diff = Math.abs(current - previous)
    const threshold = current * 0.05
    if (diff < threshold) return "stable"
    return current > previous ? "up" : "down"
  }

  const getRiskLevel = (value: number, biomarkerKey: string): "optimal" | "borderline" | "high" => {
    // Simplified risk assessment - would be more sophisticated in real implementation
    return "optimal" // Placeholder
  }

  // Filter biomarkers by category
  const filteredBiomarkers = useMemo(() => {
    if (selectedCategory === "all") {
      return Object.keys(comprehensiveBiomarkerInfo)
    }
    const category = biomarkerCategories.find((cat) => cat.name === selectedCategory)
    return category ? category.biomarkers : []
  }, [selectedCategory])

  const openBiomarkerModal = (biomarkerKey: string) => {
    setModalBiomarker(biomarkerKey)
  }

  const closeBiomarkerModal = () => {
    setModalBiomarker(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">EcoTown Health Analytics</h1>
                    <p className="text-sm text-gray-600 mt-1">Comprehensive Biomarker Intelligence Platform</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">MR. MANJUNATH SWAMY</span>
                  <Badge variant="secondary" className="text-xs">
                    56Y/M
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Latest Report: Apr 05, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Complete Health Panel</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Biomarker Categories
              </CardTitle>
              <CardDescription>
                Click on any category to filter biomarkers, or select individual biomarkers for detailed analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  All Biomarkers
                </Button>
                {biomarkerCategories.map((category) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap]
                  return (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className="flex items-center gap-2"
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {category.name}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Biomarker Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {selectedCategory === "all" ? "Complete Biomarker Profile" : selectedCategory}
                <Badge variant="outline" className="text-xs">
                  Click any card for details
                </Badge>
              </h2>
              <Badge variant="outline" className="text-xs">
                {filteredBiomarkers.length} biomarkers
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBiomarkers.map((biomarkerKey) => {
                const info = comprehensiveBiomarkerInfo[biomarkerKey as keyof typeof comprehensiveBiomarkerInfo]
                const currentValue = latestData[biomarkerKey as keyof ComprehensiveBiomarkerData] as number
                const previousValue = previousData?.[biomarkerKey as keyof ComprehensiveBiomarkerData] as number

                if (!info || currentValue === 0) return null

                // Get appropriate icon based on category
                const getIcon = () => {
                  switch (info.category) {
                    case "Lipid Profile":
                      return <Heart className="h-5 w-5 text-red-500" />
                    case "Complete Blood Count":
                      return <Droplets className="h-5 w-5 text-red-600" />
                    case "Liver Function":
                      return <Activity className="h-5 w-5 text-orange-500" />
                    case "Kidney Function":
                      return <Filter className="h-5 w-5 text-blue-500" />
                    case "Thyroid Function":
                      return <Zap className="h-5 w-5 text-purple-500" />
                    case "Iron Studies":
                      return <Magnet className="h-5 w-5 text-gray-600" />
                    case "Electrolytes":
                      return <Waves className="h-5 w-5 text-cyan-500" />
                    case "Minerals & Vitamins":
                      return <Pill className="h-5 w-5 text-green-500" />
                    case "Glucose Metabolism":
                      return <HeartPulse className="h-5 w-5 text-pink-500" />
                    case "Specialized Tests":
                      return <Microscope className="h-5 w-5 text-indigo-500" />
                    default:
                      return <Activity className="h-5 w-5 text-gray-500" />
                  }
                }

                return (
                  <ClickableBiomarkerCard
                    key={biomarkerKey}
                    title={info.name}
                    value={currentValue}
                    unit={info.unit}
                    biomarkerKey={biomarkerKey}
                    icon={getIcon()}
                    trend={getTrend(currentValue, previousValue)}
                    previousValue={previousValue}
                    description={info.description}
                    onClick={() => openBiomarkerModal(biomarkerKey)}
                    riskLevel={getRiskLevel(currentValue, biomarkerKey)}
                  />
                )
              })}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Optimal Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Excellent Glucose Control</p>
                    <p className="text-sm text-gray-600">HbA1c: {latestData.hba1c}% - Optimal diabetes management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Normal Blood Count</p>
                    <p className="text-sm text-gray-600">
                      Hemoglobin: {latestData.hemoglobin} g/dL - Healthy oxygen transport
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Stable Liver Function</p>
                    <p className="text-sm text-gray-600">SGOT/SGPT within normal limits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Areas for Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Vitamin D Deficiency</p>
                    <p className="text-sm text-gray-600">{latestData.vitaminD} ng/mL - Requires supplementation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Elevated PSA</p>
                    <p className="text-sm text-gray-600">{latestData.psa} ng/mL - Follow-up recommended</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Borderline Triglycerides</p>
                    <p className="text-sm text-gray-600">
                      {latestData.triglycerides} mg/dL - Lifestyle modifications needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interactive Modal */}
        {modalBiomarker && (
          <InteractiveBiomarkerModal
            isOpen={!!modalBiomarker}
            onClose={closeBiomarkerModal}
            biomarker={modalBiomarker}
            data={biomarkerData}
            biomarkerInfo={comprehensiveBiomarkerInfo[modalBiomarker as keyof typeof comprehensiveBiomarkerInfo]}
            currentValue={latestData[modalBiomarker as keyof ComprehensiveBiomarkerData] as number}
            previousValue={previousData?.[modalBiomarker as keyof ComprehensiveBiomarkerData] as number}
          />
        )}
      </div>
    </div>
  )
}
