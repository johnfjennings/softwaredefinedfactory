import conferenceEvents from "@/content/conferences.json"

export interface ConferenceEvent {
  name: string
  dates: string
  location: string
  region: "North America" | "Europe" | "Asia"
  description: string
  url: string
  tags: string[]
  isPast?: boolean
}

export const REGION_COLORS: Record<string, string> = {
  "North America": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Europe: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Asia: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function getMonthFromDates(dates: string): string {
  for (const month of MONTHS) {
    if (dates.includes(month)) return month
  }
  return "TBD"
}

// Event data lives in src/content/conferences.json so it can be updated
// (by hand or by automated routines) without touching TypeScript.
// Validate with: npm run validate-content
export const events: ConferenceEvent[] = conferenceEvents as ConferenceEvent[]
