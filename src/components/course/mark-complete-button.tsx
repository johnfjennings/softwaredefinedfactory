"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { useProgress } from "./progress-provider"

interface MarkCompleteButtonProps {
  courseSlug: string
  lessonSlug: string
}

export function MarkCompleteButton({ courseSlug, lessonSlug }: MarkCompleteButtonProps) {
  const { isLessonCompleted, toggleLessonComplete } = useProgress()
  const completed = isLessonCompleted(lessonSlug)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleLessonComplete(courseSlug, lessonSlug)
    setLoading(false)
  }

  return (
    <Button
      variant={completed ? "secondary" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
      ) : (
        <Circle className="mr-2 h-4 w-4" />
      )}
      {completed ? "Completed" : "Mark Complete"}
    </Button>
  )
}
