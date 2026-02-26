import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireRole, CONTRIBUTOR_ROLES } from "@/lib/api/require-role"

export async function POST(request: NextRequest) {
  const auth = await requireRole(CONTRIBUTOR_ROLES)
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { name, dates, start_date, location, region, description, url, tags, status } = body

    if (!name || !dates || !location) return NextResponse.json({ error: "name, dates and location are required" }, { status: 400 })
    if (!["draft", "pending_review"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase.from("conference_proposals").insert({
      name, dates, start_date: start_date || null, location,
      region: region || null, description: description || null,
      url: url || null, tags: tags || [],
      submitted_by: auth.user.id, status,
    }).select("id").single()

    if (error) return NextResponse.json({ error: "Failed to create conference proposal" }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
