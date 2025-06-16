"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

interface DataPoint {
  date: string
  value: number
  fullDate: string
}

interface CustomLineChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  unit?: string
  title?: string
  clinicalRange?: {
    optimal: { min: number; max: number }
    borderline?: { min: number; max: number }
    high: { min: number; max: number }
  }
  onPointClick?: (point: DataPoint) => void
}

export function CustomLineChart({
  data,
  width = 800,
  height = 400,
  unit = "",
  title = "",
  clinicalRange,
  onPointClick,
}: CustomLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSmoothing, setShowSmoothing] = useState(false)

  const chartConfig = useMemo(() => {
    if (data.length === 0) return null

    const padding = { top: 60, right: 60, bottom: 100, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Use clinical range for better Y-axis scaling
    let minValue: number
    let maxValue: number

    if (clinicalRange) {
      minValue = Math.max(0, Math.min(clinicalRange.optimal.min, ...data.map((d) => d.value)) - 30)
      maxValue = Math.max(clinicalRange.high.max, ...data.map((d) => d.value)) + 30
    } else {
      const dataMin = Math.min(...data.map((d) => d.value))
      const dataMax = Math.max(...data.map((d) => d.value))
      let valueRange = dataMax - dataMin
      // If all values are the same or very close, add a buffer
      if (valueRange < 1e-3) {
        minValue = dataMin - 1
        maxValue = dataMax + 1
        valueRange = 2
      } else {
        minValue = Math.max(0, dataMin - valueRange * 0.1)
        maxValue = dataMax + valueRange * 0.1
      }
    }

    const valueRange = maxValue - minValue

    const points = data.map((point, index) => {
      const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth
      const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight
      return { x, y, ...point }
    })

    return {
      points,
      padding,
      chartWidth,
      chartHeight,
      minValue,
      maxValue,
      valueRange,
    }
  }, [data, width, height, clinicalRange])

  // Moving average calculation
  const movingAverage = useMemo(() => {
    if (!showSmoothing || data.length < 3) return []
    const avg: { x: number; y: number }[] = []
    for (let i = 1; i < data.length - 1; i++) {
      const value = (data[i - 1].value + data[i].value + data[i + 1].value) / 3
      avg.push({
        x: i,
        y: value,
      })
    }
    return avg
  }, [showSmoothing, data])

  // Smoothing path
  const smoothingPath = useMemo(() => {
    if (!showSmoothing || movingAverage.length === 0 || !chartConfig) return ''
    const { padding, chartWidth, chartHeight, minValue, valueRange } = chartConfig
    const points = movingAverage.map((pt, i) => {
      const x = padding.left + ((pt.x) / Math.max(data.length - 1, 1)) * chartWidth
      const y = padding.top + chartHeight - ((pt.y - minValue) / valueRange) * chartHeight
      return { x, y }
    })
    if (points.length < 2) return ''
    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }
    return path
  }, [showSmoothing, movingAverage, chartConfig, data.length])

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Enhanced smooth curve path with more natural fluctuations
  const createSmoothPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length < 2) return ""

    if (points.length === 2) {
      // For 2 points, create a slight curve instead of straight line
      const midX = (points[0].x + points[1].x) / 2
      const midY = (points[0].y + points[1].y) / 2
      const controlY = midY - 15 // Slight curve upward
      return `M ${points[0].x} ${points[0].y} Q ${midX} ${controlY} ${points[1].x} ${points[1].y}`
    }

    // For multiple points, use cubic Bezier curves for smoother, more natural lines
    let path = `M ${points[0].x} ${points[0].y}`

    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1]
      const currentPoint = points[i]
      const nextPoint = points[i + 1]

      // Calculate control points for smooth curves
      const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3
      const cp1y = prevPoint.y

      const cp2x = currentPoint.x - (currentPoint.x - prevPoint.x) * 0.3
      let cp2y = currentPoint.y

      // Add some natural variation for more realistic biomarker curves
      if (nextPoint) {
        const slope = (nextPoint.y - prevPoint.y) / (nextPoint.x - prevPoint.x)
        cp2y = currentPoint.y - slope * 5 // Adjust based on overall trend
      }

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currentPoint.x} ${currentPoint.y}`
    }

    return path
  }

  // Get zone info for current value
  const getZoneInfo = (value: number) => {
    if (!clinicalRange) return { zone: "Unknown", color: "#6b7280", status: "normal" }

    if (value >= clinicalRange.optimal.min && value <= clinicalRange.optimal.max) {
      return { zone: "Optimal Range", color: "#16a34a", status: "optimal" }
    }
    if (clinicalRange.borderline && value >= clinicalRange.borderline.min && value <= clinicalRange.borderline.max) {
      return { zone: "Borderline", color: "#d97706", status: "borderline" }
    }
    return { zone: "Requires Attention", color: "#dc2626", status: "high" }
  }

  if (!chartConfig || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-600 font-medium">No data available for {title}</p>
          <p className="text-sm text-gray-500 mt-2">Upload a health report to view your biomarker trends</p>
        </div>
      </div>
    )
  }

  const { points, padding, chartWidth, chartHeight, minValue, maxValue } = chartConfig

  // Create smooth path with enhanced curves
  const pathData = createSmoothPath(points)

  // Generate Y-axis ticks with better spacing and uniqueness
  let yTicks = []
  const tickCount = 8
  if (maxValue === minValue) {
    // All values are the same, force a buffer
    const v = minValue
    yTicks = [v - 1, v, v + 1].map((value, i) => ({ value, y: padding.top + chartHeight - ((value - (v - 1)) / 2) * chartHeight }))
  } else {
    // Ensure at least 3 unique ticks: min, mid, max
    const step = (maxValue - minValue) / (tickCount > 2 ? tickCount : 2)
    let lastTick = null
    for (let i = 0; i <= tickCount; i++) {
      let value = minValue + (maxValue - minValue) * (i / tickCount)
      value = Math.round(value * 100) / 100
      if (lastTick === null || Math.abs(value - lastTick) > 1e-6) {
        yTicks.push({ value, y: padding.top + chartHeight - (i / tickCount) * chartHeight })
        lastTick = value
      }
    }
    // If all ticks are still the same, fallback to min-1, min, min+1
    if (yTicks.length < 3) {
      const v = minValue
      yTicks = [v - 1, v, v + 1].map((value, i) => ({ value, y: padding.top + chartHeight - ((value - (v - 1)) / 2) * chartHeight }))
    }
  }

  // Clinical range lines
  const getRangeY = (value: number) => {
    return padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight
  }

  // Get latest value info
  const latestValue = points[points.length - 1]?.value || 0
  const zoneInfo = getZoneInfo(latestValue)

  return (
    <div className="relative w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Chart Title with Status */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title} Trend Analysis</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zoneInfo.color }}></div>
            <span className="text-sm font-medium" style={{ color: zoneInfo.color }}>
              {zoneInfo.zone}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            Current: {latestValue} {unit}
          </span>
        </div>
      </div>
      {/* Smoothing toggle and legend */}
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showSmoothing} onChange={e => setShowSmoothing(e.target.checked)} />
          Show Moving Average (3-point)
        </label>
        <div className="flex gap-4 text-xs items-center">
          <span className="inline-flex items-center"><span className="w-4 h-1 rounded bg-blue-500 mr-1 inline-block"></span>Biomarker Value</span>
          <span className="inline-flex items-center"><span className="w-4 h-1 rounded bg-blue-300 mr-1 inline-block"></span>Moving Avg</span>
          <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-green-300 mr-1 inline-block"></span>Optimal</span>
          <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-red-400 mr-1 inline-block"></span>Out of Range</span>
        </div>
      </div>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        aria-label="Zoom and pan chart area"
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="flex gap-2 mb-2 justify-end">
              <button onClick={zoomIn} className="px-2 py-1 bg-gray-100 rounded border text-xs" aria-label="Zoom in">+</button>
              <button onClick={zoomOut} className="px-2 py-1 bg-gray-100 rounded border text-xs" aria-label="Zoom out">-</button>
              <button onClick={resetTransform} className="px-2 py-1 bg-gray-100 rounded border text-xs" aria-label="Reset zoom">Reset</button>
            </div>
            <TransformComponent>
              <svg
                width={width}
                height={height}
                className="w-full h-auto"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredPoint(null)}
                role="img"
                aria-label={`Biomarker trend chart for ${title}`}
              >
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="url(#grid)" />

                {/* Clinical range background zones */}
                {clinicalRange && (
                  <>
                    {/* Optimal Zone */}
                    <rect
                      x={padding.left}
                      y={getRangeY(clinicalRange.optimal.max)}
                      width={chartWidth}
                      height={getRangeY(clinicalRange.optimal.min) - getRangeY(clinicalRange.optimal.max)}
                      fill="#dcfce7"
                      opacity="0.4"
                    />
                    <text
                      x={padding.left + 10}
                      y={getRangeY(clinicalRange.optimal.max) + 20}
                      fontSize="11"
                      fill="#16a34a"
                      fontWeight="600"
                    >
                      OPTIMAL RANGE
                    </text>

                    {/* Borderline Zone */}
                    {clinicalRange.borderline && (
                      <>
                        <rect
                          x={padding.left}
                          y={getRangeY(clinicalRange.borderline.max)}
                          width={chartWidth}
                          height={getRangeY(clinicalRange.borderline.min) - getRangeY(clinicalRange.borderline.max)}
                          fill="#fef3c7"
                          opacity="0.4"
                        />
                        <text
                          x={padding.left + 10}
                          y={getRangeY(clinicalRange.borderline.max) + 20}
                          fontSize="11"
                          fill="#d97706"
                          fontWeight="600"
                        >
                          BORDERLINE
                        </text>
                      </>
                    )}

                    {/* High Risk Zone */}
                    <rect
                      x={padding.left}
                      y={padding.top}
                      width={chartWidth}
                      height={getRangeY(clinicalRange.high.min) - padding.top}
                      fill="#fecaca"
                      opacity="0.4"
                    />
                    <text x={padding.left + 10} y={padding.top + 20} fontSize="11" fill="#dc2626" fontWeight="600">
                      REQUIRES ATTENTION
                    </text>
                  </>
                )}

                {/* Area under curve for better visualization */}
                {points.length > 1 && (
                  <path
                    d={`${pathData} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`}
                    fill="url(#areaGradient)"
                  />
                )}

                {/* Chart border */}
                <rect
                  x={padding.left}
                  y={padding.top}
                  width={chartWidth}
                  height={chartHeight}
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="1"
                />

                {/* Y-axis labels */}
                {yTicks.map((tick, index) => (
                  <g key={index}>
                    <line x1={padding.left - 6} y1={tick.y} x2={padding.left} y2={tick.y} stroke="#9ca3af" strokeWidth="1" />
                    <text x={padding.left - 10} y={tick.y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
                      {tick.value}
                    </text>
                  </g>
                ))}

                {/* Y-axis unit label */}
                <text
                  x={25}
                  y={padding.top + chartHeight / 2}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                  fontWeight="500"
                  transform={`rotate(-90, 25, ${padding.top + chartHeight / 2})`}
                >
                  {unit}
                </text>

                {/* X-axis labels */}
                {points.map((point, index) => (
                  <g key={index}>
                    <line
                      x1={point.x}
                      y1={padding.top + chartHeight}
                      x2={point.x}
                      y2={padding.top + chartHeight + 6}
                      stroke="#9ca3af"
                      strokeWidth="1"
                    />
                    <text
                      x={point.x}
                      y={padding.top + chartHeight + 20}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6b7280"
                      transform={`rotate(-20, ${point.x}, ${padding.top + chartHeight + 20})`}
                    >
                      {point.date}
                    </text>
                  </g>
                ))}

                {/* Enhanced data line with smooth curves */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Smoothing line */}
                {showSmoothing && smoothingPath && (
                  <path d={smoothingPath} fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="6 4" />
                )}

                {/* Data points with enhanced styling */}
                {points.map((point, index) => (
                  <g key={index}>
                    {/* Hover effect */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="8"
                      fill="rgba(59, 130, 246, 0.1)"
                      className={hoveredPoint === point ? "opacity-100" : "opacity-0"}
                    />
                    {/* Main point */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={hoveredPoint === point ? "6" : "4"}
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredPoint(point)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Professional Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-20 bg-white border border-gray-300 rounded-lg shadow-lg p-4 pointer-events-none"
          style={{
            left: Math.min(mousePosition.x + 15, width - 220),
            top: Math.max(mousePosition.y - 90, 10),
          }}
        >
          <div className="text-xs text-gray-500 mb-1">{formatFullDate(hoveredPoint.fullDate)}</div>
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {hoveredPoint.value} {unit}
          </div>
          <div className="text-sm text-gray-700">{title}</div>
          <div
            className="mt-2 text-xs px-2 py-1 rounded"
            style={{
              backgroundColor: getZoneInfo(hoveredPoint.value).color + "15",
              color: getZoneInfo(hoveredPoint.value).color,
            }}
          >
            {getZoneInfo(hoveredPoint.value).zone}
          </div>
        </div>
      )}

      {/* Trend indicator */}
      {points.length > 1 && (
        <div className="absolute top-4 right-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-1">Trend</div>
          <div className="flex items-center gap-2">
            {points[points.length - 1].value > points[0].value ? (
              <>
                <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-l-transparent border-r-transparent border-b-red-500"></div>
                <span className="text-xs text-red-600 font-medium">Increasing</span>
              </>
            ) : points[points.length - 1].value < points[0].value ? (
              <>
                <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-l-transparent border-r-transparent border-t-green-500"></div>
                <span className="text-xs text-green-600 font-medium">Decreasing</span>
              </>
            ) : (
              <>
                <div className="w-3 h-0.5 bg-gray-500"></div>
                <span className="text-xs text-gray-600 font-medium">Stable</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
