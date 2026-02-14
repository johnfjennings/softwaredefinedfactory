import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  getCourseBySlug,
  getCourseLessons,
  getLesson,
  getLessonContentPath,
  getAdjacentLessons,
} from "@/lib/courses"
import { LessonPlayer } from "@/components/course/lesson-player"
import { CourseSidebar } from "@/components/course/course-sidebar"
import { MarkCompleteButton } from "@/components/course/mark-complete-button"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, ChevronLeft, Menu } from "lucide-react"

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

  const isCurrentCompleted = completedLessons.includes(lessonSlug)
  const { prev, next } = getAdjacentLessons(slug, lessonSlug)
  const contentPath = getLessonContentPath(slug, lessonSlug)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-80 border-r bg-background">
        <div className="p-4 border-b">
          <Link
            href={`/courses/${slug}`}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to course
          </Link>
          <h2 className="font-semibold mt-2 truncate text-sm">{course.title}</h2>
        </div>
        <CourseSidebar
          lessons={allLessons}
          currentLessonSlug={lessonSlug}
          completedLessons={completedLessons}
          courseSlug={slug}
          isEnrolled={isEnrolled}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/courses/${slug}`}
              className="lg:hidden flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-medium text-sm truncate">{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {user && (
              <MarkCompleteButton
                courseSlug={slug}
                lessonSlug={lessonSlug}
                isCompleted={isCurrentCompleted}
              />
            )}
          </div>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-auto p-4">
          <LessonPlayer contentPath={contentPath} title={lesson.title} type={lesson.type} />
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
          {prev ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/courses/${slug}/learn/${prev.slug}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{prev.title}</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {next ? (
            <Button size="sm" asChild>
              <Link href={`/courses/${slug}/learn/${next.slug}`}>
                <span className="hidden sm:inline">{next.title}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href={`/courses/${slug}`}>Complete Course</Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
