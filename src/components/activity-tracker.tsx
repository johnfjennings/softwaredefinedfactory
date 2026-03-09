"use client"

import { useActivityTracking } from "@/lib/hooks/use-activity-tracking"

/**
 * Drop this into the root layout alongside <Analytics />.
 * It fires page_view events on every route change when
 * NEXT_PUBLIC_ACTIVITY_TRACKING_ENABLED=true.
 */
export function ActivityTracker() {
  useActivityTracking()
  return null
}
