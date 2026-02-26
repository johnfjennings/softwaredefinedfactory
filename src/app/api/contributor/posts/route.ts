import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireRole, CONTRIBUTOR_ROLES } from "@/lib/api/require-role"

export async function POST(request: NextRequest) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { title, slug, excerpt, content, category, tags, post_type, cover_image_url, featured_entity_slug, seo_title, seo_description, status } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "title, slug and content are required" }, { status: 400 })
    }
    if (!["draft", "pending_review"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.from("posts").insert({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      category: category || null,
      tags: tags || [],
      post_type: post_type || "article",
      cover_image_url: cover_image_url || null,
      featured_entity_slug: featured_entity_slug || null,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      author_id: auth.user.id,
      status,
    }).select("id, slug").single()

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
      console.error("Post insert error:", error)
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
