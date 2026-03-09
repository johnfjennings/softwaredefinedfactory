"use client"

import { useCallback, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const TRACKING_ENABLED = process.env.NEXT_PUBLIC_ACTIVITY_TRACKING_ENABLED === "true"

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = sessionStorage.getItem("sdf_session_id")
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem("sdf_session_id", id)
  }
  return id
}

async function sendEvent(
  event_type: string,
  page_path: string,
  metadata?: Record<string, unknown>
) {
  if (!TRACKING_ENABLED) return
  const session_id = getOrCreateSessionId()
  if (!session_id) return

  try {
    await fetch("/api/activity/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type, page_path, session_id, metadata }),
    })
  } catch {
    // Silently ignore — tracking must never break the app
  }
}

export function useActivityTracking() {
  const pathname = usePathname()
  const lastPathRef = useRef<string | null>(null)

  // Track page views on route changes
  useEffect(() => {
    if (!TRACKING_ENABLED) return
    if (pathname === lastPathRef.current) return
    lastPathRef.current = pathname
    sendEvent("page_view", pathname)
  }, [pathname])

  const trackEvent = useCallback(
    (event_type: string, metadata?: Record<string, unknown>) => {
      if (!TRACKING_ENABLED) return
      sendEvent(event_type, pathname, metadata)
    },
    [pathname]
  )

  return { trackEvent }
}

// Standalone helper for use outside of React components (e.g. form handlers)
export function trackEvent(
  event_type: string,
  page_path: string,
  metadata?: Record<string, unknown>
) {
  sendEvent(event_type, page_path, metadata)
}
