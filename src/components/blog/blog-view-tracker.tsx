"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/hooks/use-activity-tracking"

export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent("blog_view", `/blog/${slug}`, { slug })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
