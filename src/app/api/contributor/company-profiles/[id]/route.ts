import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireRole, CONTRIBUTOR_ROLES } from "@/lib/api/require-role"

async function getOwned(id: string, userId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("company_profiles").select("submitted_by, status").eq("id", id).single()
  return data
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error
  const { id } = await params
  const existing = await getOwned(id, auth.user.id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.submitted_by !== auth.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (existing.status !== "draft") return NextResponse.json({ error: "Only drafts can be edited" }, { status: 400 })

  const body = await request.json()
  const supabase = await createClient()
  const { error } = await supabase.from("company_profiles").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error
  const { id } = await params
  const existing = await getOwned(id, auth.user.id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.submitted_by !== auth.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (existing.status === "published") return NextResponse.json({ error: "Cannot delete published profiles" }, { status: 400 })
  const supabase = await createClient()
  const { error } = await supabase.from("company_profiles").delete().eq("id", id)
  if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  return NextResponse.json({ success: true })
}
