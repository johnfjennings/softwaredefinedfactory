import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { glossaryTerms, categoryColors, type GlossaryTerm } from "@/lib/glossary"

export const metadata = {
  title: "Smart Manufacturing Glossary — Key Terms & Definitions",
  description:
    "A comprehensive glossary of smart manufacturing, Industry 4.0, IIoT, and automation terms. Clear, jargon-free definitions for manufacturing professionals.",
}

const categories = Array.from(new Set(glossaryTerms.map((t) => t.category))).sort()

export default function GlossaryPage() {
  const letters = Array.from(new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()))).sort()

  const groupedByLetter: Record<string, GlossaryTerm[]> = {}
  for (const term of glossaryTerms) {
    const letter = term.term[0].toUpperCase()
    if (!groupedByLetter[letter]) groupedByLetter[letter] = []
    groupedByLetter[letter].push(term)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Smart Manufacturing Glossary
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Clear, jargon-free definitions for the key terms and acronyms used in smart
              manufacturing, Industry 4.0, IIoT, and factory automation.
            </p>
          </div>

          {/* Category legend */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[cat] || "bg-muted text-muted-foreground"}`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Letter jump nav */}
          <div className="flex flex-wrap justify-center gap-1 mb-16">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#${letter}`}
                className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          {/* Terms */}
          <div className="space-y-12">
            {letters.map((letter) => (
              <section key={letter} id={letter}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold">{letter}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {groupedByLetter[letter].length} term{groupedByLetter[letter].length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {groupedByLetter[letter].map((item) => (
                    <Card key={item.term}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                              <h3 className="text-lg font-semibold">{item.term}</h3>
                              <span
                                className={`shrink-0 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[item.category] || "bg-muted text-muted-foreground"}`}
                              >
                                {item.category}
                              </span>
                            </div>
                            <p className="text-muted-foreground ml-7">{item.definition}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Stats + CTA */}
          <div className="mt-24 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-8 pb-8">
                <p className="text-4xl font-bold mb-2">{glossaryTerms.length}</p>
                <p className="text-muted-foreground mb-4">
                  terms defined across {categories.length} categories. This glossary is regularly
                  updated as new technologies and concepts emerge.
                </p>
                <p className="text-sm text-muted-foreground">
                  Missing a term?{" "}
                  <a
                    href="mailto:hello@softwaredefinedfactory.com"
                    className="underline hover:text-foreground transition-colors"
                  >
                    Let us know
                  </a>{" "}
                  and we&apos;ll add it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
