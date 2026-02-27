"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export function PersonForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState({
    full_name: "", slug: "", title: "", company: "", bio: "",
    avatar_url: "", cover_image_url: "",
    linkedin_url: "", twitter_url: "", website_url: "",
    expertise: "",
    seo_title: "", seo_description: "",
  })

  function handleNameChange(value: string) {
    setForm((f) => ({ ...f, full_name: value, slug: slugManual ? f.slug : slugify(value) }))
  }

  async function handleSubmit(status: "draft" | "pending_review") {
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/contributor/person-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          expertise: form.expertise.split(",").map((t) => t.trim()).filter(Boolean),
          status,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to save"); return }
      router.push("/dashboard/contributor?tab=people")
      router.refresh()
    } catch { setError("An unexpected error occurred") }
    finally { setSaving(false) }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" value={form.full_name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" value={form.slug} onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })) }} />
          <p className="text-xs text-muted-foreground">URL: /academic-providers/{form.slug || "provider-slug"}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Academic Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Professor / Researcher" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Institution</Label>
            <Input id="company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="University or Organisation" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio *</Label>
          <Textarea id="bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={6} placeholder="Academic background, research focus, and areas of expertise..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input id="avatar_url" value={form.avatar_url} onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input id="cover_image_url" value={form.cover_image_url} onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expertise">Areas of Expertise</Label>
          <Input id="expertise" value={form.expertise} onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))} placeholder="IIoT, Digital Twins, SCADA (comma-separated)" />
        </div>
        <div className="space-y-4 pt-2 border-t">
          <p className="text-sm font-medium text-muted-foreground">Social Links</p>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input id="linkedin_url" value={form.linkedin_url} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter_url">Twitter / X</Label>
            <Input id="twitter_url" value={form.twitter_url} onChange={(e) => setForm((f) => ({ ...f, twitter_url: e.target.value }))} placeholder="https://twitter.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website_url">Website</Label>
            <Input id="website_url" value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={saving || !form.full_name || !form.slug}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSubmit("pending_review")} disabled={saving || !form.full_name || !form.slug || !form.bio}>
            {saving ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
