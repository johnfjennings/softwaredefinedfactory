import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  getCourseBySlug,
  getCourseLessons,
  getLesson,
  getLessonContentPath,
  getAdjacentLessons,
} from "@/lib/courses"
import { LessonLayout } from "@/components/course/lesson-layout"

interface PageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const lesson = getLesson(slug, lessonSlug)
  if (!lesson) notFound()

  // Check auth and enrollment
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isEnrolled = false

  if (!lesson.isPreview) {
    if (!user) redirect(`/login?redirect=/courses/${slug}/learn/${lessonSlug}`)

    const { data: enrollment } = await (supabase as any)
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .maybeSingle()

    if (!enrollment) redirect(`/courses/${slug}`)
    isEnrolled = true
  } else if (user) {
    const { data: enrollment } = await (supabase as any)
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .maybeSingle()
    isEnrolled = !!enrollment
  }

  // Fetch progress
  const allLessons = getCourseLessons(slug)
  let completedLessons: string[] = []

  if (user) {
    const { data: progress } = await (supabase as any)
      .from("course_lesson_progress")
      .select("lesson_slug")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .eq("completed", true)

    completedLessons = (progress || []).map((p: any) => p.lesson_slug)
  }

  const { prev, next } = getAdjacentLessons(slug, lessonSlug)
  const contentPath = getLessonContentPath(slug, lessonSlug)

  return (
    <LessonLayout
      course={{ title: course.title, slug: course.slug }}
      lesson={{ title: lesson.title, slug: lessonSlug, type: lesson.type }}
      allLessons={allLessons}
      completedLessons={completedLessons}
      contentPath={contentPath}
      isEnrolled={isEnrolled}
      isAuthenticated={!!user}
      prev={prev}
      next={next}
    />
  )
}
