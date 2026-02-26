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

const CATEGORIES = ["Sensors & Instrumentation", "SCADA / HMI", "MES", "PLC / Edge Controllers", "IIoT Platforms", "Analytics & AI", "Connectivity & Networking", "Cybersecurity", "Digital Twin", "Robotics & Automation", "Other"]
const PRICING_MODELS = ["Contact for Pricing", "Subscription", "Perpetual License", "Free", "Freemium"]

export function ProductForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState({
    name: "", slug: "", tagline: "", description: "",
    logo_url: "", cover_image_url: "",
    vendor_name: "", vendor_url: "", product_url: "",
    category: CATEGORIES[0], tags: "",
    pricing_model: PRICING_MODELS[0],
    seo_title: "", seo_description: "",
  })

  function handleNameChange(value: string) {
    setForm((f) => ({ ...f, name: value, slug: slugManual ? f.slug : slugify(value) }))
  }

  async function handleSubmit(status: "draft" | "pending_review") {
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/contributor/product-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          status,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to save"); return }
      router.push("/dashboard/contributor?tab=products")
      router.refresh()
    } catch { setError("An unexpected error occurred") }
    finally { setSaving(false) }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input id="name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Acme IIoT Platform" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" value={form.slug} onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })) }} />
          <p className="text-xs text-muted-foreground">URL: /products/{form.slug || "product-slug"}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor_name">Vendor / Manufacturer *</Label>
          <Input id="vendor_name" value={form.vendor_name} onChange={(e) => setForm((f) => ({ ...f, vendor_name: e.target.value }))} placeholder="Acme Corp" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="Connect, monitor, and optimise your factory floor" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={6} placeholder="What does this product do? What problems does it solve?" />
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_url">Vendor Website</Label>
            <Input id="vendor_url" value={form.vendor_url} onChange={(e) => setForm((f) => ({ ...f, vendor_url: e.target.value }))} placeholder="https://acme.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product_url">Product Page</Label>
            <Input id="product_url" value={form.product_url} onChange={(e) => setForm((f) => ({ ...f, product_url: e.target.value }))} placeholder="https://acme.com/products/iiot" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricing_model">Pricing Model</Label>
            <select id="pricing_model" value={form.pricing_model} onChange={(e) => setForm((f) => ({ ...f, pricing_model: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
              {PRICING_MODELS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="IIoT, MQTT, real-time monitoring (comma-separated)" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={saving || !form.name || !form.slug || !form.vendor_name}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSubmit("pending_review")} disabled={saving || !form.name || !form.slug || !form.vendor_name || !form.description}>
            {saving ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
