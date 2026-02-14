"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface ProgressContextValue {
  completedLessons: string[]
  isLessonCompleted: (lessonSlug: string) => boolean
  toggleLessonComplete: (courseSlug: string, lessonSlug: string) => Promise<boolean>
  completedCount: number
  totalLessons: number
  progressPercent: number
  justCompletedAll: boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider")
  return ctx
}

interface ProgressProviderProps {
  initialCompleted: string[]
  totalLessons: number
  children: React.ReactNode
}

export function ProgressProvider({
  initialCompleted,
  totalLessons,
  children,
}: ProgressProviderProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>(initialCompleted)
  const [justCompletedAll, setJustCompletedAll] = useState(false)

  const isLessonCompleted = useCallback(
    (lessonSlug: string) => completedLessons.includes(lessonSlug),
    [completedLessons]
  )

  const toggleLessonComplete = useCallback(
    async (courseSlug: string, lessonSlug: string): Promise<boolean> => {
      const wasCompleted = completedLessons.includes(lessonSlug)
      const newCompleted = !wasCompleted

      try {
        const response = await fetch("/api/courses/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseSlug, lessonSlug, completed: newCompleted }),
        })

        if (response.ok) {
          const updated = newCompleted
            ? [...completedLessons, lessonSlug]
            : completedLessons.filter((s) => s !== lessonSlug)
          setCompletedLessons(updated)

          // Check if all lessons just became completed
          if (newCompleted && updated.length === totalLessons) {
            setJustCompletedAll(true)
          } else {
            setJustCompletedAll(false)
          }

          return newCompleted
        }
      } catch (err) {
        console.error("Progress update error:", err)
      }
      return wasCompleted
    },
    [completedLessons, totalLessons]
  )

  const completedCount = completedLessons.length
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        isLessonCompleted,
        toggleLessonComplete,
        completedCount,
        totalLessons,
        progressPercent,
        justCompletedAll,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
