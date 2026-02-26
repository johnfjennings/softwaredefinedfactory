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

const COMPANY_SIZES = ["1–50", "51–200", "201–1,000", "1,000+"]

export function CompanyForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState({
    name: "", slug: "", tagline: "", description: "",
    logo_url: "", cover_image_url: "", website_url: "",
    founded_year: "", headquarters: "", company_size: COMPANY_SIZES[0],
    industry_focus: "", products_services: "",
    seo_title: "", seo_description: "",
  })

  function handleNameChange(value: string) {
    setForm((f) => ({ ...f, name: value, slug: slugManual ? f.slug : slugify(value) }))
  }

  async function handleSubmit(status: "draft" | "pending_review") {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/contributor/company-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          founded_year: form.founded_year ? parseInt(form.founded_year) : null,
          industry_focus: form.industry_focus.split(",").map((t) => t.trim()).filter(Boolean),
          status,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to save"); return }
      router.push("/dashboard/contributor?tab=companies")
      router.refresh()
    } catch { setError("An unexpected error occurred") }
    finally { setSaving(false) }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name *</Label>
          <Input id="name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Acme Manufacturing" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" value={form.slug} onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })) }} />
          <p className="text-xs text-muted-foreground">URL: /companies/{form.slug || "company-slug"}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="One-line description" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={6} placeholder="About the company..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input id="cover_image_url" value={form.cover_image_url} onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website_url">Website</Label>
          <Input id="website_url" value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} placeholder="https://acme.com" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="founded_year">Founded Year</Label>
            <Input id="founded_year" type="number" value={form.founded_year} onChange={(e) => setForm((f) => ({ ...f, founded_year: e.target.value }))} placeholder="2005" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headquarters">Headquarters</Label>
            <Input id="headquarters" value={form.headquarters} onChange={(e) => setForm((f) => ({ ...f, headquarters: e.target.value }))} placeholder="Detroit, MI" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_size">Company Size</Label>
          <select id="company_size" value={form.company_size} onChange={(e) => setForm((f) => ({ ...f, company_size: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
            {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry_focus">Industry Focus</Label>
          <Input id="industry_focus" value={form.industry_focus} onChange={(e) => setForm((f) => ({ ...f, industry_focus: e.target.value }))} placeholder="IIoT, SCADA, Predictive Maintenance (comma-separated)" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="products_services">Products & Services</Label>
          <Textarea id="products_services" value={form.products_services} onChange={(e) => setForm((f) => ({ ...f, products_services: e.target.value }))} rows={4} placeholder="Key products and services offered..." />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={saving || !form.name || !form.slug}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSubmit("pending_review")} disabled={saving || !form.name || !form.slug || !form.description}>
            {saving ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
