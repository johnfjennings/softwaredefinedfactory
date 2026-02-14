"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Lock, FileText, Presentation, Video } from "lucide-react"
import type { LessonNavItem } from "@/types/course"
import { useProgress } from "./progress-provider"

interface CourseSidebarProps {
  lessons: LessonNavItem[]
  currentLessonSlug: string
  courseSlug: string
  isEnrolled: boolean
}

const typeIcons = {
  article: FileText,
  slides: Presentation,
  video: Video,
}

export function CourseSidebar({
  lessons,
  currentLessonSlug,
  courseSlug,
  isEnrolled,
}: CourseSidebarProps) {
  const { completedLessons, completedCount, progressPercent } = useProgress()
  const totalCount = lessons.length

  // Group lessons by module
  const modules: { title: string; lessons: LessonNavItem[] }[] = []
  for (const lesson of lessons) {
    const existing = modules.find((m) => m.title === lesson.moduleTitle)
    if (existing) {
      existing.lessons.push(lesson)
    } else {
      modules.push({ title: lesson.moduleTitle, lessons: [lesson] })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {completedCount} of {totalCount} lessons complete
        </p>
      </div>

      {/* Module/Lesson list */}
      <div className="flex-1 overflow-y-auto">
        {modules.map((mod, modIndex) => (
          <div key={modIndex}>
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
              {mod.title}
            </div>
            {mod.lessons.map((lesson) => {
              const isCurrent = lesson.slug === currentLessonSlug
              const isCompleted = completedLessons.includes(lesson.slug)
              const isAccessible = lesson.isPreview || isEnrolled
              const TypeIcon = typeIcons[lesson.type]

              return (
                <Link
                  key={lesson.slug}
                  href={isAccessible ? `/courses/${courseSlug}/learn/${lesson.slug}` : "#"}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm border-b transition-colors",
                    isCurrent && "bg-primary/5 border-l-2 border-l-primary",
                    !isCurrent && isAccessible && "hover:bg-muted/50",
                    !isAccessible && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={!isAccessible ? (e) => e.preventDefault() : undefined}
                >
                  {/* Status icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : !isAccessible ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn("truncate", isCurrent && "font-medium")}>{lesson.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <TypeIcon className="h-3 w-3" />
                      <span>{lesson.durationMinutes} min</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
