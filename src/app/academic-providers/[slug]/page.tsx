import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { User, Building2, Globe, Linkedin, Twitter } from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("person_profiles")
    .select("full_name, seo_title, seo_description, title, company")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!data) return { title: "Academic Provider Not Found" }
  return {
    title: data.seo_title || `${data.full_name} | Software Defined Factory`,
    description: data.seo_description || (data.title && data.company ? `${data.title} at ${data.company}` : undefined),
  }
}

export default async function AcademicProviderProfilePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: person } = await supabase
    .from("person_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!person) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {person.cover_image_url && (
          <div className="w-full h-48 md:h-64 bg-muted overflow-hidden">
            <img src={person.cover_image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="container mx-auto max-w-3xl px-4 py-10">
          <div className="flex items-start gap-5 mb-8">
            {person.avatar_url ? (
              <img src={person.avatar_url} alt={person.full_name} className="w-24 h-24 rounded-full border object-cover flex-shrink-0 shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-full border bg-muted flex items-center justify-center flex-shrink-0">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{person.full_name}</h1>
              {person.title && <p className="text-lg text-muted-foreground mt-1">{person.title}</p>}
              {person.company && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Building2 className="h-4 w-4" />{person.company}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                {person.linkedin_url && (
                  <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                    <Linkedin className="h-4 w-4" />LinkedIn
                  </a>
                )}
                {person.twitter_url && (
                  <a href={person.twitter_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                    <Twitter className="h-4 w-4" />Twitter
                  </a>
                )}
                {person.website_url && (
                  <a href={person.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                    <Globe className="h-4 w-4" />Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {person.expertise && person.expertise.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {person.expertise.map((e: string) => (
                  <Badge key={e} variant="secondary">{e}</Badge>
                ))}
              </div>
            </div>
          )}

          {person.bio && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Bio</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{person.bio}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
