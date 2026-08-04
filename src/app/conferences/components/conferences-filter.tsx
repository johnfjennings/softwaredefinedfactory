"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Globe, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConferenceEvent } from "../data"
import { REGION_COLORS, MONTHS, getMonthFromDates } from "../data"

interface ConferencesFilterProps {
  events: ConferenceEvent[]
}

function groupByMonth(events: ConferenceEvent[]) {
  const grouped: Record<string, ConferenceEvent[]> = {}
  for (const event of events) {
    const month = getMonthFromDates(event.dates)
    if (!grouped[month]) grouped[month] = []
    grouped[month].push(event)
  }
  return grouped
}

export function ConferencesFilter({ events }: ConferencesFilterProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [showPast, setShowPast] = useState(false)

  const filtered = activeRegion ? events.filter((e) => e.region === activeRegion) : events
  const upcoming = filtered.filter((e) => !e.isPast)
  const past = filtered.filter((e) => e.isPast)

  const groupedUpcoming = groupByMonth(upcoming)
  const orderedUpcomingMonths = MONTHS.filter((m) => groupedUpcoming[m])
  const groupedPast = groupByMonth(past)
  const orderedPastMonths = MONTHS.filter((m) => groupedPast[m])

  const regions = Object.keys(REGION_COLORS) as (keyof typeof REGION_COLORS)[]

  const renderCard = (event: ConferenceEvent) => (
    <Card key={event.name} className={event.isPast ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{event.name}</CardTitle>
          <button
            onClick={() => setActiveRegion(activeRegion === event.region ? null : event.region)}
            className={`shrink-0 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium transition-all hover:ring-2 hover:ring-current hover:ring-offset-1 ${REGION_COLORS[event.region]} ${
              activeRegion === event.region ? "ring-2 ring-current ring-offset-1" : ""
            }`}
          >
            {event.region}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{event.dates}</span>
            {event.isPast && (
              <span className="text-xs text-foreground bg-muted px-2 py-0.5 rounded">Past</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{event.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <Button variant="outline" size="sm" asChild>
          <a href={event.url} target="_blank" rel="noopener noreferrer">
            <Globe className="mr-2 h-3.5 w-3.5" />
            Visit Website
            <ExternalLink className="ml-2 h-3 w-3" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Region Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        <button
          onClick={() => setActiveRegion(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeRegion === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/70"
          }`}
        >
          All Regions
        </button>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setActiveRegion(activeRegion === region ? null : region)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeRegion === region
                ? `${REGION_COLORS[region]} ring-2 ring-current ring-offset-1`
                : `${REGION_COLORS[region]} opacity-70 hover:opacity-100`
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Upcoming timeline */}
      {orderedUpcomingMonths.length > 0 ? (
        <div className="space-y-16">
          {orderedUpcomingMonths.map((month) => (
            <section key={month} id={month.toLowerCase()}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">{month}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">
                  {groupedUpcoming[month].length} event{groupedUpcoming[month].length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedUpcoming[month].map(renderCard)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          No upcoming events found for this region.
        </div>
      )}

      {/* Past events — collapsed by default */}
      {past.length > 0 && (
        <section className="mt-16 border-t border-border pt-8">
          <button
            onClick={() => setShowPast(!showPast)}
            aria-expanded={showPast}
            className="flex w-full items-center justify-between gap-4 text-left group"
          >
            <span className="text-2xl font-bold">
              Past Events
              <span className="ml-3 text-sm font-medium text-muted-foreground align-middle">
                {past.length} event{past.length > 1 ? "s" : ""}
              </span>
            </span>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform group-hover:text-foreground ${
                showPast ? "rotate-180" : ""
              }`}
            />
          </button>

          {showPast && (
            <div className="space-y-12 mt-8">
              {orderedPastMonths.map((month) => (
                <section key={`past-${month}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-muted-foreground">{month}</h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupedPast[month].map(renderCard)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}
