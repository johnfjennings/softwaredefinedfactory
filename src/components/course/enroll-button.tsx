"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Play } from "lucide-react"
import Link from "next/link"

interface EnrollButtonProps {
  courseSlug: string
  isEnrolled: boolean
  isAuthenticated: boolean
  firstLessonSlug: string
}

export function EnrollButton({
  courseSlug,
  isEnrolled,
  isAuthenticated,
  firstLessonSlug,
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <Button size="lg" className="w-full" asChild>
        <Link href={`/login?redirect=/courses/${courseSlug}`}>
          Sign Up to Enroll
        </Link>
      </Button>
    )
  }

  if (enrolled) {
    return (
      <Button size="lg" className="w-full" asChild>
        <Link href={`/courses/${courseSlug}/learn/${firstLessonSlug}`}>
          <Play className="mr-2 h-4 w-4" />
          Continue Learning
        </Link>
      </Button>
    )
  }

  const handleEnroll = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll")
      }

      setEnrolled(true)
      router.push(`/courses/${courseSlug}/learn/${firstLessonSlug}`)
    } catch (err) {
      console.error("Enrollment error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="lg" className="w-full" onClick={handleEnroll} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Play className="mr-2 h-4 w-4" />
      )}
      Enroll Now — Free
    </Button>
  )
}
