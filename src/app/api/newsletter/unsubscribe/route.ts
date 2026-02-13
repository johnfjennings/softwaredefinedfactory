import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .maybeSingle()

    if (!existing) {
      return NextResponse.json({
        success: true,
        message: "Email not found, but you won't receive any emails from us.",
      })
    }

    if (existing.status === "unsubscribed") {
      return NextResponse.json({
        success: true,
        message: "You're already unsubscribed.",
      })
    }

    const { error: updateError } = await supabase
      .from("subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", existing.id)

    if (updateError) {
      console.error("Error unsubscribing:", updateError)
      return NextResponse.json(
        { error: "Failed to unsubscribe. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed.",
    })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
