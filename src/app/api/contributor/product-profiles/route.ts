import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireRole, CONTRIBUTOR_ROLES } from "@/lib/api/require-role"

export async function POST(request: NextRequest) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { name, slug, tagline, description, logo_url, cover_image_url, vendor_name, vendor_url, product_url, category, tags, pricing_model, seo_title, seo_description, status } = body

    if (!name || !slug || !vendor_name) return NextResponse.json({ error: "name, slug and vendor_name are required" }, { status: 400 })
    if (!["draft", "pending_review"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase.from("product_profiles").insert({
      name, slug, tagline: tagline || null, description: description || null,
      logo_url: logo_url || null, cover_image_url: cover_image_url || null,
      vendor_name, vendor_url: vendor_url || null, product_url: product_url || null,
      category: category || null, tags: tags || [], pricing_model: pricing_model || null,
      seo_title: seo_title || null, seo_description: seo_description || null,
      submitted_by: auth.user.id, status,
    }).select("id, slug").single()

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 })
      return NextResponse.json({ error: "Failed to create product profile" }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
