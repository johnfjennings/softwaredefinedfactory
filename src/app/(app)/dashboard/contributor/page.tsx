import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContributorTabs } from "./components/contributor-tabs"

export default async function ContributorDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  const allowedRoles = ["contributor", "instructor", "admin"]
  if (!profile || !allowedRoles.includes(profile.role ?? "")) {
    redirect("/dashboard")
  }

  // Fetch all this user's submissions across content types
  const [
    { data: posts },
    { data: companies },
    { data: people },
    { data: products },
    { data: conferences },
  ] = await Promise.all([
    supabaseAdmin
      .from("posts")
      .select("id, title, slug, status, post_type, created_at")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("company_profiles")
      .select("id, name, slug, status, created_at")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("person_profiles")
      .select("id, full_name, slug, status, created_at")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("product_profiles")
      .select("id, name, slug, status, created_at")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("conference_proposals")
      .select("id, name, dates, status, created_at")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false }),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Contributor Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your content submissions. All content is reviewed before publishing.
            </p>
          </div>

          <ContributorTabs
            posts={posts || []}
            companies={companies || []}
            people={people || []}
            products={products || []}
            conferences={conferences || []}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
