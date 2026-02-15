"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Gauge, Download, AlertTriangle, TrendingDown } from "lucide-react"
import jsPDF from "jspdf"
import { EmailCaptureModal } from "@/components/marketing/email-capture-modal"

interface OEEInputs {
  plannedProductionTime: number
  plannedStops: number
  unplannedDowntime: number
  idealCycleTime: number
  totalPartsProduced: number
  defectiveParts: number
}

interface OEEResults {
  availability: number
  performance: number
  quality: number
  oee: number
  runTimeMinutes: number
  idealRunRate: number
  goodParts: number
  losses: {
    breakdownLoss: number
    setupLoss: number
    minorStopsLoss: number
    speedLoss: number
    defectLoss: number
    startupLoss: number
  }
  totalLossMinutes: number
  benchmark: "world-class" | "typical" | "low"
}

export default function OEECalculatorPage() {
  const [inputs, setInputs] = useState<OEEInputs>({
    plannedProductionTime: 8,
    plannedStops: 30,
    unplannedDowntime: 45,
    idealCycleTime: 60,
    totalPartsProduced: 300,
    defectiveParts: 15,
  })

  const [showEmailModal, setShowEmailModal] = useState(false)

  const updateInput = (field: keyof OEEInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const calculateOEE = (): OEEResults => {
    const {
      plannedProductionTime,
      plannedStops,
      unplannedDowntime,
      idealCycleTime,
      totalPartsProduced,
      defectiveParts,
    } = inputs

    const plannedProductionMinutes = plannedProductionTime * 60
    const runTimeMinutes = Math.max(plannedProductionMinutes - plannedStops - unplannedDowntime, 0)

    const availability = plannedProductionMinutes > 0
      ? runTimeMinutes / plannedProductionMinutes
      : 0

    const idealRunRate = idealCycleTime > 0 ? 3600 / idealCycleTime : 0

    const runTimeSeconds = runTimeMinutes * 60
    const performance = runTimeSeconds > 0
      ? Math.min((idealCycleTime * totalPartsProduced) / runTimeSeconds, 1)
      : 0

    const goodParts = Math.max(totalPartsProduced - defectiveParts, 0)
    const quality = totalPartsProduced > 0
      ? goodParts / totalPartsProduced
      : 0

    const oee = availability * performance * quality

    // Six Big Losses (all in minutes)
    const breakdownLoss = unplannedDowntime
    const setupLoss = plannedStops

    const theoreticalOutput = (runTimeMinutes / 60) * idealRunRate
    const performanceLossMinutes = theoreticalOutput > totalPartsProduced
      ? ((theoreticalOutput - totalPartsProduced) * idealCycleTime) / 60
      : 0

    const minorStopsLoss = performanceLossMinutes * 0.4
    const speedLoss = performanceLossMinutes * 0.6

    const totalDefectLoss = (defectiveParts * idealCycleTime) / 60
    const startupLoss = totalDefectLoss * 0.1
    const defectLoss = totalDefectLoss * 0.9

    const totalLossMinutes = breakdownLoss + setupLoss + minorStopsLoss + speedLoss + defectLoss + startupLoss

    const benchmark: "world-class" | "typical" | "low" =
      oee >= 0.85 ? "world-class" : oee >= 0.60 ? "typical" : "low"

    return {
      availability,
      performance,
      quality,
      oee,
      runTimeMinutes,
      idealRunRate,
      goodParts,
      losses: { breakdownLoss, setupLoss, minorStopsLoss, speedLoss, defectLoss, startupLoss },
      totalLossMinutes,
      benchmark,
    }
  }

  const results = calculateOEE()

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
  const formatMinutes = (value: number) => `${value.toFixed(1)} min`

  const getOEEColor = (value: number): string => {
    if (value >= 0.85) return "text-green-600 dark:text-green-400"
    if (value >= 0.60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getOEEBgColor = (value: number): string => {
    if (value >= 0.85) return "bg-green-500"
    if (value >= 0.60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getBenchmarkLabel = (benchmark: string): string => {
    switch (benchmark) {
      case "world-class": return "World Class"
      case "typical": return "Typical"
      case "low": return "Below Average"
      default: return ""
    }
  }

  const lossItems = [
    {
      label: "Breakdowns",
      category: "Availability",
      value: results.losses.breakdownLoss,
      color: "bg-red-500",
      recommendation: "Implement preventive maintenance schedules and root cause analysis for recurring failures.",
    },
    {
      label: "Setup & Adjustments",
      category: "Availability",
      value: results.losses.setupLoss,
      color: "bg-orange-500",
      recommendation: "Apply SMED (Single Minute Exchange of Die) techniques to reduce changeover times.",
    },
    {
      label: "Minor Stops",
      category: "Performance",
      value: results.losses.minorStopsLoss,
      color: "bg-yellow-500",
      recommendation: "Monitor for jams, misfeeds, and sensor trips. Clean and maintain regularly.",
    },
    {
      label: "Reduced Speed",
      category: "Performance",
      value: results.losses.speedLoss,
      color: "bg-blue-500",
      recommendation: "Investigate equipment wear, operator skill gaps, and material quality issues.",
    },
    {
      label: "Process Defects",
      category: "Quality",
      value: results.losses.defectLoss,
      color: "bg-purple-500",
      recommendation: "Implement Statistical Process Control (SPC) and error-proofing (Poka-Yoke).",
    },
    {
      label: "Startup Losses",
      category: "Quality",
      value: results.losses.startupLoss,
      color: "bg-pink-500",
      recommendation: "Standardize startup procedures and optimize initial machine parameters.",
    },
  ].sort((a, b) => b.value - a.value)

  const maxLoss = lossItems[0]?.value || 0
  const totalLoss = results.totalLossMinutes
  const largestLoss = lossItems[0]

  const handleDownloadReport = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let y = 40

    const addBrandedFooter = () => {
      doc.setFillColor(243, 244, 246)
      doc.rect(0, pageHeight - 16, pageWidth, 16, "F")
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text("Software Defined Factory | www.softwaredefinedfactory.com", 20, pageHeight - 7)
      doc.text("Free tools for smart manufacturing professionals", pageWidth - 20, pageHeight - 7, { align: "right" })
      doc.setTextColor(0, 0, 0)
    }

    const checkPageBreak = (needed: number) => {
      if (y + needed > pageHeight - 24) {
        addBrandedFooter()
        doc.addPage()
        y = 20
      }
    }

    // Branded header
    doc.setFillColor(24, 24, 27)
    doc.rect(0, 0, pageWidth, 28, "F")
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text("Software Defined Factory", 20, 14)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("www.softwaredefinedfactory.com", 20, 22)
    doc.setTextColor(200, 200, 200)
    doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageWidth - 20, 22, { align: "right" })
    doc.setTextColor(0, 0, 0)

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("OEE Analysis Report", 20, y)
    y += 10

    doc.setDrawColor(200, 200, 200)
    doc.line(20, y, pageWidth - 20, y)
    y += 8

    // Production Data + OEE Score side by side
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Production Data", 20, y)
    doc.text("OEE Score", 120, y)
    y += 6

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    const inputSummary = [
      ["Planned Time:", `${inputs.plannedProductionTime} hrs`],
      ["Planned Stops:", `${inputs.plannedStops} min`],
      ["Unplanned Down:", `${inputs.unplannedDowntime} min`],
      ["Cycle Time:", `${inputs.idealCycleTime} sec/part`],
      ["Total Parts:", `${inputs.totalPartsProduced}`],
      ["Defective:", `${inputs.defectiveParts}`],
      ["Good Parts:", `${results.goodParts}`],
      ["Run Time:", `${(results.runTimeMinutes / 60).toFixed(1)} hrs`],
    ]

    // OEE score box on the right
    const oeePercent = results.oee * 100
    const [r, g, b] = oeePercent >= 85 ? [34, 197, 94] : oeePercent >= 60 ? [234, 179, 8] : [239, 68, 68]
    doc.setFillColor(r, g, b)
    doc.setTextColor(255, 255, 255)
    doc.roundedRect(120, y - 2, 50, 18, 3, 3, "F")
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(`${oeePercent.toFixed(1)}%`, 145, y + 11, { align: "center" })
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(getBenchmarkLabel(results.benchmark), 175, y + 8)

    // Sub-metrics below OEE box
    const metricsStartY = y + 22
    const metricItems = [
      ["Availability:", formatPercent(results.availability), "90%+"],
      ["Performance:", formatPercent(results.performance), "95%+"],
      ["Quality:", formatPercent(results.quality), "99%+"],
    ]
    doc.setFontSize(9)
    let my = metricsStartY
    for (const [label, value, target] of metricItems) {
      doc.setFont("helvetica", "normal")
      doc.text(label, 122, my)
      doc.setFont("helvetica", "bold")
      doc.text(value, 152, my)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(120, 120, 120)
      doc.text(`(${target})`, 172, my)
      doc.setTextColor(0, 0, 0)
      my += 6
    }

    // Production data on the left
    doc.setFontSize(9)
    for (const [label, value] of inputSummary) {
      doc.setFont("helvetica", "normal")
      doc.text(label, 22, y)
      doc.setFont("helvetica", "bold")
      doc.text(value, 70, y)
      doc.setFont("helvetica", "normal")
      y += 6
    }
    y = Math.max(y, my) + 6

    doc.setDrawColor(200, 200, 200)
    doc.line(20, y, pageWidth - 20, y)
    y += 8

    // Six Big Losses
    checkPageBreak(70)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Six Big Losses Analysis", 20, y)
    y += 7

    doc.setFillColor(243, 244, 246)
    doc.rect(20, y - 3, pageWidth - 40, 7, "F")
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text("Loss Category", 25, y + 1)
    doc.text("Type", 85, y + 1)
    doc.text("Time Lost", 125, y + 1)
    doc.text("% of Total", 160, y + 1)
    y += 7

    doc.setFont("helvetica", "normal")
    for (const loss of lossItems) {
      checkPageBreak(7)
      doc.text(loss.label, 25, y + 1)
      doc.text(loss.category, 85, y + 1)
      doc.text(formatMinutes(loss.value), 125, y + 1)
      const pct = totalLoss > 0 ? ((loss.value / totalLoss) * 100).toFixed(1) : "0.0"
      doc.text(`${pct}%`, 160, y + 1)
      y += 6
    }

    doc.setFont("helvetica", "bold")
    doc.text("Total Loss:", 25, y + 1)
    doc.text(formatMinutes(results.totalLossMinutes), 125, y + 1)
    y += 10

    // Recommendations
    checkPageBreak(50)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Improvement Recommendations", 20, y)
    y += 7

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")

    if (largestLoss) {
      checkPageBreak(18)
      doc.setFillColor(255, 251, 235)
      doc.setDrawColor(245, 158, 11)
      doc.roundedRect(20, y - 3, pageWidth - 40, 14, 3, 3, "FD")
      doc.setFont("helvetica", "bold")
      doc.text(`Priority: Address ${largestLoss.label}`, 25, y + 2)
      doc.setFont("helvetica", "normal")
      doc.text(largestLoss.recommendation, 25, y + 8)
      doc.setDrawColor(200, 200, 200)
      y += 18
    }

    if (results.availability < 0.90) {
      checkPageBreak(6)
      doc.text("- Availability below 90%: Focus on reducing breakdowns and setup times.", 22, y)
      y += 6
    }
    if (results.performance < 0.95) {
      checkPageBreak(6)
      doc.text("- Performance below 95%: Investigate speed losses and minor stops.", 22, y)
      y += 6
    }
    if (results.quality < 0.99) {
      checkPageBreak(6)
      doc.text("- Quality below 99%: Implement SPC and error-proofing measures.", 22, y)
      y += 6
    }
    y += 6

    // Benchmark Comparison
    checkPageBreak(50)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Benchmark Comparison", 20, y)
    y += 7

    doc.setFillColor(243, 244, 246)
    doc.rect(20, y - 3, pageWidth - 40, 7, "F")
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text("Metric", 25, y + 1)
    doc.text("Your Score", 65, y + 1)
    doc.text("World Class", 110, y + 1)
    doc.text("Typical", 155, y + 1)
    y += 7

    doc.setFont("helvetica", "normal")
    const benchmarks = [
      ["OEE", formatPercent(results.oee), "85%+", "60%"],
      ["Availability", formatPercent(results.availability), "90%+", "~80%"],
      ["Performance", formatPercent(results.performance), "95%+", "~85%"],
      ["Quality", formatPercent(results.quality), "99%+", "~95%"],
    ]
    for (const [metric, yours, wc, typ] of benchmarks) {
      doc.text(metric, 25, y + 1)
      doc.text(yours, 65, y + 1)
      doc.text(wc, 110, y + 1)
      doc.text(typ, 155, y + 1)
      y += 6
    }
    y += 8

    // Branded footer on final page
    addBrandedFooter()

    doc.save(`oee-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Gauge className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              OEE Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate Overall Equipment Effectiveness for your production line.
              Identify the Six Big Losses and get actionable improvement recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Production Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Production Time</CardTitle>
                  <CardDescription>
                    Enter your planned production schedule and downtime
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="plannedProductionTime">Planned Production Time (hours)</Label>
                    <Input
                      id="plannedProductionTime"
                      type="number"
                      min={0}
                      step={0.5}
                      value={inputs.plannedProductionTime}
                      onChange={(e) => updateInput("plannedProductionTime", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total scheduled production time for the shift or period
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="plannedStops">Planned Stops (minutes)</Label>
                    <Input
                      id="plannedStops"
                      type="number"
                      min={0}
                      value={inputs.plannedStops}
                      onChange={(e) => updateInput("plannedStops", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Changeovers, setup time, scheduled maintenance
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="unplannedDowntime">Unplanned Downtime (minutes)</Label>
                    <Input
                      id="unplannedDowntime"
                      type="number"
                      min={0}
                      value={inputs.unplannedDowntime}
                      onChange={(e) => updateInput("unplannedDowntime", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Equipment breakdowns, unscheduled stops
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Run Time</div>
                    <div className="text-lg font-semibold">
                      {(results.runTimeMinutes / 60).toFixed(2)} hours ({results.runTimeMinutes.toFixed(0)} min)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Output & Speed */}
              <Card>
                <CardHeader>
                  <CardTitle>Output &amp; Speed</CardTitle>
                  <CardDescription>
                    Enter your cycle time and production count
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="idealCycleTime">Ideal Cycle Time (seconds/part)</Label>
                    <Input
                      id="idealCycleTime"
                      type="number"
                      min={1}
                      value={inputs.idealCycleTime}
                      onChange={(e) => updateInput("idealCycleTime", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Fastest possible time to produce one part
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="totalPartsProduced">Total Parts Produced</Label>
                    <Input
                      id="totalPartsProduced"
                      type="number"
                      min={0}
                      value={inputs.totalPartsProduced}
                      onChange={(e) => updateInput("totalPartsProduced", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total output including defective parts
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Ideal Run Rate</div>
                    <div className="text-lg font-semibold">
                      {results.idealRunRate.toFixed(1)} parts/hr
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality</CardTitle>
                  <CardDescription>
                    Enter defective parts to calculate yield
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="defectiveParts">Defective Parts (scrap + rework)</Label>
                    <Input
                      id="defectiveParts"
                      type="number"
                      min={0}
                      value={inputs.defectiveParts}
                      onChange={(e) => updateInput("defectiveParts", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total rejected, scrapped, or reworked units
                    </p>
                    {inputs.defectiveParts > inputs.totalPartsProduced && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Defective parts cannot exceed total parts produced
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">Good Parts</div>
                    <div className="text-lg font-semibold">
                      {results.goodParts}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* OEE Score */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    OEE Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border text-center">
                    <div className={`text-5xl font-bold ${getOEEColor(results.oee)}`}>
                      {formatPercent(results.oee)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {getBenchmarkLabel(results.benchmark)}
                    </div>
                  </div>

                  {[
                    { label: "Availability", value: results.availability, target: "90%+" },
                    { label: "Performance", value: results.performance, target: "95%+" },
                    { label: "Quality", value: results.quality, target: "99%+" },
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{metric.label}</span>
                        <span className="font-medium">{formatPercent(metric.value)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${getOEEBgColor(metric.value)}`}
                          style={{ width: `${Math.min(metric.value * 100, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        World class: {metric.target}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Six Big Losses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Six Big Losses
                  </CardTitle>
                  <CardDescription>Time lost by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lossItems.map((loss, index) => (
                    <div key={loss.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          {index === 0 && loss.value > 0 && (
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                          )}
                          {loss.label}
                        </span>
                        <span className="font-medium">{formatMinutes(loss.value)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${loss.color}`}
                          style={{ width: `${maxLoss > 0 ? (loss.value / maxLoss) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {largestLoss && largestLoss.value > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Focus Here First</div>
                          <div className="text-xs text-muted-foreground">
                            {largestLoss.label} accounts for {totalLoss > 0 ? ((largestLoss.value / totalLoss) * 100).toFixed(0) : 0}%
                            of your total losses. {largestLoss.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Download CTA */}
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold">Get Your OEE Analysis Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a detailed PDF with your OEE breakdown, loss analysis,
                      and improvement recommendations
                    </p>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setShowEmailModal(true)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF Report
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Free &bull; No credit card required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Educational Content */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Understanding OEE</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">What is OEE?</h4>
                  <p className="text-muted-foreground mb-3">
                    Overall Equipment Effectiveness (OEE) is the gold standard metric for measuring manufacturing
                    productivity. It combines three factors — Availability, Performance, and Quality — into a single
                    percentage that tells you how effectively your equipment is being used.
                  </p>
                  <p className="text-muted-foreground font-mono text-xs bg-muted p-2 rounded">
                    OEE = Availability &times; Performance &times; Quality
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benchmark Comparison</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Level</th>
                        <th className="text-left py-1">OEE</th>
                        <th className="text-left py-1">Avail.</th>
                        <th className="text-left py-1">Perf.</th>
                        <th className="text-left py-1">Qual.</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-1 font-medium text-green-600 dark:text-green-400">World Class</td>
                        <td className="py-1">85%+</td>
                        <td className="py-1">90%+</td>
                        <td className="py-1">95%+</td>
                        <td className="py-1">99%+</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 font-medium text-yellow-600 dark:text-yellow-400">Typical</td>
                        <td className="py-1">60%</td>
                        <td className="py-1">~80%</td>
                        <td className="py-1">~85%</td>
                        <td className="py-1">~95%</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium text-red-600 dark:text-red-400">Low</td>
                        <td className="py-1">&lt;40%</td>
                        <td className="py-1">&lt;70%</td>
                        <td className="py-1">&lt;75%</td>
                        <td className="py-1">&lt;90%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 text-sm">Improve Availability</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>&bull; Implement Total Productive Maintenance (TPM)</li>
                    <li>&bull; Reduce changeover times with SMED</li>
                    <li>&bull; Track and analyze breakdown patterns</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 text-sm">Improve Performance</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>&bull; Identify and eliminate minor stops</li>
                    <li>&bull; Ensure equipment runs at design speed</li>
                    <li>&bull; Train operators on optimal settings</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 text-sm">Improve Quality</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>&bull; Implement Statistical Process Control</li>
                    <li>&bull; Use error-proofing (Poka-Yoke)</li>
                    <li>&bull; Standardize startup procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      <EmailCaptureModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        title="Get Your Free OEE Report"
        description="Enter your email to download your detailed OEE analysis. We'll also send you tips for improving your equipment effectiveness."
        source="oee-calculator"
        onSuccess={handleDownloadReport}
      />
    </div>
  )
}
