import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

const TRACKING_ENABLED = process.env.NEXT_PUBLIC_ACTIVITY_TRACKING_ENABLED === "true"

const VALID_EVENT_TYPES = [
  "page_view",
  "auth_login",
  "auth_signup",
  "tool_use",
  "blog_view",
  "course_enroll",
  "lesson_complete",
] as const

export async function POST(req: NextRequest) {
  if (!TRACKING_ENABLED) {
    return NextResponse.json({ ok: true })
  }

  try {
    const body = await req.json()
    const { event_type, page_path, session_id, metadata } = body

    if (!event_type || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!VALID_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
    }

    // Get user id from session if authenticated (never trust client-sent user ids)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null
    const userAgent = req.headers.get("user-agent") ?? null

    await supabaseAdmin.from("user_activity_log").insert({
      user_id: user?.id ?? null,
      session_id: String(session_id).slice(0, 64),
      event_type,
      page_path: page_path ? String(page_path).slice(0, 500) : null,
      metadata: metadata ?? {},
      ip_address: ip,
      user_agent: userAgent,
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Never let tracking errors surface to the user
    return NextResponse.json({ ok: true })
  }
}
