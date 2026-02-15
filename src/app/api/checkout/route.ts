import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { getCourseBySlug } from "@/lib/courses"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { courseSlug } = await request.json()

    if (!courseSlug) {
      return NextResponse.json({ error: "Course slug is required" }, { status: 400 })
    }

    const course = getCourseBySlug(courseSlug)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (course.priceCents === 0) {
      return NextResponse.json({ error: "This course is free — use the enroll endpoint" }, { status: 400 })
    }

    if (!course.stripePriceId) {
      return NextResponse.json({ error: "Course payment not configured" }, { status: 400 })
    }

    // Check if already enrolled
    const { data: existing } = await (supabase as any)
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: course.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user.id,
        courseSlug: courseSlug,
        userEmail: user.email || "",
      },
      success_url: `${siteUrl}/courses/${courseSlug}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/courses/${courseSlug}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
