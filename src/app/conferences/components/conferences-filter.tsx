"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Globe, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConferenceEvent } from "../data"
import { REGION_COLORS, MONTHS, getMonthFromDates } from "../data"

interface ConferencesFilterProps {
  events: ConferenceEvent[]
}

export function ConferencesFilter({ events }: ConferencesFilterProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  const filtered = activeRegion ? events.filter((e) => e.region === activeRegion) : events

  const groupedByMonth: Record<string, ConferenceEvent[]> = {}
  for (const event of filtered) {
    const month = getMonthFromDates(event.dates)
    if (!groupedByMonth[month]) groupedByMonth[month] = []
    groupedByMonth[month].push(event)
  }
  const orderedMonths = MONTHS.filter((m) => groupedByMonth[m])

  const regions = Object.keys(REGION_COLORS) as (keyof typeof REGION_COLORS)[]

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

      {/* Timeline */}
      {orderedMonths.length > 0 ? (
        <div className="space-y-16">
          {orderedMonths.map((month) => (
            <section key={month} id={month.toLowerCase()}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">{month}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">
                  {groupedByMonth[month].length} event{groupedByMonth[month].length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedByMonth[month].map((event) => (
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
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">Past</span>
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
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium"
                          >
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
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          No events found for this region.
        </div>
      )}
    </>
  )
}
