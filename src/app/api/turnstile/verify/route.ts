import { NextRequest, NextResponse } from "next/server"
import { verifyTurnstileToken } from "@/lib/turnstile"

export async function POST(request: NextRequest) {
  const { token } = await request.json()

  const isHuman = await verifyTurnstileToken(
    token,
    request.headers.get("x-forwarded-for") ?? undefined
  )

  if (!isHuman) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
