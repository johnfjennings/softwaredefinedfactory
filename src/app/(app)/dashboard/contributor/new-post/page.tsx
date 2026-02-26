import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PostForm } from "./components/post-form"

export default async function NewPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const allowedRoles = ["contributor", "instructor", "admin"]
  if (!profile || !allowedRoles.includes(profile.role)) redirect("/dashboard")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
            <p className="text-muted-foreground mt-1">
              Write your article. Save as a draft or submit for review when ready.
            </p>
          </div>
          <PostForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
