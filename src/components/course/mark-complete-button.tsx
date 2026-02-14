"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"

interface MarkCompleteButtonProps {
  courseSlug: string
  lessonSlug: string
  isCompleted: boolean
}

export function MarkCompleteButton({
  courseSlug,
  lessonSlug,
  isCompleted: initialCompleted,
}: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug, completed: !completed }),
      })

      if (response.ok) {
        setCompleted(!completed)
      }
    } catch (err) {
      console.error("Progress update error:", err)
    } finally {
      setLoading(false)
    }
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
