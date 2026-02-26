import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify caller is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { role } = await request.json()
    const validRoles = ["user", "contributor", "instructor", "admin"]

    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Prevent self-demotion
    if (id === user.id && role !== "admin") {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Role update error:", error)
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Role updated" })
  } catch (error) {
    console.error("Role update error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
