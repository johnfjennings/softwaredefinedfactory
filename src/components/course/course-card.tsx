import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen } from "lucide-react"
import type { Course } from "@/types/course"
import { COURSE_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants"

interface CourseCardProps {
  course: Course
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function CourseCard({ course }: CourseCardProps) {
  const categoryLabel =
    COURSE_CATEGORIES.find((c) => c.value === course.category)?.label || course.category
  const difficultyLabel =
    DIFFICULTY_LEVELS.find((d) => d.value === course.difficulty)?.label || course.difficulty

  return (
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className={difficultyColors[course.difficulty] || ""}>
            {difficultyLabel}
          </Badge>
          <span className="text-xs text-muted-foreground">{categoryLabel}</span>
        </div>
        <CardTitle className="line-clamp-2">
          <Link href={`/courses/${course.slug}`} className="hover:text-primary transition-colors">
            {course.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{course.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {Math.ceil(course.totalDurationMinutes / 60)}h {course.totalDurationMinutes % 60}m
          </span>
        </div>
        <div className="mt-3 text-sm font-medium">
          {course.priceCents === 0 ? (
            <span className="text-green-600 dark:text-green-400">Free</span>
          ) : (
            <span>${(course.priceCents / 100).toFixed(2)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
