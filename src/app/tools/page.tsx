import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Free Tools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculators and templates to support your smart manufacturing journey
            </p>
          </div>

          <div className="max-w-3xl mx-auto text-center py-12">
            <p className="text-muted-foreground mb-6">
              Our ROI Calculator and other tools are coming soon!
            </p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
