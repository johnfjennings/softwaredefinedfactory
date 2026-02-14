"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, ChevronLeft, Trophy } from "lucide-react"
import { ProgressProvider, useProgress } from "./progress-provider"
import { CourseSidebar } from "./course-sidebar"
import { MarkCompleteButton } from "./mark-complete-button"
import { LessonPlayer } from "./lesson-player"
import type { LessonNavItem } from "@/types/course"

interface LessonLayoutProps {
  course: { title: string; slug: string }
  lesson: { title: string; slug: string; type: "article" | "slides" | "video" }
  allLessons: LessonNavItem[]
  completedLessons: string[]
  contentPath: string
  isEnrolled: boolean
  isAuthenticated: boolean
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export function LessonLayout({
  course,
  lesson,
  allLessons,
  completedLessons,
  contentPath,
  isEnrolled,
  isAuthenticated,
  prev,
  next,
}: LessonLayoutProps) {
  return (
    <ProgressProvider
      initialCompleted={completedLessons}
      totalLessons={allLessons.length}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-80 border-r bg-background">
          <div className="p-4 border-b">
            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to course
            </Link>
            <h2 className="font-semibold mt-2 truncate text-sm">{course.title}</h2>
          </div>
          <CourseSidebar
            lessons={allLessons}
            currentLessonSlug={lesson.slug}
            courseSlug={course.slug}
            isEnrolled={isEnrolled}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href={`/courses/${course.slug}`}
                className="lg:hidden flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <h1 className="font-medium text-sm truncate">{lesson.title}</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAuthenticated && (
                <MarkCompleteButton
                  courseSlug={course.slug}
                  lessonSlug={lesson.slug}
                />
              )}
            </div>
          </div>

          {/* Course completion banner */}
          <CompletionBanner courseSlug={course.slug} />

          {/* Lesson content */}
          <div className="flex-1 overflow-auto p-4">
            <LessonPlayer contentPath={contentPath} title={lesson.title} type={lesson.type} />
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
            {prev ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/courses/${course.slug}/learn/${prev.slug}`}>
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
                <Link href={`/courses/${course.slug}/learn/${next.slug}`}>
                  <span className="hidden sm:inline">{next.title}</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href={`/courses/${course.slug}`}>Complete Course</Link>
              </Button>
            )}
          </div>
        </main>
      </div>
    </ProgressProvider>
  )
}

function CompletionBanner({ courseSlug }: { courseSlug: string }) {
  const { justCompletedAll, progressPercent } = useProgress()

  if (!justCompletedAll) return null

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border-b border-green-500/20">
      <Trophy className="h-5 w-5 text-green-500 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-700 dark:text-green-400">
          Congratulations! You've completed all lessons in this course!
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/courses/${courseSlug}`}>View Certificate</Link>
      </Button>
    </div>
  )
}
