import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConferencesFilter } from "./components/conferences-filter"
import { events } from "./data"

export const metadata = {
  title: "Manufacturing Conferences & Events 2026",
  description:
    "Your complete calendar of global smart manufacturing, Industry 4.0, IIoT, and automation conferences and trade shows for 2026.",
}

export default function ConferencesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Manufacturing Conferences & Events 2026
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your complete calendar of global smart manufacturing, Industry 4.0, IIoT, and automation
              conferences and trade shows. Plan your year and never miss a key industry event.
            </p>
          </div>

          <ConferencesFilter events={events} />

          {/* CTA */}
          <div className="mt-24 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-xl font-bold mb-2">Know of an event we&apos;re missing?</h3>
                <p className="text-muted-foreground mb-4">
                  We aim to keep this calendar as comprehensive as possible. If you know of a smart
                  manufacturing, Industry 4.0, or IIoT event that should be listed here, let us know.
                </p>
                <Button asChild variant="outline">
                  <a href="mailto:hello@softwaredefinedfactory.com">Suggest an Event</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
