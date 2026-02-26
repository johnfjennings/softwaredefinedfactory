import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

type RequireRoleResult =
  | { user: { id: string; email?: string }; profile: { role: string }; error?: never }
  | { error: NextResponse; user?: never; profile?: never }

export async function requireRole(allowedRoles: string[]): Promise<RequireRoleResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !allowedRoles.includes(profile.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return { user, profile }
}

export const CONTRIBUTOR_ROLES = ["contributor", "instructor", "admin"]
