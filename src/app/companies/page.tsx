import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CompanyCard } from "@/components/directory/company-card"
import { Building2 } from "lucide-react"

export const metadata = {
  title: "Manufacturing Companies Directory | Software Defined Factory",
  description: "Browse featured manufacturing, IIoT, and Industry 4.0 companies.",
}

export default async function CompaniesPage() {
  const supabase = await createClient()
  const { data: companies } = await supabase
    .from("company_profiles")
    .select("id, slug, name, tagline, logo_url, headquarters, company_size, industry_focus")
    .eq("status", "published")
    .order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Company Directory</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover manufacturing, IIoT, and Industry 4.0 companies featured on the platform.
            </p>
          </div>

          {companies && companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard key={company.id} {...company} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No company profiles yet.</p>
              <p className="text-sm mt-1">Be the first to submit a company profile.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
