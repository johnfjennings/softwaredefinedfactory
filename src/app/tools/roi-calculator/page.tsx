"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, DollarSign, Clock, Download } from "lucide-react"
import jsPDF from "jspdf"
import { EmailCaptureModal } from "@/components/marketing/email-capture-modal"

interface CalculatorInputs {
  initialInvestment: number
  currentAnnualCosts: number
  laborSavings: number
  productivityGain: number
  qualityImprovement: number
  energySavings: number
  maintenanceReduction: number
}

interface ROIResults {
  totalAnnualSavings: number
  paybackMonths: number
  roi3Year: number
  roi5Year: number
  netSavings3Year: number
  netSavings5Year: number
  yearlyBreakdown: Array<{
    year: number
    cumulativeSavings: number
    netPosition: number
  }>
}

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialInvestment: 100000,
    currentAnnualCosts: 500000,
    laborSavings: 50000,
    productivityGain: 15,
    qualityImprovement: 20,
    energySavings: 10,
    maintenanceReduction: 25,
  })

  const [showResults, setShowResults] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const updateInput = (field: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const calculateROI = (): ROIResults => {
    const {
      initialInvestment,
      currentAnnualCosts,
      laborSavings,
      productivityGain,
      qualityImprovement,
      energySavings,
      maintenanceReduction,
    } = inputs

    // Calculate annual savings
    const productivitySavings = currentAnnualCosts * (productivityGain / 100)
    const qualitySavings = currentAnnualCosts * (qualityImprovement / 100) * 0.5 // 50% of cost impact
    const energySavingsAmount = currentAnnualCosts * (energySavings / 100) * 0.15 // Assume 15% of costs are energy
    const maintenanceSavings = currentAnnualCosts * (maintenanceReduction / 100) * 0.1 // Assume 10% of costs are maintenance

    const totalAnnualSavings =
      laborSavings + productivitySavings + qualitySavings + energySavingsAmount + maintenanceSavings

    // Calculate payback period
    const paybackMonths = (initialInvestment / totalAnnualSavings) * 12

    // Calculate yearly breakdown
    const yearlyBreakdown = []
    let cumulativeSavings = 0

    for (let year = 1; year <= 5; year++) {
      cumulativeSavings += totalAnnualSavings
      const netPosition = cumulativeSavings - initialInvestment

      yearlyBreakdown.push({
        year,
        cumulativeSavings,
        netPosition,
      })
    }

    // Calculate ROI
    const netSavings3Year = totalAnnualSavings * 3 - initialInvestment
    const netSavings5Year = totalAnnualSavings * 5 - initialInvestment
    const roi3Year = (netSavings3Year / initialInvestment) * 100
    const roi5Year = (netSavings5Year / initialInvestment) * 100

    return {
      totalAnnualSavings,
      paybackMonths,
      roi3Year,
      roi5Year,
      netSavings3Year,
      netSavings5Year,
      yearlyBreakdown,
    }
  }

  const results = calculateROI()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const handleDownloadReport = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

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

    let y = 40

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Automation ROI Report", 20, y)
    y += 10

    doc.setDrawColor(200, 200, 200)
    doc.line(20, y, pageWidth - 20, y)
    y += 10

    // Investment Details Section
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Investment Details", 20, y)
    y += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Initial Investment:`, 25, y)
    doc.setFont("helvetica", "bold")
    doc.text(formatCurrency(inputs.initialInvestment), 90, y)
    y += 7
    doc.setFont("helvetica", "normal")
    doc.text(`Current Annual Operating Costs:`, 25, y)
    doc.setFont("helvetica", "bold")
    doc.text(formatCurrency(inputs.currentAnnualCosts), 90, y)
    y += 12

    // Expected Savings Section
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Expected Savings", 20, y)
    y += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    const savingsItems = [
      ["Annual Labor Savings:", formatCurrency(inputs.laborSavings)],
      ["Productivity Improvement:", `${inputs.productivityGain}%`],
      ["Quality Improvement:", `${inputs.qualityImprovement}%`],
      ["Energy Cost Reduction:", `${inputs.energySavings}%`],
      ["Maintenance Cost Reduction:", `${inputs.maintenanceReduction}%`],
    ]
    for (const [label, value] of savingsItems) {
      doc.text(label, 25, y)
      doc.setFont("helvetica", "bold")
      doc.text(value, 90, y)
      doc.setFont("helvetica", "normal")
      y += 7
    }
    y += 5

    // Key Results Section
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Key Results", 20, y)
    y += 8

    // Highlight box for annual savings
    doc.setFillColor(240, 249, 255)
    doc.setDrawColor(59, 130, 246)
    doc.roundedRect(20, y - 4, pageWidth - 40, 22, 3, 3, "FD")
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text("Total Annual Savings:", 28, y + 4)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(37, 99, 235)
    doc.text(formatCurrency(results.totalAnnualSavings), 28, y + 14)
    doc.setTextColor(0, 0, 0)
    y += 28

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Payback Period:`, 25, y)
    doc.setFont("helvetica", "bold")
    doc.text(`${results.paybackMonths.toFixed(1)} months`, 90, y)
    y += 10

    // ROI metrics in a grid-like format
    doc.setFillColor(240, 253, 244)
    doc.setDrawColor(34, 197, 94)
    const boxWidth = (pageWidth - 50) / 2
    doc.roundedRect(20, y - 4, boxWidth, 24, 3, 3, "FD")
    doc.roundedRect(25 + boxWidth, y - 4, boxWidth, 24, 3, 3, "FD")

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("3-Year ROI", 28, y + 3)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(22, 163, 74)
    doc.text(formatPercent(results.roi3Year), 28, y + 12)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`Net: ${formatCurrency(results.netSavings3Year)}`, 28, y + 18)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("5-Year ROI", 33 + boxWidth, y + 3)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(22, 163, 74)
    doc.text(formatPercent(results.roi5Year), 33 + boxWidth, y + 12)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`Net: ${formatCurrency(results.netSavings5Year)}`, 33 + boxWidth, y + 18)
    doc.setTextColor(0, 0, 0)
    y += 34

    // 5-Year Projection Table
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("5-Year Financial Projection", 20, y)
    y += 8

    // Table header
    doc.setFillColor(243, 244, 246)
    doc.rect(20, y - 4, pageWidth - 40, 8, "F")
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Year", 28, y + 1)
    doc.text("Cumulative Savings", 70, y + 1)
    doc.text("Net Position", 130, y + 1)
    y += 8

    doc.setFont("helvetica", "normal")
    for (const row of results.yearlyBreakdown) {
      doc.text(`Year ${row.year}`, 28, y + 1)
      doc.text(formatCurrency(row.cumulativeSavings), 70, y + 1)
      if (row.netPosition >= 0) {
        doc.setTextColor(22, 163, 74)
      } else {
        doc.setTextColor(234, 88, 12)
      }
      doc.text(formatCurrency(row.netPosition), 130, y + 1)
      doc.setTextColor(0, 0, 0)
      y += 7
    }

    // Branded footer
    doc.setFillColor(243, 244, 246)
    doc.rect(0, pageHeight - 16, pageWidth, 16, "F")
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text("Software Defined Factory | www.softwaredefinedfactory.com", 20, pageHeight - 7)
    doc.text("Free tools for smart manufacturing professionals", pageWidth - 20, pageHeight - 7, { align: "right" })

    doc.save(`roi-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Automation ROI Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate the return on investment for your smart manufacturing and automation initiatives.
              See payback period, ROI, and projected savings over 5 years.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Investment Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Details</CardTitle>
                  <CardDescription>
                    Enter the total cost of your automation project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      value={inputs.initialInvestment}
                      onChange={(e) => updateInput("initialInvestment", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total cost including hardware, software, installation, and training
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="currentAnnualCosts">Current Annual Operating Costs ($)</Label>
                    <Input
                      id="currentAnnualCosts"
                      type="number"
                      value={inputs.currentAnnualCosts}
                      onChange={(e) => updateInput("currentAnnualCosts", Number(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your baseline annual costs for the area being automated
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Savings Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Expected Savings</CardTitle>
                  <CardDescription>
                    Estimate your savings in each category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="laborSavings">Annual Labor Savings ($)</Label>
                      <span className="text-sm font-medium">{formatCurrency(inputs.laborSavings)}</span>
                    </div>
                    <input
                      id="laborSavings"
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={inputs.laborSavings}
                      onChange={(e) => updateInput("laborSavings", Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Reduced labor costs through automation
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="productivityGain">Productivity Improvement (%)</Label>
                      <span className="text-sm font-medium">{inputs.productivityGain}%</span>
                    </div>
                    <input
                      id="productivityGain"
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={inputs.productivityGain}
                      onChange={(e) => updateInput("productivityGain", Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Increase in overall equipment effectiveness (OEE)
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="qualityImprovement">Quality Improvement (%)</Label>
                      <span className="text-sm font-medium">{inputs.qualityImprovement}%</span>
                    </div>
                    <input
                      id="qualityImprovement"
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={inputs.qualityImprovement}
                      onChange={(e) => updateInput("qualityImprovement", Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Reduction in defects and rework
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="energySavings">Energy Cost Reduction (%)</Label>
                      <span className="text-sm font-medium">{inputs.energySavings}%</span>
                    </div>
                    <input
                      id="energySavings"
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={inputs.energySavings}
                      onChange={(e) => updateInput("energySavings", Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower energy consumption through optimization
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="maintenanceReduction">Maintenance Cost Reduction (%)</Label>
                      <span className="text-sm font-medium">{inputs.maintenanceReduction}%</span>
                    </div>
                    <input
                      id="maintenanceReduction"
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={inputs.maintenanceReduction}
                      onChange={(e) => updateInput("maintenanceReduction", Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Savings from predictive maintenance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    ROI Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      Annual Savings
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(results.totalAnnualSavings)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-background border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      Payback Period
                    </div>
                    <div className="text-3xl font-bold">
                      {results.paybackMonths.toFixed(1)} months
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Break-even in {Math.ceil(results.paybackMonths / 12)} year
                      {Math.ceil(results.paybackMonths / 12) > 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-background border">
                      <div className="text-xs text-muted-foreground mb-1">3-Year ROI</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatPercent(results.roi3Year)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(results.netSavings3Year)}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-background border">
                      <div className="text-xs text-muted-foreground mb-1">5-Year ROI</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatPercent(results.roi5Year)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(results.netSavings5Year)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Year Projection */}
              <Card>
                <CardHeader>
                  <CardTitle>5-Year Financial Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.yearlyBreakdown.map((year) => (
                      <div key={year.year} className="flex items-center gap-3">
                        <div className="text-sm font-medium w-16">Year {year.year}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                year.netPosition > 0 ? "bg-green-500" : "bg-orange-500"
                              }`}
                              style={{
                                width: `${Math.min((Math.abs(year.netPosition) / (results.netSavings5Year + inputs.initialInvestment)) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium w-32 text-right ${
                            year.netPosition > 0 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {formatCurrency(year.netPosition)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold">Get Your Detailed ROI Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a PDF with full analysis, charts, and recommendations
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
                      Free • No credit card required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Educational Content */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Understanding Your ROI Calculation</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">What's Included in Savings:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Direct labor cost reductions</li>
                    <li>• Increased throughput and productivity</li>
                    <li>• Reduced defects and rework costs</li>
                    <li>• Lower energy consumption</li>
                    <li>• Predictive maintenance savings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Typical ROI Ranges:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Excellent: Payback &lt; 12 months, ROI &gt; 200%</li>
                    <li>• Good: Payback 12-24 months, ROI 100-200%</li>
                    <li>• Acceptable: Payback 24-36 months, ROI 50-100%</li>
                    <li>• Marginal: Payback &gt; 36 months, ROI &lt; 50%</li>
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
        title="Get Your Free ROI Report"
        description="Enter your email to download your detailed ROI analysis. We'll also send you tips for maximizing your automation ROI."
        source="roi-calculator"
        onSuccess={handleDownloadReport}
      />
    </div>
  )
}
