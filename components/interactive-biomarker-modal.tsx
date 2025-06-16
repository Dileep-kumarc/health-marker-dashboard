"use client"
import { X, TrendingUp, TrendingDown, CheckCircle, Info, BookOpen, Activity, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomLineChart } from "./custom-line-chart"
import React from "react"

interface BiomarkerModalProps {
  isOpen: boolean
  onClose: () => void
  biomarker: string
  data: any[]
  biomarkerInfo: any
  currentValue: number
  previousValue?: number
}

export function InteractiveBiomarkerModal({
  isOpen,
  onClose,
  biomarker,
  data,
  biomarkerInfo,
  currentValue,
  previousValue,
}: BiomarkerModalProps) {
  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !biomarkerInfo) return null

  const chartData = data
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }),
      value: item[biomarker] || 0,
      fullDate: item.date,
    }))
    .filter((item) => item.value > 0)

  const getTrendInfo = () => {
    if (!previousValue || currentValue === 0) return null
    const change = ((currentValue - previousValue) / previousValue) * 100
    const isImproving = change < 0 // For most biomarkers, lower is better

    return {
      change: Math.abs(change).toFixed(1),
      direction: change > 0 ? "up" : "down",
      isImproving,
      icon: change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
    }
  }

  const getRiskLevel = (value: number) => {
    // This would be more sophisticated in a real implementation
    if (biomarkerInfo.interpretation) {
      // Simple logic - would need proper ranges for each biomarker
      return "normal" // Placeholder
    }
    return "normal"
  }

  const trend = getTrendInfo()
  const riskLevel = getRiskLevel(currentValue)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label={`Details for ${biomarkerInfo.name}`}>
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl focus:outline-none" tabIndex={-1}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{biomarkerInfo.name}</h2>
              <p className="text-gray-600">{biomarkerInfo.category}</p>
              <div className="text-xs text-gray-500 mt-1">{biomarkerInfo.date && <>Date: {biomarkerInfo.date} | </>}{biomarkerInfo.value !== undefined && <>Value: {biomarkerInfo.value} {biomarkerInfo.unit} | </>}{biomarkerInfo.normalRange && <>Range: {biomarkerInfo.normalRange} | </>}{biomarkerInfo.fileName && <>Source: {biomarkerInfo.fileName}</>}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close details modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
              <TabsTrigger value="clinical">Clinical Info</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Current Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Current Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {currentValue} <span className="text-lg font-normal text-gray-500">{biomarkerInfo.unit}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Within Range
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Reference Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-gray-900 mb-2">{biomarkerInfo.normalRange}</div>
                    <p className="text-sm text-gray-600">{biomarkerInfo.unit}</p>
                  </CardContent>
                </Card>

                {trend && (
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        {trend.icon}
                        <span className="text-xl font-semibold">{trend.change}%</span>
                      </div>
                      <p className="text-sm text-gray-600">vs. previous test</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    About This Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{biomarkerInfo.description}</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Clinical Significance</h4>
                    <p className="text-blue-800 text-sm">{biomarkerInfo.clinicalSignificance}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Historical Trends</CardTitle>
                  <CardDescription>Track your {biomarkerInfo.name.toLowerCase()} levels over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomLineChart
                    data={chartData}
                    width={800}
                    height={400}
                    unit={biomarkerInfo.unit}
                    title={biomarkerInfo.name}
                  />
                </CardContent>
              </Card>

              {/* Trend Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistical Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-semibold">
                        {(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toFixed(1)}{" "}
                        {biomarkerInfo.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Highest:</span>
                      <span className="font-semibold">
                        {Math.max(...chartData.map((item) => item.value))} {biomarkerInfo.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lowest:</span>
                      <span className="font-semibold">
                        {Math.min(...chartData.map((item) => item.value))} {biomarkerInfo.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Points:</span>
                      <span className="font-semibold">{chartData.length} measurements</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pattern Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Stable trend observed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Within normal variation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-sm">Monitor for changes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clinical" className="space-y-6">
              {/* Interpretation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Clinical Interpretation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {biomarkerInfo.interpretation && (
                    <div className="space-y-4">
                      {Object.entries(biomarkerInfo.interpretation).map(([level, description]) => (
                        <div key={level} className="border-l-4 border-l-gray-300 pl-4">
                          <h4 className="font-semibold capitalize text-gray-800">{level}</h4>
                          <p className="text-gray-600 text-sm">{description as string}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Factors Affecting Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Factors Affecting Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{biomarkerInfo.factors}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Management Strategies</h4>
                    <p className="text-green-800">{biomarkerInfo.recommendations}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow-up Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Recheck in 3-6 months for routine monitoring</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">Consult healthcare provider if values change significantly</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Continue current lifestyle modifications</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
