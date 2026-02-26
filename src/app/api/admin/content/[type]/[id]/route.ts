import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

const TABLE_MAP: Record<string, string> = {
  posts: "posts",
  "company-profiles": "company_profiles",
  "person-profiles": "person_profiles",
  "product-profiles": "product_profiles",
  "conference-proposals": "conference_proposals",
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { type, id } = await params
  const table = TABLE_MAP[type]
  if (!table) return NextResponse.json({ error: "Invalid content type" }, { status: 400 })

  const body = await request.json()
  const { status, review_notes } = body

  if (!["published", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Status must be published or rejected" }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    status,
    reviewer_id: user.id,
    reviewed_at: new Date().toISOString(),
    review_notes: review_notes || null,
  }

  // For posts: sync is_published and set published_at
  if (table === "posts" && status === "published") {
    updates.is_published = true
    updates.published_at = new Date().toISOString()
  } else if (table === "posts") {
    updates.is_published = false
  }

  const { error } = await supabaseAdmin.from(table as any).update(updates).eq("id", id)

  if (error) {
    console.error("Content review update error:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }

  return NextResponse.json({ success: true, status })
}
