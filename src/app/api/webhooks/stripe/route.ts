import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const courseSlug = session.metadata?.courseSlug
    const paymentIntentId = typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id

    if (!userId || !courseSlug) {
      console.error("Webhook missing metadata:", { userId, courseSlug })
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    // Idempotency check — don't process the same payment twice
    if (paymentIntentId) {
      const { data: existingPayment } = await supabaseAdmin
        .from("payments")
        .select("id")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .maybeSingle()

      if (existingPayment) {
        return NextResponse.json({ received: true, message: "Already processed" })
      }
    }

    // Create payment record
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: userId,
        stripe_payment_intent_id: paymentIntentId || null,
        stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
        amount_cents: session.amount_total || 0,
        currency: session.currency || "usd",
        status: "succeeded",
        course_slug: courseSlug,
      })

    if (paymentError) {
      console.error("Failed to create payment record:", paymentError)
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
    }

    // Create enrollment (skip if already enrolled)
    const { data: existingEnrollment } = await supabaseAdmin
      .from("course_enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_slug", courseSlug)
      .maybeSingle()

    if (!existingEnrollment) {
      const { error: enrollError } = await supabaseAdmin
        .from("course_enrollments")
        .insert({
          user_id: userId,
          course_slug: courseSlug,
        })

      if (enrollError) {
        console.error("Failed to create enrollment:", enrollError)
        return NextResponse.json({ error: "Failed to enroll user" }, { status: 500 })
      }
    }

    console.log(`Payment successful: user=${userId}, course=${courseSlug}, payment_intent=${paymentIntentId}`)
  }

  return NextResponse.json({ received: true })
}
