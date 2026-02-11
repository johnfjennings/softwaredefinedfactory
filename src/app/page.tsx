import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowRight, Factory, Cpu, TrendingUp, Zap, BookOpen, Wrench } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Transform Your Factory with{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Smart Manufacturing
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Learn Industry 4.0, IIoT, and digital transformation. Get hands-on courses, practical tools, and expert guidance to modernize your manufacturing operations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/courses">
                  Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tools">Try Free Tools</Link>
              </Button>
            </div>

            {/* Email Signup */}
            <div className="w-full max-w-md pt-8">
              <form className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button type="submit">Get Updates</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Join 1,000+ manufacturers learning smart factory technologies
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/40 bg-muted/50 py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything You Need to Build a Smart Factory
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From foundational concepts to advanced implementation, we provide the resources to accelerate your digital transformation journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Courses</h3>
                <p className="text-muted-foreground">
                  Step-by-step courses covering smart manufacturing, IIoT, automation, and Industry 4.0 fundamentals.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Tools</h3>
                <p className="text-muted-foreground">
                  ROI calculators, KPI dashboards, and templates to help you make data-driven decisions.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-World Examples</h3>
                <p className="text-muted-foreground">
                  Learn from actual manufacturing case studies and implementation strategies that work.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">IIoT Technologies</h3>
                <p className="text-muted-foreground">
                  Master sensors, connectivity protocols, edge computing, and cloud integration for smart factories.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Business ROI Focus</h3>
                <p className="text-muted-foreground">
                  Understand how to build business cases and measure the return on your automation investments.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Practical Implementation</h3>
                <p className="text-muted-foreground">
                  Go beyond theory with actionable guides to implement digital technologies in your facility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto max-w-7xl px-4 py-24">
          <div className="rounded-lg border border-border/40 bg-muted/50 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Start Your Digital Transformation?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of manufacturers, engineers, and operations managers who are building smarter factories with our courses and resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">Read the Blog</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
