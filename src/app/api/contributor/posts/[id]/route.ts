import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireRole, CONTRIBUTOR_ROLES } from "@/lib/api/require-role"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error

  const { id } = await params
  const body = await request.json()
  const { title, slug, excerpt, content, category, tags, post_type, cover_image_url, featured_entity_slug, seo_title, seo_description, status } = body

  if (status && !["draft", "pending_review"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const supabase = await createClient()

  // Verify ownership and that post is editable
  const { data: existing } = await supabase
    .from("posts").select("author_id, status").eq("id", id).single()

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.author_id !== auth.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (!["draft", "rejected"].includes(existing.status)) {
    return NextResponse.json({ error: "Only draft or rejected posts can be edited" }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title
  if (slug !== undefined) updates.slug = slug
  if (excerpt !== undefined) updates.excerpt = excerpt
  if (content !== undefined) updates.content = content
  if (category !== undefined) updates.category = category
  if (tags !== undefined) updates.tags = tags
  if (post_type !== undefined) updates.post_type = post_type
  if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url
  if (featured_entity_slug !== undefined) updates.featured_entity_slug = featured_entity_slug
  if (seo_title !== undefined) updates.seo_title = seo_title
  if (seo_description !== undefined) updates.seo_description = seo_description
  if (status !== undefined) updates.status = status

  const { error } = await supabase.from("posts").update(updates).eq("id", id)
  if (error) return NextResponse.json({ error: "Failed to update post" }, { status: 500 })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error

  const { id } = await params
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("posts").select("author_id, status").eq("id", id).single()

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.author_id !== auth.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (existing.status === "published") return NextResponse.json({ error: "Cannot delete published posts" }, { status: 400 })

  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })

  return NextResponse.json({ success: true })
}
