import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsletterForm } from "@/components/marketing/newsletter-form"
import { ArrowRight, Factory, Cpu, TrendingUp, Zap, BookOpen, Wrench, Building2, User, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600

type ProfileEntry = {
  type: "company" | "person" | "product"
  slug: string
  name: string
  tagline: string | null
  logoUrl: string | null
  meta: string | null
}

async function getFeaturedProfile(): Promise<ProfileEntry | null> {
  try {
    const supabase = await createClient()
    const [{ data: companies }, { data: people }, { data: products }] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("company_profiles").select("slug, name, tagline, logo_url, headquarters").eq("status", "published"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("person_profiles").select("slug, full_name, title, company, avatar_url").eq("status", "published"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("product_profiles").select("slug, name, tagline, logo_url, vendor_name").eq("status", "published"),
    ])

    const all: ProfileEntry[] = [
      ...((companies as { slug: string; name: string; tagline: string | null; logo_url: string | null; headquarters: string | null }[] | null) || []).map((c) => ({
        type: "company" as const,
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        logoUrl: c.logo_url,
        meta: c.headquarters,
      })),
      ...((people as { slug: string; full_name: string; title: string | null; company: string | null; avatar_url: string | null }[] | null) || []).map((p) => ({
        type: "person" as const,
        slug: p.slug,
        name: p.full_name,
        tagline: p.title ? (p.company ? `${p.title} at ${p.company}` : p.title) : null,
        logoUrl: p.avatar_url,
        meta: p.company,
      })),
      ...((products as { slug: string; name: string; tagline: string | null; logo_url: string | null; vendor_name: string | null }[] | null) || []).map((p) => ({
        type: "product" as const,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        logoUrl: p.logo_url,
        meta: p.vendor_name,
      })),
    ]

    if (all.length === 0) return null
    return all[Math.floor(Math.random() * all.length)]
  } catch {
    return null
  }
}

const PROFILE_CONFIG = {
  company: { label: "Featured Company", icon: Building2, basePath: "companies", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  person: { label: "Academic Provider", icon: User, basePath: "academic-providers", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  product: { label: "Product Spotlight", icon: Package, basePath: "products", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
}

export default async function Home() {
  const featured = await getFeaturedProfile()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <Image
              src="/images/logo.png"
              alt="Software Defined Factory"
              width={160}
              height={160}
              className="dark:invert"
              priority
            />
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
              <NewsletterForm source="homepage" />
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
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Courses</h3>
                <p className="text-muted-foreground">
                  Step-by-step courses covering smart manufacturing, IIoT, automation, and Industry 4.0 fundamentals.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Tools</h3>
                <p className="text-muted-foreground">
                  ROI calculators, KPI dashboards, and templates to help you make data-driven decisions.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-World Examples</h3>
                <p className="text-muted-foreground">
                  Learn from actual manufacturing case studies and implementation strategies that work.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">IIoT Technologies</h3>
                <p className="text-muted-foreground">
                  Master sensors, connectivity protocols, edge computing, and cloud integration for smart factories.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/40">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Business ROI Focus</h3>
                <p className="text-muted-foreground">
                  Understand how to build business cases and measure the return on your automation investments.
                </p>
              </div>

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

        {/* Featured Profile Section — only renders when published profiles exist */}
        {featured && (() => {
          const cfg = PROFILE_CONFIG[featured.type]
          const Icon = cfg.icon
          return (
            <section className="container mx-auto max-w-7xl px-4 py-20">
              <div className="text-center mb-10">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  From the Directory
                </p>
                <h2 className="text-3xl font-bold tracking-tight">Featured Profile</h2>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="rounded-xl border bg-card p-8 flex flex-col sm:flex-row gap-6 items-start hover:border-primary/40 transition-colors">
                  {/* Logo / Avatar */}
                  {featured.logoUrl ? (
                    <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border bg-muted">
                      <Image
                        src={featured.logoUrl}
                        alt={featured.name}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className={`h-20 w-20 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <Icon className={`h-10 w-10 ${cfg.color}`} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold mb-3 ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <h3 className="text-2xl font-bold mb-1 truncate">{featured.name}</h3>
                    {featured.tagline && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">{featured.tagline}</p>
                    )}
                    <Link
                      href={`/${cfg.basePath}/${featured.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      View full profile <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  <Link href="/companies" className="hover:underline">Browse all companies</Link>
                  {" · "}
                  <Link href="/academic-providers" className="hover:underline">Academic providers</Link>
                  {" · "}
                  <Link href="/products" className="hover:underline">Products</Link>
                </p>
              </div>
            </section>
          )
        })()}

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
