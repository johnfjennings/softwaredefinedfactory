import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireRole, CONTRIBUTOR_ROLES } from "@/lib/api/require-role"

export async function POST(request: NextRequest) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { name, slug, tagline, description, logo_url, cover_image_url, website_url, founded_year, headquarters, company_size, industry_focus, products_services, seo_title, seo_description, status } = body

    if (!name || !slug) return NextResponse.json({ error: "name and slug are required" }, { status: 400 })
    if (!["draft", "pending_review"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase.from("company_profiles").insert({
      name, slug, tagline: tagline || null, description: description || null,
      logo_url: logo_url || null, cover_image_url: cover_image_url || null,
      website_url: website_url || null, founded_year: founded_year || null,
      headquarters: headquarters || null, company_size: company_size || null,
      industry_focus: industry_focus || [], products_services: products_services || null,
      seo_title: seo_title || null, seo_description: seo_description || null,
      submitted_by: auth.user.id, status,
    }).select("id, slug").single()

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "A company with this slug already exists" }, { status: 409 })
      return NextResponse.json({ error: "Failed to create company profile" }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
