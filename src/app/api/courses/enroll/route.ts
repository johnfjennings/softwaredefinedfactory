import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    // Check if already enrolled
    const { data: existing } = await (supabase as any)
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, message: "Already enrolled" })
    }

    const { error } = await (supabase as any)
      .from("course_enrollments")
      .insert({ user_id: user.id, course_slug: courseSlug })

    if (error) {
      console.error("Enrollment error:", error)
      return NextResponse.json({ error: "Failed to enroll" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Enrolled successfully" })
  } catch (error) {
    console.error("Enrollment error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
