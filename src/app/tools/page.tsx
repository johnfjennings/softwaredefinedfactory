import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calculator, TrendingUp, ArrowRight, Gauge, FileText } from "lucide-react"

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Free Manufacturing Tools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practical calculators and templates to help you make data-driven decisions about smart manufacturing investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ROI Calculator - Featured */}
            <Card className="border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                POPULAR
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Automation ROI Calculator</CardTitle>
                <CardDescription>
                  Calculate payback period, ROI, and projected savings for your automation investments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Real-time ROI and payback calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>5-year financial projections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Comprehensive savings analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Downloadable PDF report</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/tools/roi-calculator">
                    Launch Calculator <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* OEE Calculator - Coming Soon */}
            <Card className="opacity-75">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Gauge className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>OEE Calculator</CardTitle>
                <CardDescription>
                  Calculate Overall Equipment Effectiveness and identify production losses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">✓</span>
                    <span>Availability, Performance, Quality metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">✓</span>
                    <span>Six Big Losses analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">✓</span>
                    <span>Improvement recommendations</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* KPI Dashboard - Coming Soon */}
            <Card className="opacity-75">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>KPI Dashboard Template</CardTitle>
                <CardDescription>
                  Free downloadable template for tracking manufacturing KPIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">✓</span>
                    <span>Pre-built dashboards and charts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">✓</span>
                    <span>Excel and Google Sheets formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">✓</span>
                    <span>Customizable for your needs</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-lg border border-border/40 bg-muted/50 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Need Help Implementing Smart Manufacturing?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our calculators help you understand the potential ROI. Ready to make it a reality?
              Explore our courses or get in touch with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">Read Expert Guides</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
