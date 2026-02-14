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

    const { courseSlug, lessonSlug, completed } = await request.json()

    if (!courseSlug || !lessonSlug) {
      return NextResponse.json(
        { error: "Course slug and lesson slug are required" },
        { status: 400 }
      )
    }

    const { error } = await (supabase as any)
      .from("course_lesson_progress")
      .upsert(
        {
          user_id: user.id,
          course_slug: courseSlug,
          lesson_slug: lessonSlug,
          completed: completed ?? true,
          completed_at: completed !== false ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,course_slug,lesson_slug" }
      )

    if (error) {
      console.error("Progress update error:", error)
      return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Progress error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const courseSlug = request.nextUrl.searchParams.get("courseSlug")

    if (!courseSlug) {
      return NextResponse.json({ error: "Course slug is required" }, { status: 400 })
    }

    const { data, error } = await (supabase as any)
      .from("course_lesson_progress")
      .select("lesson_slug, completed, completed_at")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("completed", true)

    if (error) {
      console.error("Progress fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    return NextResponse.json({ progress: data || [] })
  } catch (error) {
    console.error("Progress error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
