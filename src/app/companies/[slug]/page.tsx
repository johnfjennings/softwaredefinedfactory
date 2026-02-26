import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe, MapPin, Calendar, Users } from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("company_profiles")
    .select("name, seo_title, seo_description, tagline")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!data) return { title: "Company Not Found" }
  return {
    title: data.seo_title || `${data.name} | Software Defined Factory`,
    description: data.seo_description || data.tagline || undefined,
  }
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: company } = await supabase
    .from("company_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!company) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Cover */}
        {company.cover_image_url && (
          <div className="w-full h-48 md:h-64 bg-muted overflow-hidden">
            <img src={company.cover_image_url} alt={company.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="container mx-auto max-w-4xl px-4 py-10">
          {/* Header */}
          <div className="flex items-start gap-5 mb-8">
            {company.logo_url ? (
              <img src={company.logo_url} alt={`${company.name} logo`} className="w-20 h-20 rounded-xl border bg-white p-2 object-contain flex-shrink-0 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-xl border bg-muted flex items-center justify-center flex-shrink-0">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              {company.tagline && <p className="text-lg text-muted-foreground mt-1">{company.tagline}</p>}
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                {company.headquarters && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{company.headquarters}</span>
                )}
                {company.founded_year && (
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Founded {company.founded_year}</span>
                )}
                {company.company_size && (
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{company.company_size} employees</span>
                )}
                {company.website_url && (
                  <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    <Globe className="h-4 w-4" />Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Industry Focus */}
          {company.industry_focus && company.industry_focus.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Industry Focus</h2>
              <div className="flex flex-wrap gap-2">
                {company.industry_focus.map((f: string) => (
                  <Badge key={f} variant="secondary">{f}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {company.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.description}</p>
            </div>
          )}

          {/* Products & Services */}
          {company.products_services && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Products & Services</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.products_services}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
