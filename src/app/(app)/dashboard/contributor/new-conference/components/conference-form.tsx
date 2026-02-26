"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const REGIONS = ["North America", "Europe", "Asia", "Middle East", "Australia / Oceania", "Other"]

export function ConferenceForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "", dates: "", start_date: "", location: "",
    region: REGIONS[0], description: "", url: "", tags: "",
  })

  async function handleSubmit(status: "draft" | "pending_review") {
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/contributor/conference-proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          start_date: form.start_date || null,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          status,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to save"); return }
      router.push("/dashboard/contributor?tab=conferences")
      router.refresh()
    } catch { setError("An unexpected error occurred") }
    finally { setSaving(false) }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name *</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Hannover Messe 2027" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dates">Date Range *</Label>
            <Input id="dates" value={form.dates} onChange={(e) => setForm((f) => ({ ...f, dates: e.target.value }))} placeholder="April 22–26, 2027" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date (for sorting)</Label>
            <Input id="start_date" type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Hannover, Germany" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <select id="region" value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="What is this event about? Who attends?" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Event URL</Label>
          <Input id="url" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://hannovermesse.de" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="Industry 4.0, automation, robotics (comma-separated)" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={saving || !form.name || !form.dates || !form.location}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSubmit("pending_review")} disabled={saving || !form.name || !form.dates || !form.location}>
            {saving ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
