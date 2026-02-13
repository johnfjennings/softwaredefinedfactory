import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

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
      if (existing.status === "unsubscribed") {
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

    // Send welcome email via Resend (non-blocking — don't fail subscription if email fails)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: "Software Defined Factory <hello@softwaredefinedfactory.com>",
          to: email.toLowerCase(),
          subject: "Welcome to Software Defined Factory",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to Software Defined Factory</h1>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                ${full_name ? `Hi ${full_name},` : "Hi there,"}<br><br>
                Thanks for subscribing! You'll receive practical insights on smart manufacturing, Industry 4.0, IIoT, and factory automation.
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Here are some great places to start:
              </p>
              <ul style="font-size: 16px; color: #555; line-height: 1.8;">
                <li><a href="https://www.softwaredefinedfactory.com/blog/what-is-smart-manufacturing" style="color: #2563eb;">What is Smart Manufacturing?</a></li>
                <li><a href="https://www.softwaredefinedfactory.com/blog/industry-4-0-explained" style="color: #2563eb;">Industry 4.0 Explained</a></li>
                <li><a href="https://www.softwaredefinedfactory.com/tools/roi-calculator" style="color: #2563eb;">Free ROI Calculator</a></li>
                <li><a href="https://www.softwaredefinedfactory.com/glossary" style="color: #2563eb;">Manufacturing Glossary</a></li>
              </ul>
              <p style="font-size: 14px; color: #999; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
                Software Defined Factory — Learn smart manufacturing, Industry 4.0, and IIoT.<br>
                <a href="https://www.softwaredefinedfactory.com" style="color: #999;">www.softwaredefinedfactory.com</a><br>
                <a href="https://www.softwaredefinedfactory.com/unsubscribe" style="color: #999;">Unsubscribe</a>
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError)
      }
    }

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
