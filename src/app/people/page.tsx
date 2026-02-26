import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PersonCard } from "@/components/directory/person-card"
import { Users } from "lucide-react"

export const metadata = {
  title: "Industry Leaders Directory | Software Defined Factory",
  description: "Discover manufacturing and IIoT thought leaders and industry experts.",
}

export default async function PeoplePage() {
  const supabase = await createClient()
  const { data: people } = await supabase
    .from("person_profiles")
    .select("id, slug, full_name, title, company, avatar_url, expertise")
    .eq("status", "published")
    .order("full_name")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Industry Leaders</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Thought leaders, practitioners, and innovators shaping the future of smart manufacturing.
            </p>
          </div>

          {people && people.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {people.map((person) => (
                <PersonCard key={person.id} {...person} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No profiles yet.</p>
              <p className="text-sm mt-1">Be the first to feature an industry leader.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
