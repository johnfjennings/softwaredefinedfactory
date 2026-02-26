import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireRole, CONTRIBUTOR_ROLES } from "@/lib/api/require-role"

export async function POST(request: NextRequest) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { full_name, slug, title, company, bio, avatar_url, cover_image_url, linkedin_url, twitter_url, website_url, expertise, seo_title, seo_description, status } = body

    if (!full_name || !slug) return NextResponse.json({ error: "full_name and slug are required" }, { status: 400 })
    if (!["draft", "pending_review"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase.from("person_profiles").insert({
      full_name, slug, title: title || null, company: company || null, bio: bio || null,
      avatar_url: avatar_url || null, cover_image_url: cover_image_url || null,
      linkedin_url: linkedin_url || null, twitter_url: twitter_url || null,
      website_url: website_url || null, expertise: expertise || [],
      seo_title: seo_title || null, seo_description: seo_description || null,
      submitted_by: auth.user.id, status,
    }).select("id, slug").single()

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "A person with this slug already exists" }, { status: 409 })
      return NextResponse.json({ error: "Failed to create person profile" }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
