import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/api/require-role"
import { supabaseAdmin } from "@/lib/supabase/admin"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { error } = await requireRole(["admin"])
  if (error) return error

  const { id } = await params
  const { is_disabled } = await req.json()

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ is_disabled: Boolean(is_disabled) })
    .eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
