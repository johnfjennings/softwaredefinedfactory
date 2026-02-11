import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, source = "unknown" } = body

    // Validate input
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .maybeSingle()

    if (existing) {
      // If they were previously unsubscribed, reactivate them
      if ((existing as any).status === "unsubscribed") {
        const { error: updateError } = await supabase
          .from("subscribers")
          .update({
            status: "active",
            full_name: full_name || null,
            source,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
          })
          .eq("id", existing.id)

        if (updateError) {
          console.error("Error reactivating subscriber:", updateError)
          return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: "Successfully resubscribed",
        })
      }

      // Already subscribed
      return NextResponse.json({
        success: true,
        message: "You're already subscribed",
      })
    }

    // Create new subscriber
    const { error: insertError } = await supabase.from("subscribers").insert({
      email: email.toLowerCase(),
      full_name: full_name || null,
      status: "active",
      source,
      subscribed_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating subscriber:", insertError)
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      )
    }

    // TODO: Send welcome email via Resend
    // TODO: Add to ConvertKit/email marketing platform

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
